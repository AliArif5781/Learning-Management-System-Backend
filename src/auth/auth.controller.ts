import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/registerUser.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';
import type { Response } from 'express';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async register(
    @Body() registerUserDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } =
      await this.authService.registerUser(registerUserDto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
    });

    return { message: 'SignUp Successfully' };
  }

  @Post('login')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  // @SkipThrottle()
  async login(
    @Body() loginUserDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } =
      await this.authService.loginUser(loginUserDto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      // secure: true,
      // sameSite: 'strict',
      // sameSite: 'lax',
    });
    return { accessToken, message: 'Logged in successfully', user };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    // @Request
    const userId = req.user.sub;
    // console.log(userId, 'Profile- userID');
    const user = await this.userService.getUserById(userId);
    return user;
  }

  @Delete('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // res.cookie('accessToken', '', {
    //   httpOnly: true,
    // });
    res.clearCookie('accessToken');
    return { message: 'Logged out successfully' };
  }
}
