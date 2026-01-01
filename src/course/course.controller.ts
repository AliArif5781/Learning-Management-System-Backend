import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Response,
  Res,
  Req,
  Request,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/user.types';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserService } from 'src/user/user.service';
import ImageKit from 'imagekit';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateCourseCommentDto } from './dto/create-comment.dto';
import { PaginationDto } from './dto/pagination.dto';
import { userLikeDto } from './dto/user-like-dto';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly userService: UserService,
  ) {}

  @Post('')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    const userId = req.user.sub;
    return this.courseService.create(createCourseDto, userId);
  }

  @Post(':id/userComment')
  @UseGuards(AuthGuard)
  async userComment(
    @Param('id') courseId: string,
    @Body() dto: CreateCourseCommentDto,
    @Req() req,
  ) {
    const userId = req.user.sub;
    return this.courseService.createComment(courseId, userId, dto.comment);
  }

  @Get('')
  getAssest() {
    const assest = imagekit.getAuthenticationParameters();
    return assest;
  }

  // get All courses
  @Get('getAllCourses')
  @UseGuards(AuthGuard)
  @SkipThrottle()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.courseService.findAll(paginationDto);
  }

  @Get(':id')
  @SkipThrottle()
  async findOne(@Param('id') id: string) {
    return await this.courseService.findOne(id);
  }

  // getUserLikes
  @Post('userLikes')
  @SkipThrottle()
  async handleLike(@Body() likeUserDto: userLikeDto) {
    const { commentId, likeUser } = likeUserDto;
    return this.courseService.likeComment(commentId, likeUser);
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
  //   return this.courseService.update(+id, updateCourseDto);
  // }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
