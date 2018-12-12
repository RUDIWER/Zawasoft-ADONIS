'use strict';

const Param = use('App/Models/Param');
const Product = use('App/Models/Product');
const Env = use('Env');
const BolApi = use('App/ZawaClasses/BolApi.js');

class ParamController {
	async showParamForm({ view }) {
		const param = await Param.findOrCreate({ id: '1' });
		return view.render('admin.params.param', { param });
	}

	async save({ request, response, session, antl }) {
		// Flash old values to the session
		session.flashAll();
		// Get ParamData data from form
		const paramData = request.except([ '_csrf', 'submit' ]);
		const param = await Param.find(1);

		try {
			param.merge(paramData);
			await param.save();
		} catch (e) {
			console.log('there was an error in saveing param data');
			console.log(e);
		} finally {
			session.flash({
				notification: {
					type: 'success',
					message: antl.formatMessage('products.product_success')
				}
			});
			return response.redirect('/admin/param');
		}
	}

	async showBulkForm({ view }) {
		return view.render('admin.params.bulk', {});
	}

	async bulkSave({ request, response, session }) {
		// Flash old values to the session
		session.flashAll();
		// Get bulkData data from form
		const bulkData = request.except([ '_csrf', 'submit' ]);
		//return bulkData;
		// select shop to set
		if (bulkData.id_shop == 'bol_be') {
			var bolApi = new BolApiBe(Env.get('BOL_BE_PUBLIC_KEY'), Env.get('BOL_BE_PRIVATE_KEY'));
			// Loop over products and set delivery Time
			const products = await Product.all();
			for (let i in products.rows) {
				const product = products.rows[i];
				if (product.active_bol_be == 1 && product.ean13 != '') {
					// SET PRODUCT DELIVERY TIME IN ZAWA DB
					const dbProduct = await Product.find(product.id);
					dbProduct.bol_be_delivery_time = bulkData.id_delivery_time;
					await dbProduct.save();
					// SET PRODUCT IN BOL
					var result = await bolApiBe.setProductBe(dbProduct.id);
				} else {
					continue;
				}
			}
		} else if (bulkData.id_shop == 'bol_nl') {
			var bolApi = new BolApiNl(Env.get('BOL_NL_PUBLIC_KEY'), Env.get('BOL_NL_PRIVATE_KEY'));
			for (let i in products.rows) {
				const product = products.rows[i];
				if (product.active_bol_nl == 1 && product.ean13 != '') {
					// SET PRODUCT DELIVERY TIME IN ZAWA DB
					const dbProduct = await Product.find(product.id);
					dbProduct.bol_nl_delivery_time = bulkData.id_delivery_time;
					await dbProduct.save();
					// SET PRODUCT IN BOL
					var result = await bolApiNl.setProductNl(dbProduct.id);
				} else {
					continue;
				}
			}
		}

		session.flash({
			notification: {
				type: 'success',
				message: 'Gelukt !'
			}
		});
		return response.redirect('/admin/bulk-changes');
	}
}

module.exports = ParamController;
