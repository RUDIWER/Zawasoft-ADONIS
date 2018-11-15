'use strict'

const Schema = use('Schema')

class ProductGroupSchema extends Schema {
  up () {
    this.create('product_groups', (table) => {
    	table.increments()
        table.integer('id_parent');
        table.string('name', 50).unique();
        table.string('slug').unique();
        table.string('meta_descr_nl', 50);
        table.string('meta_title_nl', 50);
        table.text('descr_nl', 400);
      	table.timestamps()
    })
  }

  down () {
    this.drop('product_groups')
  }
}

module.exports = ProductGroupSchema
