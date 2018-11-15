'use strict';

const Schema = use('Schema');

class BolCategorySchema extends Schema {
	up() {
		this.create('bol_categories', (table) => {
			table.increments();
			table.string('name', 80).notNullable();
			table.decimal('cost_fix', 6, 2);
			table.decimal('cost_procent', 6, 2);
			table.timestamps();
		});
	}

	down() {
		this.drop('bol_categories');
	}
}

module.exports = BolCategorySchema;
