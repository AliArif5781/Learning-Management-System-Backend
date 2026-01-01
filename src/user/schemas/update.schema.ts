import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

export type UpdateUserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @IsOptional()
  @IsString()
  @Prop()
  firstName: string;

  @IsOptional()
  @IsString()
  @Prop()
  lastName: string;

  @Prop()
  @IsString()
  @IsOptional()
  profession?: string;

  @Prop()
  @IsString()
  @IsOptional()
  Education?: string;

  @Prop()
  @IsString()
  @IsOptional()
  techStack?: string;

  @Prop()
  @IsString()
  @IsOptional()
  country?: string;
}

export const updateUserSchema = SchemaFactory.createForClass(User);
