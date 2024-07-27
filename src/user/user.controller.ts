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
    const newUser = await this.userService.createUser(user);
    console.log(newUser);
  }

  @Get(':id')
  async name(@Param() id: string) {
    // console.log(id);
    return this.userService.getUser(id);
  }
}
