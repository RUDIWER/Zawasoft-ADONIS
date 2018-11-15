'use strict'

const Schema = use('Schema')

class TitleSchema extends Schema {
  up () {
    this.create('titles', (table) => {
      	table.increments()
		table.string('title',10).notNullable();
      	table.timestamps()
    })
  }

  down () {
    this.drop('titles')
  }
}

module.exports = TitleSchema
