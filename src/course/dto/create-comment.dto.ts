import { IsNotEmpty, IsString } from 'class-validator';
export class CreateCourseCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;
}
