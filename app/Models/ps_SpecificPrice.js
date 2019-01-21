'use strict';

const Model = use('Model');

class ps_SpecificPrice extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_specific_price';
	}

	static get primaryKey() {
		return 'id_specific_price';
	}

	static get createdAtColumn() {
		return null;
	}

	static get updatedAtColumn() {
		return null;
	}
}

module.exports = ps_SpecificPrice;
