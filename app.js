const http = require("http");
const cors = require("cors");
const express = require("express");
const app = express();

const server = http.createServer(app);

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

////////
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middlewares/error");
// config
require("dotenv").config({ path: "./.env" });

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
const user = require("./routes/userRoute");

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});

app.use("/api/v1", user);

app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
  res.send("Server is Running! ");
});
app.use(errorMiddleware);

module.exports = server;
