import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true
      },
      phone: {
            type: String,
            required: true
      },
      email: {
            type: String,
            required: true
      },
      password: {
            type: String,
            required: true
      },
      confirmPassword: {
            type: String,
            required: true
      }
});

const USER = new mongoose.model("UsersForCheck", userSchema);
export default USER;