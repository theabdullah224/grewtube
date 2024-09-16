import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string; 
  links: { url: string; createdAt: Date }[];
}


const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user', // Default role is 'user', can also be 'admin'
  },
  links: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      url: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now, 
      },
    },
  ],
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;


