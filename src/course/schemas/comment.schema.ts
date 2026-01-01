import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ref } from 'process';

export type CourseCommentDocument = HydratedDocument<CourseComment>;

@Schema({ timestamps: true })
export class CourseComment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  course: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  likes: mongoose.Types.ObjectId[];

  @Prop({ required: true })
  comment: string;
}

export const CourseCommentSchema = SchemaFactory.createForClass(CourseComment);
