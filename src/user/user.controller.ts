import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.findUsers();
  }

  @Post()
  async createUser(@Body() user: any) {
    console.log(user, 'user created');
    return this.userService.createUser(user);
  }

  @Get(':id')
  async name(@Param() id: string) {
    console.log(id);
    return this.userService.getUser(id);
  }
}
