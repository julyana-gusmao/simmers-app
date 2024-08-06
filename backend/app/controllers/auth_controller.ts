import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request }: HttpContext) {
    const data = request.only(['first_name', 'last_name', 'birth_date', 'phone', 'email', 'password', 'profile_picture'])

    const user = await User.create(data)
    const token = await User.accessTokens.create(user)

    return {
      user,
      token
    }
  }

  async login({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(
      user,
      ['*'],
      {
        expiresIn: '30 days'
      }
    )

    return {
      user,
      token
    }
  }

  async logout({ auth }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return { message: 'success' }
  }

  async me({ auth }: HttpContext) {
    await auth.check()
    return {
      user: auth.user,
    }
  }
}