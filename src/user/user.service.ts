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
    return await this.userModel.find().select('-password').exec();
  }

  async createUser(user: User) {
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
      .select('-password')
      .exec();
    if (existingUser) {
      throw new BadRequestException('Phone or email already exists');
    }

    const newUser = await new this.userModel(user).save();

    const { password, ...result } = newUser.toJSON();

    return result;
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

  async getUserByMail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
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

    const { password, ...result } = deletedUser.toJSON();

    return result;
  }

  async checkPassword(user: UserDocument, pass: string): Promise<boolean> {
    const fullUser = await this.userModel.findOne({ email: user.email });

    return await bcrypt.compare(pass, fullUser.password);
  }

  async login(email: string, pass: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    if (!pass) {
      throw new BadRequestException('Password is required');
    }

    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new NotFoundException('Wrong credentials');
    }

    const passHash = await bcrypt.compare(pass, user.password);

    console.log(passHash);

    if (!passHash) {
      throw new BadRequestException('Invalid password');
    }

    const { password, ...response } = user.toJSON();
    return response;
  }
}
