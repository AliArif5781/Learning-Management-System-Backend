import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from '../types/user.types';
import { ref } from 'process';
import { Course } from 'src/course/schemas/course.schema';
import { IsOptional, IsString } from 'class-validator';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  @IsOptional()
  profession?: string;

  @Prop()
  @IsOptional()
  Education?: string;

  @Prop()
  @IsOptional()
  techStack?: string;

  @Prop()
  @IsOptional()
  country?: string;

  @Prop()
  @IsOptional()
  mediaUrl: string;

  @Prop()
  @IsOptional()
  mediaType: 'image' | 'video';

  @Prop()
  @IsOptional()
  thumbnailUrl: string;

  @Prop({ default: Role.Student })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
