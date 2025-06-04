import { IsArray, IsString } from "class-validator";
import { Post } from "src/post/entities/post.entity";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsArray()
    posts: Post[];
}
