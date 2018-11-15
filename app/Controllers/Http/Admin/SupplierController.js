'use strict';

const Supplier = use('App/Models/Supplier');

class SupplierController {
	async index({ view }) {
		const suppliers = (await Supplier.all()).toJSON();

		return view.render('admin.suppliers.supplierList', { suppliers });
	}

	async create({ view }) {
		const isNew = 1;
		const supplier = new Supplier();
		return view.render('admin.suppliers.supplierForm', {
			isNew,
			supplier
		});
	}

	async edit({ view, params }) {
		const isNew = 0;
		const supplier = await Supplier.find(params.id);
		return view.render('admin.suppliers.supplierForm', {
			isNew,
			supplier
		});
	}

	async save({ request, response, view, params, session, antl }) {
		// Flash old values to the session
		session.flashAll();
		// Get supplierData data from form
		const supplierData = request.except([ '_csrf', 'submit', 'created_at', 'updated_at' ]);
		if (params.id === '0') {
			var supplier = new Supplier();
		} else {
			var supplier = await Supplier.find(params.id);
		}
		try {
			supplier.merge(supplierData);
			await supplier.save();
		} catch (e) {
			console.log('there was an error on saving Supplier Data');
			console.log(e);
		} finally {
			session.flash({
				notification: {
					type: 'success',
					message: antl.formatMessage('products.product_success')
				}
			});
			return response.redirect('back');
		}
	}
}

module.exports = SupplierController;
