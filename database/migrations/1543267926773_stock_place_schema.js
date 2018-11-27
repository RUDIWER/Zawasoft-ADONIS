'use strict';

const Schema = use('Schema');

class StockPlaceSchema extends Schema {
	up() {
		this.create('stock_places', (table) => {
			table.increments();
			table.integer('place_level');
			table.string('name', 50).unique();
			table.timestamps();
		});
	}

	down() {
		this.drop('stock_places');
	}
}

module.exports = StockPlaceSchema;
