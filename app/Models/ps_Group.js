'use strict';

const Model = use('Model');

class ps_Group extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_group';
	}

	static get primaryKey() {
		return 'id_group';
	}

	static get createdAtColumn() {
		return 'date_add';
	}

	static get updatedAtColumn() {
		return 'date_upd';
	}
}

module.exports = ps_Group;
