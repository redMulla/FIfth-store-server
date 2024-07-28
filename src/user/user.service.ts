import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
}
