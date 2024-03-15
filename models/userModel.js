import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  birthdate: Date,
  gender: String,
  type: String,
});

const userModel = mongoose.model('user', userSchema);

export default userModel;
