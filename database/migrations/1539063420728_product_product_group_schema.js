'use strict';

const Schema = use('Schema');

class ProductProductGroupSchema extends Schema {
	up() {
		this.create('product_product_groups', (table) => {
			table.increments();
			table.integer('product_id');
			table.integer('product_group_id');
			table.timestamps();
		});
	}

	down() {
		this.drop('product_product_groups');
	}
}

module.exports = ProductProductGroupSchema;
