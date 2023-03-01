const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const connectDatabase = () => {
  mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName:"mlmatery" })
    .then(() => {
      console.log("Mongoose Connected");
    });
  mongoose.set("strictQuery", true);
};

module.exports = connectDatabase;
