import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  timeToRead: string;

  // @IsString()
  // @IsNotEmpty()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  level: 'beginner' | 'intermediate' | 'advanced';

  @IsNumber()
  @IsNotEmpty()
  price: string;

  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @IsOptional()
  @IsEnum(['image', 'video'])
  mediaType?: 'image' | 'video';

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;
}
