'use strict';

//const Database = use('Database');
const Brand = use('App/Models/ProductBrand');

class BrandController {
	async index({ view }) {
		const brands = (await Brand.all()).toJSON();

		return view.render('admin.brands.brandList', { brands });
	}
}

module.exports = BrandController;
