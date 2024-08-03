import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signIn(email: string, pass: string) {
    const user = await this.userService.getUserByMail(email);

    if (!pass) {
      throw new BadRequestException('Password is required');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const { password, ...result } = user.toJSON();
    return result;
  }
}
