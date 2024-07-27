import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'manager' | 'staff';

@Schema()
class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id: string;

  @Prop({
    type: String,
    enum: ['admin', 'manager', 'staff'],
    required: true,
    default: 'staff',
  })
  role: UserRole;

  @Prop({
    type: String,
    required: [true, 'Please add a name'],
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'], // Improved email regex
  })
  email: string;

  @Prop({
    type: String,
    required: [true, 'Please add a Phone number'],
    unique: true,
  })
  phone: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
  })
  photo: string;

  @Prop({ type: Date })
  lastLogin: Date;

  @Prop([
    {
      token: {
        type: String,
        default: '',
      },
      country: {
        type: String,
        default: '',
      },
      ipAddress: {
        type: String,
        default: '',
      },
      device: {
        type: String,
        default: '',
      },
    },
  ])
  tokens: {
    token: string;
    country: string;
    ipAddress: string;
    device: string;
  }[];
}

const UserSchema = SchemaFactory.createForClass(User);
type UserDocument = User & Document;
// Encrypting password before saving DB
UserSchema.pre('save', async function (next) {
  const user = this as any; // Type assertion due to Mongoose's typing
  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

export { UserSchema, User, UserDocument };
