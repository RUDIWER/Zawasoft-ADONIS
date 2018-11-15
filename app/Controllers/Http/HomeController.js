'use strict';

class HomeController {
	async index({ view }) {
		return view.render('shop.home');
	}
}

module.exports = HomeController;
