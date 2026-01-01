import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course, CourseSchema } from './schemas/course.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { CourseComment, CourseCommentSchema } from './schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: CourseComment.name, schema: CourseCommentSchema },
    ]),
    UserModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
