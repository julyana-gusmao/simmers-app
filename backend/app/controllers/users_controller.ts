import type { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js'

export default class UsersController {

  async index({ response }: HttpContext) {
    const users = await User.all()
    return response.ok(users)
  }

  async show({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      return response.ok(user)
    } catch {
      return response.notFound({ message: 'User not found' })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      user.merge(request.only(['firstName', 'lastName', 'birthDate', 'phone', 'email']))
      await user.save()
      return response.ok({ message: 'User updated successfully', data: user })
    } catch {
      return response.notFound({ message: 'User not found' })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()
      return response.ok({ message: 'User deleted successfully' })
    } catch {
      return response.notFound({ message: 'User not found' })
    }
  }
}
