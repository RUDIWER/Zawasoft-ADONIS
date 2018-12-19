'use strict';

const Model = use('Model');

class ps_Image extends Model {
	static get connection() {
		return 'mysql2';
	}
	static get table() {
		return 'ps_image';
	}

	static get primaryKey() {
		return 'id_image';
	}

	static get createdAtColumn() {
		return null;
	}

	static get updatedAtColumn() {
		return null;
	}
}

module.exports = ps_Image;
