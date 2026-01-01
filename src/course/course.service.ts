import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/course.schema';
import mongoose, { Model } from 'mongoose';
import { CourseComment, CourseCommentDocument } from './schemas/comment.schema';
import { PaginationDto } from './dto/pagination.dto';
import { userLikeDto } from './dto/user-like-dto';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(CourseComment.name)
    private commentModel: Model<CourseCommentDocument>,
  ) {}

  async create(createCourseDto: CreateCourseDto, userId: string) {
    return await this.courseModel.create({
      name: createCourseDto.name,
      description: createCourseDto.description,
      level: createCourseDto.level,
      price: createCourseDto.price,
      mediaUrl: createCourseDto.mediaUrl,
      mediaType: createCourseDto.mediaType,
      thumbnailUrl: createCourseDto.thumbnailUrl,
      timeToRead: createCourseDto.timeToRead,
      user: userId,
    });
    // 241
  }

  // get all courses
  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto;
    const [courses, total] = await Promise.all([
      this.courseModel
        .find()
        .populate(
          'user',
          'firstName lastName email role mediaUrl mediaType thumbnailUrl',
        )
        // .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean()
        .exec(),
      this.courseModel.countDocuments(),
    ]);

    return {
      data: courses,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  // get clicked course
  async findOne(id: string) {
    const course = await this.courseModel
      .findById(id)
      .populate(
        'user',
        'firstName lastName email role mediaUrl mediaType thumbnailUrl',
      )
      .lean();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const comments = await this.commentModel
      .find({ course: id })
      .populate('user', 'firstName lastName thumbnailUrl')
      .populate('likes', 'firstName lastName thumbnailUrl') // ✅ IMPORTANT
      .sort({ createdAt: -1 })
      .lean();

    return {
      ...course,
      comment: comments,
    };
  }

  // create comment

  async createComment(courseId: string, userId: string, comment: string) {
    const newComment = await this.commentModel.create({
      course: courseId,
      user: userId,
      comment,
    });

    return newComment.populate('user', 'firstName lastName thumbnailUrl');
  }
  // update(id: number, updateCourseDto: UpdateCourseDto) {
  //   return `This action updates a #${id} course`;
  // }

  async likeComment(commentId: string, likeUser: string) {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new Error('Comment not found');

    const userIndex = comment.likes.findIndex(
      (id: mongoose.Types.ObjectId) => id.toString() === likeUser,
    );

    if (userIndex === -1) {
      comment.likes.push(new mongoose.Types.ObjectId(likeUser));
    } else {
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();

    const commentWithLikes = await this.commentModel
      .findById(commentId)
      .populate('likes', 'firstName lastName thumbnailUrl')
      .populate('user', 'firstName lastName thumbnailUrl');

    const countLikes = commentWithLikes?.likes.length || 0;

    return {
      commentLike: commentWithLikes,
      countLikes,
    };
  }

  async remove(id: string) {
    return await this.courseModel.findByIdAndDelete(id);
  }
}
