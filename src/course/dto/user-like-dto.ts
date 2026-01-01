import { IsNotEmpty, IsString } from 'class-validator';
export class userLikeDto {
  @IsString()
  @IsNotEmpty()
  likeUser: string;

  @IsString()
  @IsNotEmpty()
  commentId: string;
}
