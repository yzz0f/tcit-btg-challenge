import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post as HttpPost,
} from '@nestjs/common';
import { API_ROUTES, Post as PostContract } from '@tcit/shared';
import { CreatePost } from '../../application/create-post.use-case';
import { DeletePost } from '../../application/delete-post.use-case';
import { ListPosts } from '../../application/list-posts.use-case';
import { PostNotFoundError } from '../../domain/post-not-found.error';
import { CreatePostRequest } from './create-post.request';
import { toPostResponse } from './post.presenter';

@Controller(API_ROUTES.posts)
export class PostsController {
  constructor(
    private readonly listPosts: ListPosts,
    private readonly createPost: CreatePost,
    private readonly deletePost: DeletePost,
  ) {}

  @Get()
  async list(): Promise<PostContract[]> {
    const posts = await this.listPosts.execute();

    return posts.map(toPostResponse);
  }

  @HttpPost()
  async create(@Body() request: CreatePostRequest): Promise<PostContract> {
    const post = await this.createPost.execute(request);

    return toPostResponse(post);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    try {
      await this.deletePost.execute(id);
    } catch (error) {
      if (error instanceof PostNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
