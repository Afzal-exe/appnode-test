const mongoose = require('mongoose'); // Assuming Mongoose for interacting with database (replace with your ORM)

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
