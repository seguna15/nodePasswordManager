const mongoose = require("mongoose");

let schema = new mongoose.Schema({
  password: String,
  title: String ,
  slug: String,
  iv: String,
});

const Passworddb = mongoose.model("passworddb", schema);

module.exports = Passworddb;

