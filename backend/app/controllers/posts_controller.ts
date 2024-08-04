import type { HttpContext } from '@adonisjs/core/http'
import Post from '../models/post.js'

export default class PostsController {
  public async index({ response }: HttpContext) {
    const posts = await Post.all()
    return response.ok(posts)
  }

  public async store({ request, response }: HttpContext) {
    const postData = request.only(['userId', 'content'])

    const post = new Post()
    post.userId = postData.userId
    post.content = postData.content
    await post.save()

    return response.created({ message: 'Post created successfully', data: post })
  }

  public async show({ params, response }: HttpContext) {
    try {
      const post = await Post.findOrFail(params.id)
      return response.ok(post)
    } catch {
      return response.notFound({ message: 'Post not found' })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const post = await Post.findOrFail(params.id)
      post.merge(request.only(['content']))
      await post.save()
      return response.ok({ message: 'Post updated successfully', data: post })
    } catch {
      return response.notFound({ message: 'Post not found' })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const post = await Post.findOrFail(params.id)
      await post.delete()
      return response.ok({ message: 'Post deleted successfully' })
    } catch {
      return response.notFound({ message: 'Post not found' })
    }
  }
}
