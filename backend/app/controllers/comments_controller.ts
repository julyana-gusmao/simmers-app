import type { HttpContext } from '@adonisjs/core/http'
import Comment from '../models/comment.js'
import Post from '../models/post.js'

export default class CommentsController {
  public async store({ request, response }: HttpContext) {
    const { userId, postId, content } = request.only(['userId', 'postId', 'content'])

    const post = await Post.find(postId)
    if (!post) {
      return response.notFound({ message: 'Post not found' })
    }

    const comment = new Comment()
    comment.userId = userId
    comment.postId = postId
    comment.content = content
    await comment.save()

    return response.created({ message: 'Comment created successfully', data: comment })
  }

  public async index({ response }: HttpContext) {
    const comments = await Comment.all()
    return response.ok({ data: comments })
  }

  public async update({ request, response, params }: HttpContext) {
    const comment = await Comment.find(params.id)
    if (!comment) {
      return response.notFound({ message: 'Comment not found' })
    }

    comment.merge(request.only(['content']))
    await comment.save()

    return response.ok({ message: 'Comment updated successfully', data: comment })
  }

  public async destroy({ response, params }: HttpContext) {
    const comment = await Comment.find(params.id)
    if (!comment) {
      return response.notFound({ message: 'Comment not found' })
    }

    await comment.delete()

    return response.ok({ message: 'Comment deleted successfully' })
  }
}
