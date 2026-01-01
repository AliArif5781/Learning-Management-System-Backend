import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto, RegisterDto } from 'src/auth/dto/registerUser.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateProfileDto } from './types/user.types';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Register
  async createUser(registerUserDto: RegisterDto) {
    try {
      return await this.userModel.create({
        firstName: registerUserDto.firstName,
        lastName: registerUserDto.lastName,
        email: registerUserDto.email,
        password: registerUserDto.password,
        mediaType: registerUserDto.mediaType,
        thumbnailUrl: registerUserDto.thumbnailUrl,
        mediaUrl: registerUserDto.mediaUrl,
      });
    } catch (error) {
      const e = error as { code?: number };
      const Duplicate_Key_Code = 11000;

      if (e.code === Duplicate_Key_Code) {
        const field = Object.keys(error.keyValue)[0];

        throw new ConflictException(`${field} already exists`);
      }

      throw error;
    }
  }
  //  Login
  async findByEmailForLogin(loginUserDto: LoginDto) {
    const { email, password } = loginUserDto;

    return this.userModel.findOne({ email }).select('+password').exec();
  }

  // Profile
  async getUserById(id: string) {
    return await this.userModel.findOne({ _id: id });
  }

  // updateUserProfile
  async updateUser(userId: string, dto: UpdateProfileDto) {
    return await this.userModel
      .findByIdAndUpdate(userId, { $set: dto }, { new: true })
      .select('-password');
  }
}
