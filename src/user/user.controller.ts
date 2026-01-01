import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import type { UpdateProfileDto } from './types/user.types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('updateProfile')
  @UseGuards(AuthGuard)
  updateUseProfile(@Req() req, @Body() updateUserData: UpdateProfileDto) {
    const userId = req.user.sub;
    return this.userService.updateUser(userId, updateUserData);
  }
}
