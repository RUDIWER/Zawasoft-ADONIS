'use strict';

const Env = use('Env');
const BolApi = use('App/ZawaClasses/BolApi.js');
const parseString = require('xml2js').parseString;

class HomeController {
	async index({ view }) {
		return view.render('admin.home');
	}

	async getEan({ params }) {
		const ean = params.ean;
		const bolApiBe = new BolApi(Env.get('BOL_BE_PUBLIC_KEY'), Env.get('BOL_BE_PRIVATE_KEY'));
		var data = await bolApiBe.getCommission(ean);
		var errorCode = data[0];
		var xml = data[1];
		var json = '';
		parseString(xml, function(error, result) {
			if (error) {
				console.log('XML PARSE ERROR :' + error);
				return;
			}
			json = result;
		});
		const commission = json.Commission;
		const fixedAmount = commission.FixedAmount[0] ? commission.FixedAmount[0] : 0;
		const procent = commission.Percentage[0] ? commission.Percentage[0] : 0;
		const reductions = commission.Reductions ? commission.Reductions[0] : [];
		return {
			fixedAmount: fixedAmount,
			procent: procent,
			reductions: reductions
		};
	}
}

module.exports = HomeController;
