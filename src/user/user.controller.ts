import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schema/user.schema';
import { AuthGuard } from '../auth/auth.guard';
import { AdminAuthGuard } from '../admin-auth/admin-auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AdminAuthGuard)
  async getUsers() {
    return this.userService.findUsers();
  }

  @Post()
  @UseGuards(AdminAuthGuard)
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
  @UseGuards(AdminAuthGuard)
  async deleteUser(@Param() id: string) {
    return this.userService.deleteUser(id);
  }

  @Post('login')
  async login(@Body() user: any) {
    return this.userService.login(user.email, user.password);
  }
}
