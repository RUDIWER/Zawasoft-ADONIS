'use strict';

const Model = use('Model');

class ps_StockAvailable extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_stock_available';
	}

	static get primaryKey() {
		return 'id_stock_available';
	}

	static get createdAtColumn() {
		return null;
	}

	static get updatedAtColumn() {
		return null;
	}
}

module.exports = ps_StockAvailable;
