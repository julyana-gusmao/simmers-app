import type { HttpContext } from '@adonisjs/core/http'
import Follower from '../models/follower.js'

export default class FollowersController {
  public async follow({ auth, request, response }: HttpContext) {
    const user = auth.user!;
    const userIdToFollow = request.input('userIdToFollow');
  
    if (!userIdToFollow) {
      return response.badRequest({ message: 'User ID to follow is required' });
    }
  
    const existingFollower = await Follower.query()
      .where('followerId', user.id) 
      .andWhere('userId', userIdToFollow)
      .first();
  
    if (existingFollower) {
      return response.badRequest({ message: 'Already following this user' });
    }
  
    const follower = new Follower();
    follower.userId = userIdToFollow; 
    follower.followerId = user.id;

    await follower.save();
  
    return response.created({ message: 'User followed successfully', data: follower });
  }

  public async unfollow({ auth, params, response }: HttpContext) {
    const user = auth.user!;
    const userIdToUnfollow = Number(params.id);
  
    try {
      const follower = await Follower.query()
        .where('followerId', user.id)
        .andWhere('userId', userIdToUnfollow)
        .first();
  
      if (!follower) {
        return response.notFound({ message: 'Follow relationship not found' });
      }
  
      await follower.delete();
      return response.ok({ message: 'User unfollowed successfully' });
    } catch (error) {
      return response.internalServerError({ message: 'Error during unfollow' });
    }
  }

  public async index({ params, response }: HttpContext) {
    const followers = await Follower.query()
      .where('user_id', params.id)
      .preload('follower', (query) => {
        query.select('id', 'firstName', 'lastName', 'email');
      });
    return response.ok(followers);
  }

  public async following({ auth, response }: HttpContext) {
    const user = auth.user!;
    try {
      const following = await Follower.query()
        .where('follower_id', user.id)
        .preload('user', (query) => {
          query.select('id', 'firstName', 'lastName', 'email');
        });

      return response.ok(following);
    } catch (error) {
      return response.internalServerError({ message: 'Error fetching following list' });
    }
  }
}
