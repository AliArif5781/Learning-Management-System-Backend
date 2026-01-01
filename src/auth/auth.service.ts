import { Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto, RegisterDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Register user functionalityy
  async registerUser(registerUserDto: RegisterDto) {
    const hash = await bcrypt.hash(registerUserDto.password, 10);

    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hash,
    });

    const payload = { sub: user._id.toString(), role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    const userObj = user.toObject();
    return {
      accessToken,
      user: {
        id: userObj._id.toString(),
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        role: userObj.role,
      },
    };
  }

  // Login User functionality
  async loginUser(loginUserDto: LoginDto) {
    const { email, password } = loginUserDto;

    const user = await this.userService.findByEmailForLogin(loginUserDto);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user._id.toString(), role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    const userObj =
      typeof user.toObject === 'function' ? user.toObject() : user;

    return {
      accessToken,
      user: {
        id: userObj._id?.toString?.() ?? userObj._id,
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        email: userObj.email,
        role: userObj.role,
      },
    };
  }
}
