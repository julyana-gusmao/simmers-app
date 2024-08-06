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
    .put('/password/:id', [UsersController, 'updatePassword'])
    .as('users.updatePassword')
    .use(middleware.auth())

  router
    .post('/profile-picture/:id', [UsersController, 'updateProfilePicture'])
    .as('users.updateProfilePicture')
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
    .use(middleware.auth())

  router
    .post('/', [PostsController, 'store'])
    .as('posts.store')
    .use(middleware.auth())

  router
    .get('/:id', [PostsController, 'show'])
    .as('posts.show')
    .use(middleware.auth())

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
    .get('/:postId', [CommentsController, 'index'])
    .as('comments.index')
    .use(middleware.auth())

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
    .get('/following', [FollowersController, 'following'])
    .as('followers.following')
    .use(middleware.auth())

  router
    .delete('/unfollow/:id', [FollowersController, 'unfollow'])
    .as('followers.unfollow')
    .use(middleware.auth())

  router
    .get('/:id', [FollowersController, 'index'])
    .as('followers.index')
    .use(middleware.auth())
})
  .prefix('/followers')
  .as('followers')