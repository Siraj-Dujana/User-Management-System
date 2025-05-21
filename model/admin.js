
const mongoose = require('mongoose');

// Mongoose Schema and Model
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const Admin = mongoose.model('admin', userSchema);

module.exports=Admin