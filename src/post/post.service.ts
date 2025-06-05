import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
  ) {}
  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = new Post();
    post.title = createPostDto.title;
    post.content = createPostDto.content;

    let user = await this.userService.findOne(createPostDto.userId);
    if (!user) {
      throw new NotFoundException(
        `User with id ${createPostDto.userId} not found`,
      );
    }

    post.user = user;

    return this.postRepository.save(post);
  }

  findAll(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Post | null> {
    let post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    if (post?.user.id !== updatePostDto.userId) {
      throw new NotFoundException(
        `You have entered Wrong userId: ${updatePostDto.userId}`,
      );
    }

    post.title = updatePostDto.title ?? post.title;
    post.content = updatePostDto.content ?? post.content;

    return await this.postRepository.save(post);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.postRepository.delete(id);
  }
}
