import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request }: HttpContext) {
    const data = request.only(['first_name', 'last_name', 'birth_date', 'phone', 'email', 'password'])

    const user = await User.create(data)

    return User.accessTokens.create(user)
  }

  async login({ request }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)

    if(!user){
      console.log('Invalid Credencials')
    }
    console.log('Logado')
    return User.accessTokens.create(user)
  }

  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
      return response.ok({ message: 'success' })
    } catch (error) {
      console.error('Logout error:', error)
      return response.badRequest({ message: 'Logout failed' })
    }
  }

  async me({ auth, response }: HttpContext) {
    await auth.check()
    return response.ok({ user: auth.user })
  }
}
