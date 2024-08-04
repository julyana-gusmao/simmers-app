import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: process.env.DB_CONNECTION || 'sqlite',
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: process.env.SQLITE_DATABASE || './database.sqlite',
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
