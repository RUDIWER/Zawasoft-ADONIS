'use strict';

const Schema = use('Schema');

class ProductBrandSchema extends Schema {
	up() {
		this.create('product_brands', (table) => {
			table.increments();
			table.string('name_nl', 50).notNullable();
			table.timestamps();
		});
	}

	down() {
		this.drop('product_brands');
	}
}

module.exports = ProductBrandSchema;
