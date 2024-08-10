import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

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
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken, user: result };
  }
}
