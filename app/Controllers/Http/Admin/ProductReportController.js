'use strict';

const Product = use('App/Models/Product');

class ProductReportController {
	async stockReport({ view }) {
		const products = (await Product.all()).toJSON();
		return view.render('admin.products.reports.stockReportForm', { products });
	}
}

module.exports = ProductReportController;
