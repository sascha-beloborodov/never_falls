'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', table => {
      table.increments()
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.integer('role_id').defaultTo(5)
      table.boolean('is_active').defaultTo(false)
      table.dateTime('last_login').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
