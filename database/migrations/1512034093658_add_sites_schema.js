'use strict'

const Schema = use('Schema')

class AddSitesSchema extends Schema {
  up () {
    this.create('sites', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('name', 100).notNullable()
      table.text('description').nullable()
      table.string('url', 140).notNullable().unique()
      table.integer('last_check_time').defaultTo(0)
      table.integer('last_check_code').defaultTo(0)
      table.boolean('is_active').defaultTo(true)
      table.timestamps()
    })

    this.create('sites_history', (table) => {
      table.increments()
      table.integer('site_id').unsigned().references('id').inTable('sites')
      table.integer('check_time').defaultTo(0)
      table.integer('check_code').defaultTo(0)
      table.text('snapshot').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('sites')
    this.drop('sites_history')
  }
}

module.exports = AddSitesSchema
