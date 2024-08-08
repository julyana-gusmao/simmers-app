import Follower from '#models/follower';
import Post from '#models/post';
import type { HttpContext } from '@adonisjs/core/http';
import Hash from '@adonisjs/core/services/hash';
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model';
import User from '../models/user.js';

export default class UsersController {

  public async index({ response }: HttpContext) {
    const users = await User.query()
      .preload('posts')
      .preload('following', (query: ModelQueryBuilderContract<typeof Follower, Follower>) => {
        query.preload('user', (userQuery: ModelQueryBuilderContract<typeof User, User>) => {
          userQuery.select('id', 'firstName', 'lastName', 'email', 'profilePicture');
        });
      });
    return response.ok(users);
  }

  public async getUserPosts({ params, request, response }: HttpContext) {
    const userId = params.id;
    const page = request.input('page', 1);
    const limit = request.input('limit', 5);
    const offset = (page - 1) * limit;

    const posts = await Post.query()
      .where('user_id', userId)
      .preload('user')
      .withCount('comments')
      .orderBy('createdAt', 'desc')
      .offset(offset)
      .limit(limit);

    return response.ok(posts);
  }

  public async show({ params, response }: HttpContext) {
    try {
      const user = await User.query()
        .where('id', params.id)
        .preload('posts', (postQuery: ModelQueryBuilderContract<typeof Post>) => {
          postQuery.preload('user')
          postQuery.withCount('comments')
        })
        .preload('followers')
        .firstOrFail()

      await user.load('following', (query: ModelQueryBuilderContract<typeof Follower>) => {
        query.preload('user', (userQuery: ModelQueryBuilderContract<typeof User>) => {
          userQuery.select('id', 'firstName', 'lastName', 'email', 'profilePicture')
        })
      })

      return response.ok({
        user,
        followersCount: user.followers.length,
      })
    } catch {
      return response.notFound({ message: 'User not found' })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id);
      user.merge(request.only(['firstName', 'lastName', 'birthDate', 'phone', 'email']));
      await user.save();
      return response.ok({ message: 'User updated successfully', data: user });
    } catch (error) {
      console.error('Error updating user:', error);
      return response.notFound({ message: 'User not found' });
    }
  }

  public async updatePassword({ auth, request, response }: HttpContext) {
    const user = auth.user!;
    const { currentPassword, newPassword } = request.all();

    const passwordVerified = await Hash.verify(user.password, currentPassword);
    if (!passwordVerified) {
      return response.badRequest({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const tokens = await User.accessTokens.all(user);
    for (const token of tokens) {
      await User.accessTokens.delete(user, token.identifier);
    }

    const token = await User.accessTokens.create(user);

    return response.ok({ message: 'Password updated successfully', token });
  }

  public async updateProfilePicture({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const profilePic = request.file('profilePicture', {
      extnames: ['jpg', 'png', 'jpeg'],
      size: '2mb',
    })

    if (!profilePic) {
      return response.badRequest({ message: 'Profile picture is required' })
    }

    await profilePic.move('public/uploads', {
      name: `${new Date().getTime()}.${profilePic.extname}`,
      overwrite: true,
    })

    user.profilePicture = `/uploads/${profilePic.fileName}`
    await user.save()

    return response.ok({ message: 'Profile picture updated successfully', data: user })
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()
      return response.ok({ message: 'User deleted successfully' })
    } catch {
      return response.notFound({ message: 'User not found' })
    }
  }
}
