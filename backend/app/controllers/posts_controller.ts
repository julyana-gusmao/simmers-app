import type { HttpContext } from '@adonisjs/core/http'
import Post from '../models/post.js'
import Follower from '#models/follower';

export default class PostsController {


  public async index({ auth, response }: HttpContext) {
    const user = auth.user!;

    const userPosts = await Post.query().where('userId', user.id).preload('user');

    const following = await Follower.query().where('followerId', user.id).select('userId');
    const followingIds = following.map(follow => follow.userId);

    let followingPosts: Post[] = [];
    
    if (followingIds.length > 0) {
        followingPosts = await Post.query()
          .whereIn('userId', followingIds)
          .preload('user')
          .orderBy('createdAt', 'desc');
    }

    const posts = [...userPosts, ...followingPosts].sort((a, b) => {
        return new Date(b.createdAt.toString()).getTime() - new Date(a.createdAt.toString()).getTime();
    });

    return response.ok(posts);
}

  
  public async store({ auth, request, response }: HttpContext) {
    const user = auth.user!

    const { content } = request.only(['content'])

    if (!content) {
      return response.badRequest({ message: 'Content is required' })
    }

    const post = new Post()
    post.userId = user.id
    post.content = content
    await post.save()

    return response.created({ message: 'Post created successfully', data: post })
  }

  public async show({ params, response }: HttpContext) {
    try {
      const post = await Post.query().where('id', params.id).preload('user').firstOrFail()
      return response.ok(post)
    } catch {
      return response.notFound({ message: 'Post not found' })
    }
  }

  public async update({ params, request, response, auth }: HttpContext) {
    try {
      const user = auth.user!
      const post = await Post.findOrFail(params.id)
      
      if (post.userId !== user.id) {
        return response.unauthorized({ message: 'You are not allowed to update this post' })
      }
      
      post.merge(request.only(['content']))
      await post.save()
      return response.ok({ message: 'Post updated successfully', data: post })
    } catch {
      return response.notFound({ message: 'Post not found' })
    }
  }

  public async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!
      const post = await Post.findOrFail(params.id)
      
      if (post.userId !== user.id) {
        return response.unauthorized({ message: 'You are not allowed to delete this post' })
      }
      
      await post.delete()
      return response.ok({ message: 'Post deleted successfully' })
    } catch {
      return response.notFound({ message: 'Post not found' })
    }
  }
}
