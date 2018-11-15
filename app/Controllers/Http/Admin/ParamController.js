'use strict';

const Param = use('App/Models/Param');

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
}

module.exports = ParamController;
