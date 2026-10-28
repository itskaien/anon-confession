const express = require("express");
const confessionRouter = require("./routes/confessionRoute");

const app = express();
app.use(express.json());

app.use("/", confessionRouter);

module.exports = app;
