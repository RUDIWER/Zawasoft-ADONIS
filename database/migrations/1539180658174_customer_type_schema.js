'use strict'

const Schema = use('Schema')

class CustomerTypeSchema extends Schema {
  up () {
    this.create('customer_types', (table) => {
      table.increments()
	  table.string('title',30).notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('customer_types')
  }
}

module.exports = CustomerTypeSchema
