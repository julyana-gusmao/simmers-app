import type { HttpContext } from '@adonisjs/core/http'
import Follower from '../models/follower.js'

export default class FollowersController {
  public async follow({ auth, request, response }: HttpContext) {
    const followerId = request.input('followerId')

    const follower = new Follower()
    follower.userId = auth.user!.id
    follower.followerId = followerId
    await follower.save()

    return response.created({ message: 'User followed successfully', data: follower })
  }

  public async unfollow({ auth, params, response }: HttpContext) {
    try {
      const follower = await Follower.query()
        .where('userId', auth.user!.id)
        .andWhere('followerId', params.id)
        .firstOrFail()

      await follower.delete()
      return response.ok({ message: 'User unfollowed successfully' })
    } catch {
      return response.notFound({ message: 'Follow relationship not found' })
    }
  }

  public async index({ params, response }: HttpContext) {
    const followers = await Follower.query().where('userId', params.id)
    return response.ok(followers)
  }
}
