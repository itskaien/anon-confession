const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({
  connectionString,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
