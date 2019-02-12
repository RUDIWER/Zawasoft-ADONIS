'use strict';

const Model = use('Model');

class Prospect extends Model {
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
}

module.exports = Prospect;
