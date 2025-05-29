import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/user/user.service';
import { UserDocument } from 'src/users/user/user.schema';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = (user as UserDocument).toObject();
      console.log('password', password);
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
      username: user.username,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDto: any) {
    const existing = await this.usersService.findByEmail(userDto.email);
    if (existing) throw new UnauthorizedException('Email already registered');
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = await this.usersService.create({
      email: userDto.email,
      username: userDto.username,
      password: hashedPassword,
      role: userDto.role,
    });
    return this.login(newUser);
  }
}
