import { Injectable } from '@nestjs/common';




@Injectable()
export class AppService {
  getHello(): any {
    return {
      message:"Hello world it working backend to frontend",
    };
  }
}
