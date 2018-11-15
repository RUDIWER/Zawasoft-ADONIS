'use strict';

class HomeController {
	async index({ view }) {
		return view.render('admin.home');
	}
}

module.exports = HomeController;
