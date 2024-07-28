import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schema/user.schema';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.findUsers();
  }

  @Post()
  async createUser(@Body() user: any) {
    const newUser = await this.userService.createUser(user);
    return newUser;
  }

  @Get(':id')
  async name(@Param() id: string) {
    // console.log(id);
    return this.userService.getUser(id);
  }

  @Put(':id')
  async updateUser(@Param() id: string, @Body() user: User) {
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  async deleteUser(@Param() id: string) {
    return this.userService.deleteUser(id);
  }
}
