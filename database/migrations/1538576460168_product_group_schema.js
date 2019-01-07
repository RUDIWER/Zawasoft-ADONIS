'use strict';

const Schema = use('Schema');

class ProductGroupSchema extends Schema {
	up() {
		this.create('product_groups', (table) => {
			table.increments();
			table.integer('id_parent').unsigned();
			table.integer('active').unsigned();
			table.integer('position').unsigned();
			table.integer('level_depth').unsigned();
			table.integer('nleft').unsigned().notNullable().defaultTo(0);
			table.integer('nright').unsigned().notNullable().defaultTo(0);
			table.string('name_nl', 50).notNullable();
			table.string('slug_nl', 255).unique().notNullable();
			table.string('meta_descr_nl', 255);
			table.string('meta_keywords_nl', 255);
			table.string('meta_title_nl', 128);
			table.text('descr_nl', 400);
			table.timestamps();
		});
	}

	down() {
		this.drop('product_groups');
	}
}

module.exports = ProductGroupSchema;
