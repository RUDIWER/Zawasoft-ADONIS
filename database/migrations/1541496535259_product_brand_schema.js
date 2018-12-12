'use strict';

const Schema = use('Schema');

class ProductBrandSchema extends Schema {
	up() {
		this.create('product_brands', (table) => {
			table.increments();
			table.string('name_nl', 50).notNullable();
			table.string('meta_title', 128);
			table.text('short_description');
			table.string('meta_keywords', 255);
			table.string('meta_description', 255);
			table.timestamps();
		});
	}

	down() {
		this.drop('product_brands');
	}
}

module.exports = ProductBrandSchema;
