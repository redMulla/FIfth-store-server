import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async findUsers(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  async createUser(user: User): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async getUser(id: string): Promise<UserDocument> {
    const { ObjectId } = require('mongoose');
    const newObectId = new ObjectId(id);
    console.log(newObectId);
    return await this.userModel.findById(newObectId).exec();
  }
}
