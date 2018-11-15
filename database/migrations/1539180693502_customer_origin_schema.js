'use strict'

const Schema = use('Schema')

class CustomerOriginSchema extends Schema {
  up () {
    this.create('customer_origins', (table) => {
      table.increments()
	  table.string('title',30).notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('customer_origins')
  }
}

module.exports = CustomerOriginSchema