import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({
  timestamps: true,
})
export class Course {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  price: string;

  @Prop()
  @IsOptional()
  mediaUrl: string;

  @Prop()
  timeToRead: string;

  @Prop()
  @IsOptional()
  mediaType: 'image' | 'video';

  @Prop()
  @IsOptional()
  thumbnailUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
