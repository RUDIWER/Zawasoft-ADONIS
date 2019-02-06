'use strict';

const Schema = use('Schema');

class StoreSquareCategorySchema extends Schema {
	up() {
		this.create('storesquare_categories', (table) => {
			table.increments();
			table.integer('id_storesquare').unsigned().notNullable().unique();
			table.string('name', 80).notNullable();
			table.decimal('cost_fix', 6, 2);
			table.decimal('cost_procent', 6, 2);
			table.timestamps();
		});
	}

	down() {
		this.drop('storesquare_categories');
	}
}

module.exports = StoreSquareCategorySchema;
