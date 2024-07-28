import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async findUsers(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  async createUser(user: User): Promise<UserDocument> {
    if (!user.email) {
      throw new BadRequestException('Email is required');
    }

    if (!user.phone) {
      throw new BadRequestException('Phone is required');
    }

    if (!user.password) {
      throw new BadRequestException('Password is required');
    }

    if (!user.name) {
      throw new BadRequestException('Name is required');
    }

    const existingUser = await this.userModel
      .findOne({ $or: [{ email: user.email }, { phone: user.phone }] })
      .exec();
    if (existingUser) {
      throw new BadRequestException('Phone or email already exists');
    }

    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async getUser(id: string): Promise<UserDocument> {
    // const { ObjectId } = require('mongoose');
    const objectId = new Types.ObjectId(id);
    const user = await this.userModel
      .findById(objectId)
      .select('-password')
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(user);
    return user;
  }

  async updateUser(id: string, user: User): Promise<UserDocument> {
    const objectId = new Types.ObjectId(id);
    const updatedUser = await this.userModel
      .findByIdAndUpdate(objectId, user, { new: true })
      .select('-password')
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('User not updated');
    }
    return updatedUser;
  }

  async deleteUser(id: string) {
    const objectId = new Types.ObjectId(id);
    const deletedUser = await this.userModel.findByIdAndDelete(objectId).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not deleted');
    }
    return deletedUser;
  }

  async login(email: string, password: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const user = await this.userModel
      .findOne({ email })
      .select('-password')
      .exec();

    if (!user) {
      throw new NotFoundException('Wrong credentials');
    }

    const passHash = await bcrypt.compare(password, user.password);

    if (!passHash) {
      throw new BadRequestException('Invalid password');
    }
    return user;
  }
}
