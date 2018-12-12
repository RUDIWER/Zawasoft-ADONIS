'use strict';

//const Database = use('Database');
const Brand = use('App/Models/ProductBrand');
const PrestaApi = use('App/ZawaClasses/PrestaApi');
const Env = use('Env');

class ProductBrandController {
	async index({ view }) {
		const brands = (await Brand.all()).toJSON();
		return view.render('admin.brands.brandList', { brands });
	}

	async create({ view }) {
		const isNew = 1;
		const brand = await new Brand();
		return view.render('admin.brands.brandForm', {
			isNew,
			brand
		});
	}


	async edit({ view, params }) {
		const isNew = 0;
		const brand = await Brand.find(params.id);
		return view.render('admin.brands.brandForm', {
			isNew,
			brand
		});
	}

	async save({ request, response, params, session, antl }) {
		// Flash old values to the session
		session.flashAll();
		// Get productData data from form
		const brandData = request.except([ '_csrf', 'submit' ]);
		if (params.id === '0') {
			var brand = new Brand();
		} else {
			var brand = await Brand.find(params.id);
		}
		try {
			brand.merge(brandData);
			await brand.save();
		} catch (e) {
			console.log('there was an error in saveing param data');
			console.log(e);
		} finally {
			if (Env.get('APP_PRESTA')) {
				const prestaApi = new PrestaApi();
				const result = await prestaApi.setBrand(brand.id);
			}
			session.flash({
				notification: {
					type: 'success',
					message: antl.formatMessage('products.product_success')
				}
			});
			return response.route('admin-brand-edit', { id: brand.id });
		}		
	}

}

module.exports = ProductBrandController;
