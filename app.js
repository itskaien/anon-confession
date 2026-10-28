const express = require("express");
const cors = require("cors");
const confessionRouter = require("./routes/confessionRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", confessionRouter);

module.exports = app;
