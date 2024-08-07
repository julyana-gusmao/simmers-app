import Follower from '#models/follower'
import type { HttpContext } from '@adonisjs/core/http'
import Post from '../models/post.js'

export default class PostsController {
  public async index({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    const limit = request.input('limit', 5)
    const offset = (page - 1) * limit

    const following = await Follower.query()
      .where('followerId', user.id)
      .select('userId')

    const followingIds = following.map((follow) => follow.userId)

    followingIds.push(user.id)

    const posts = await Post.query()
      .whereIn('userId', followingIds)
      .preload('user', (userQuery) => {
        userQuery.select('id', 'firstName', 'lastName', 'profilePicture')
      })
      .withCount('comments')
      .orderBy('createdAt', 'desc')
      .offset(offset)
      .limit(limit)

    const totalPostsResult = await Post.query()
      .whereIn('userId', followingIds)
      .count('* as total')

    const totalPosts = totalPostsResult[0].$extras.total
    const totalPages = Math.ceil(totalPosts / limit)

    return response.ok({ data: posts, total: totalPosts, totalPages, page })
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

  public async show({ auth, params, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const post = await Post.query()
      .where('id', params.id)
      .preload('user')
      .preload('comments', (query) => {
        query.preload('user')
      })
      .firstOrFail()

    return response.ok(post)
  }

  public async getAllPosts({ auth, request, response }: HttpContext) {
    if (!auth.isAuthenticated) {
      return response.unauthorized({ message: 'User not authenticated' })
    }

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const offset = (page - 1) * limit

    const posts = await Post.query()
      .preload('user', (userQuery) => {
        userQuery.select('id', 'firstName', 'lastName', 'profilePicture')
      })
      .withCount('comments')
      .orderBy('createdAt', 'desc')
      .offset(offset)
      .limit(limit)

    return response.ok(posts)
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
