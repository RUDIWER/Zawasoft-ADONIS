'use strict';

const Model = use('Model');

class Customer extends Model {
	// DATE REFORMATTING
	static get dates() {
		return super.dates.concat([ 'birthday' ]);
	}

	static castDates(field, value) {
		if (field === 'birthday') {
			if (value) {
				return value.format('YYYY-MM-DD');
			}
		}
		return super.formatDates(field, value);
	}

	// RELATIONS
	addresses() {
		return this.hasMany('App/Models/Address', 'id', 'id_customer');
	}
}

module.exports = Customer;
