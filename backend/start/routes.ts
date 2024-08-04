import UsersController from '#controllers/users_controller'
import PostsController from '#controllers/posts_controller'
import CommentsController from '#controllers/comments_controller'
import FollowersController from '#controllers/followers_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')

// AUTH ROUTES
router.group(() => {
  router
    .post('/register', [AuthController, 'register'])
    .as('auth.register')

  router
    .post('/login', [AuthController, 'login'])
    .as('auth.login')

  router
    .delete('/logout', [AuthController, 'logout'])
    .as('auth.logout')
    .use(middleware.auth())

  router
    .get('/me', [AuthController, 'me'])
    .as('auth.me')
})
  .prefix('/auth')
  .as('auth')

// USER ROUTES
router.group(() => {
  router
    .get('/', [UsersController, 'index'])
    .as('users.index')

  router
    .get('/:id', [UsersController, 'show'])
    .as('users.show')

  router
    .put('/:id', [UsersController, 'update'])
    .as('users.update')
    .use(middleware.auth())

  router
    .delete('/:id', [UsersController, 'destroy'])
    .as('users.destroy')
    .use(middleware.auth())
})
  .prefix('/users')
  .as('users')

// POST ROUTES
router.group(() => {
  router
    .get('/', [PostsController, 'index'])
    .as('posts.index')

  router
    .post('/', [PostsController, 'store'])
    .as('posts.store')
    .use(middleware.auth())

  router
    .get('/:id', [PostsController, 'show'])
    .as('posts.show')

  router
    .put('/:id', [PostsController, 'update'])
    .as('posts.update')
    .use(middleware.auth())

  router
    .delete('/:id', [PostsController, 'destroy'])
    .as('posts.destroy')
    .use(middleware.auth())
})
  .prefix('/posts')
  .as('posts')

// COMMENT ROUTES
router.group(() => {
  router
    .get('/', [CommentsController, 'index'])
    .as('comments.index')

  router
    .post('/', [CommentsController, 'store'])
    .as('comments.store')
    .use(middleware.auth())

  router
    .put('/:id', [CommentsController, 'update'])
    .as('comments.update')
    .use(middleware.auth())

  router
    .delete('/:id', [CommentsController, 'destroy'])
    .as('comments.destroy')
    .use(middleware.auth())
})
  .prefix('/comments')
  .as('comments')

// FOLLOWER ROUTES
router.group(() => {
  router
    .post('/follow', [FollowersController, 'follow'])
    .as('followers.follow')
    .use(middleware.auth())

  router
    .delete('/unfollow/:id', [FollowersController, 'unfollow'])
    .as('followers.unfollow')
    .use(middleware.auth())

  router
    .get('/:id', [FollowersController, 'index'])
    .as('followers.index')
})
  .prefix('/followers')
  .as('followers')
