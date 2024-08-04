import { defineConfig, drivers } from '@adonisjs/core/hash'

const hashConfig = defineConfig({
  default: 'bcrypt',
  list: {
    bcrypt: drivers.bcrypt({
      rounds: 10,
    }),
  },
})

export default hashConfig

declare module '@adonisjs/core/types' {
  interface HashersList extends InferHashers<typeof hashConfig> {}
}
