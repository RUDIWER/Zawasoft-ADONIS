'use strict';

const Model = use('Model');

class ps_CategoryGroup extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_category_group';
	}

	static get createdAtColumn() {
		return null;
	}

	static get updatedAtColumn() {
		return null;
	}
}

module.exports = ps_CategoryGroup;
