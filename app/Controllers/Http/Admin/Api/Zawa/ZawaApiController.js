'use strict';
const Order = use('App/Models/SalesOrderZwd');

class ZawaApiController {
	async getOrder({ params }) {
		console.log('IN GETORDER');
		const order = (await Order.query().where('id','=',params.id).with('rows').fetch()).toJSON();
		console.log(order);
		return order;
	}
}
module.exports = ZawaApiController;
