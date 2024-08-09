import type { HttpContext } from '@adonisjs/core/http';
import Comment from '../models/comment.js';
import Post from '#models/post';

export default class CommentsController {
  public async store({ request, auth, response }: HttpContext) {
    const user = auth.user!;
    const { postId, content } = request.only(['postId', 'content']);

    if (!content) {
      return response.badRequest({ message: 'Content is required' });
    }

    const comment = await Comment.create({
      content,
      postId,
      userId: user.id,
    });

    await comment.load('user');

    return response.created({ message: 'Comment created successfully', data: comment });
  }

  public async index({ params, request, response }: HttpContext) {
    const postId = params.postId;
    const page = request.input('page', 1);
    const limit = request.input('limit', 5);
    const offset = (page - 1) * limit;

    const comments = await Comment.query()
      .where('postId', postId)
      .preload('user')
      .offset(offset)
      .limit(limit)
      .orderBy('createdAt', 'asc');

    return response.ok({ data: comments });
  }

  public async update({ request, response, params, auth }: HttpContext) {
    const user = auth.user!;
    const comment = await Comment.find(params.id);

    if (!comment) {
      return response.notFound({ message: 'Comment not found' });
    }

    if (comment.userId !== user.id) {
      return response.unauthorized({ message: 'You are not allowed to update this comment' });
    }

    comment.merge(request.only(['content']));
    await comment.save();

    return response.ok({ message: 'Comment updated successfully', data: comment });
  }

  public async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!;
    const comment = await Comment.find(params.id);

    if (!comment) {
      return response.notFound({ message: 'Comment not found' });
    }

    const post = await Post.find(comment.postId);
    if (comment.userId !== user.id && post?.userId !== user.id) {
      return response.unauthorized({ message: 'You are not allowed to delete this comment' });
    }

    await comment.delete();

    return response.ok({ message: 'Comment deleted successfully' });
  }

}
