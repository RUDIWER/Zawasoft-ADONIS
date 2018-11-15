'use strict'

const Schema = use('Schema')

class LanguageSchema extends Schema {
  up () {
    this.create('languages', (table) => {
      table.increments()
	  table.string('title',40).notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('languages')
  }
}

module.exports = LanguageSchema
