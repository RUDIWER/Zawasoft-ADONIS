'use strict';

const SalesInvoice = use('App/Models/SalesInvoice');
const SalesInvoiceRow = use('App/Models/SalesInvoiceRow');
const Customer = use('App/Models/Customer');
const Address = use('App/Models/Address');
const PaymentMethod = use('App/Models/PaymentMethod');
const Param = use('App/Models/Param');
const Product = use('App/Models/Product');
const CustomerType = use('App/Models/CustomerType');
const Database = use('Database');
//const puppeteer = require('puppeteer');
const Helpers = use('Helpers');
const fs = use('fs');
//const Env = use('Env');
//const readFile = Helpers.promisify(fs.readFile);

class InvoiceController {
	async index({ view }) {
		const invoices = (await SalesInvoice.all()).toJSON();
		return view.render('admin.sales.invoice.invoiceList', { invoices });
	}

	async create({ view }) {
		const isNew = 1;
		const param = await Param.find(1);
		const invoice = new SalesInvoice();
		//const customers = (await Customer.all()).toJSON();
		const customers = (await Customer.query().with('addresses').fetch()).toJSON();
		const products = (await Product.all()).toJSON();
		const customerTypes = (await CustomerType.all()).toJSON();
		const paymentMethods = (await PaymentMethod.all()).toJSON();
		const invoiceRows = [
			{
				id_product: 0,
				description: '',
				quantity: 1,
				product_sp_ex_vat: 0,
				product_pp_ex_vat: 0,
				row_total_sp_ex_vat: 0,
				row_total_sp_in_vat: 0,
				row_total_pp_ex_vat: 0,
				vat_procent: param.stand_vat_procent,
				row_total_cost_ex_vat_bol_be: 0,
				row_total_cost_ex_vat_bol_nl: 0,
				cost_ex_vat_bol_be: 0,
				cost_ex_vat_bol_nl: 0
			}
		];
		return view.render('admin.sales.invoice.invoiceForm', {
			isNew,
			param,
			invoice,
			invoiceRows,
			customers,
			products,
			customerTypes,
			paymentMethods
		});
	}

	async edit({ view, params }) {
		const isNew = 0;
		var oldInvoice = 0;
		const param = await Param.find(1);
		const invoice = (await SalesInvoice.find(params.id)).toJSON();
		if (invoice.invoice_number < 745) {
			oldInvoice = 1;
		}
		const invoiceRows = (await SalesInvoiceRow.query().where('id_invoice', params.id).fetch()).toJSON();
		const customers = (await Customer.query().with('addresses').fetch()).toJSON();
		const addresses = (await Address.query().where('id_customer', invoice.id_customer).fetch()).toJSON();
		const products = (await Product.all()).toJSON();
		const customerTypes = (await CustomerType.all()).toJSON();
		const paymentMethods = (await PaymentMethod.all()).toJSON();
		return view.render('admin.sales.invoice.invoiceForm', {
			isNew,
			oldInvoice,
			param,
			invoice,
			invoiceRows,
			customers,
			addresses,
			products,
			customerTypes,
			paymentMethods
		});
	}

	async save({ request, response, session, params, antl, view }) {
		//return request.all();
		// Flash old values to the session
		session.flashAll();
		const param = await Param.find(1);
		// Get InvoiceData data from form
		const invoiceData = request.except([ '_csrf', 'submit', 'created_at', 'updated_at' ]);
		// Save Record
		// Start Transaction
		const trx = await Database.beginTransaction();
		if (params.id === '0') {
			var invoice = new SalesInvoice();
			invoice.invoice_number = param.last_sales_invoice_nr + 1;
		} else {
			var invoice = await SalesInvoice.find(params.id);
		}
		try {
			// Set invoice values to invoice Data
			invoiceData.id_sales_order
				? (invoice.id_sales_order = invoiceData.id_sales_order)
				: (invoice.id_sales_order = 0);
			if (invoiceData.order_reference) {
				invoice.order_reference = invoiceData.order_reference;
			} else {
				invoice.order_reference = '';
			}
			invoice.invoice_date = invoiceData.invoice_date;
			invoice.order_date = invoiceData.order_date;
			invoice.id_customer = invoiceData.id_customer;
			invoice.id_invoice_type = invoiceData.id_invoice_type;
			invoice.id_invoice_address = invoiceData.id_invoice_address;
			const customer = await Customer.find(invoice.id_customer);
			if (!invoiceData.id_invoice_address) {
				invoiceData.id_invoice_address = 0;
			}
			invoice.customer_first_name = invoiceData.customer_first_name;
			invoice.customer_last_name = invoiceData.customer_last_name;
			invoiceData.company ? (invoice.company = invoiceData.company) : (invoice.company = '');
			invoiceData.country ? (invoice.country = invoiceData.country) : (invoice.country = '');

			invoiceData.state ? (invoice.state = invoiceData.state) : (invoice.state = '');
			invoiceData.postcode ? (invoice.postcode = invoiceData.postcode) : (invoice.postcode = '');
			invoiceData.alias ? (invoice.alias = invoiceData.alias) : (invoice.alias = '');
			invoiceData.street ? (invoice.street = invoiceData.street) : (invoice.street = '');
			invoiceData.number ? (invoice.number = invoiceData.number) : (invoice.number = '');
			invoiceData.bus ? (invoice.bus = invoiceData.bus) : (invoice.bus = '');
			invoiceData.city ? (invoice.city = invoiceData.city) : (invoice.city = '');
			invoiceData.email ? (invoice.email = invoiceData.email) : (invoice.email = '');
			customer.phone_1 ? (invoice.phone = customer.phone_1) : (invoice.phone = '');
			invoiceData.vat_number ? (invoice.vat_number = invoiceData.vat_number) : (invoice.vat_number = '');
			invoice.shipping_vat_procent = invoiceData.shipping_vat_procent;
			invoice.shipping_cost_ex_vat = invoiceData.total_shipping_cost_ex_vat;
			invoice.shipping_amount_ex_vat = invoiceData.total_shipping_amount_ex_vat;
			invoice.shipping_amount_in_vat = invoiceData.total_shipping_amount_in_vat;
			invoice.products_ex_vat = invoiceData.total_products_ex_vat;
			invoice.products_in_vat = invoiceData.total_products_in_vat;
			invoice.pp_ex_vat_cz = invoiceData.total_pp_ex_vat;
			invoice.cost_ex_vat_bol = invoiceData.total_cost_ex_vat_bol;
			invoice.invoice_ex_vat = invoiceData.total_invoice_ex_vat;
			invoice.invoice_in_vat = invoiceData.total_invoice_in_vat;
			invoice.netto_margin_ex_vat = invoiceData.netto_margin_ex_vat;
			invoice.margin_procent = invoiceData.margin_procent;
			invoiceData.id_payment_method
				? (invoice.id_payment_method = invoiceData.id_payment_method)
				: (invoice.id_payment_method = '');

			// Wrapping & paid = TODO
			invoice.wrapping_cost_ex_vat = 0;
			invoice.wrapping_amount_ex_vat = 0;
			invoice.wrapping_amount_in_vat = 0;
			invoice.amount_paid = 0;
			await invoice.save(trx);
		} catch (e) {
			console.log('there was an error');
			console.log(e);
		} finally {
			if (params.id != 0) {
				const deletedRows = await SalesInvoiceRow.query().where('id_invoice', invoice.id).delete(trx);
			}
			// Save INVOICE ROWS
			var counter;
			for (counter = 0; counter < invoiceData.id_product.length; counter++) {
				var invoiceRow = new SalesInvoiceRow();
				invoiceRow.id_invoice = invoice.id;
				invoiceRow.id_invoice_type = invoice.id_invoice_type;
				invoiceRow.invoice_number = invoice.invoice_number;
				invoiceRow.id_sales_order = invoice.id_sales_order;
				invoiceRow.order_reference = invoice.order_reference;
				invoiceRow.id_product = invoiceData.id_product[counter];
				var product = await Product.find(invoiceRow.id_product);
				if (!product) {
					var product = '';
				}
				product.id ? (invoiceRow.id_product = product.id) : (invoiceRow.id_product = 0);
				product.id_product_supplier
					? (invoiceRow.id_product_supplier = product.id_product_supplier)
					: (invoiceRow.id_product_supplier = 0);
				product.id_supplier ? (invoiceRow.id_supplier = product.id_supplier) : (invoiceRow.id_supplier = 0);
				product.id_brand ? (invoiceRow.id_product_brand = product.id_brand) : (invoiceRow.id_product_brand = 0);
				product.id_bol_category
					? (invoiceRow.id_bol_category = product.id_bol_category)
					: (invoiceRow.id_bol_category = 0);
				product.ean13 ? (invoiceRow.ean13 = product.ean13) : (invoiceRow.ean13 = '');
				invoiceRow.description = invoiceData.description[counter];
				invoiceRow.quantity = Number(invoiceData.quantity[counter]);
				invoiceRow.product_pp_ex_vat = Number(invoiceData.product_pp_ex_vat[counter]);
				invoiceRow.product_sp_ex_vat = Number(invoiceData.product_sp_ex_vat[counter]);
				invoiceRow.vat_procent = Number(invoiceData.vat_procent[counter]);
				invoiceRow.product_sp_in_vat =
					Math.round(
						(invoiceRow.product_sp_ex_vat + invoiceRow.product_sp_ex_vat / 100 * invoiceRow.vat_procent) *
							100
					) / 100;
				invoiceRow.row_total_pp_ex_vat = Number(invoiceData.row_total_pp_ex_vat[counter]);
				invoiceRow.row_total_pp_in_vat =
					Math.round(
						(invoiceRow.row_total_pp_ex_vat +
							invoiceRow.row_total_pp_ex_vat / 100 * invoiceRow.vat_procent) *
							100
					) / 100;
				invoiceRow.row_total_sp_ex_vat = Number(invoiceData.row_total_sp_ex_vat[counter]);
				invoiceRow.row_total_sp_in_vat = Number(invoiceData.row_total_sp_in_vat[counter]);
				invoiceRow.cost_ex_vat_bol_be = Number(invoiceData.cost_ex_vat_bol_be[counter]);
				invoiceRow.cost_ex_vat_bol_nl = Number(invoiceData.cost_ex_vat_bol_nl[counter]);
				invoiceRow.row_total_cost_ex_vat_bol_be = Number(invoiceData.row_total_cost_ex_vat_bol_be[counter]);
				invoiceRow.row_total_cost_ex_vat_bol_nl = Number(invoiceData.row_total_cost_ex_vat_bol_nl[counter]);
				invoiceRow.amazon_cost_ex_vat = 0; //TODO AMAZON
				await invoiceRow.save(trx);
			}
		}
		// Commit complete transaction
		trx.commit();
		// Set lastInvoice number in params + 1
		if (params.id == 0) {
			param.last_sales_invoice_nr += 1;
			await param.save();
		}
		session.flash({
			notification: {
				type: 'success',
				message: antl.formatMessage('messages.save_success')
			}
		});
		return response.redirect('/admin/sales/invoice/edit/' + invoice.id);
	}

	/*
	async print({ response, params }) {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		const options = {
			path: 'public/pdf/invoice.pdf',
			format: 'A4'
		};
		await page.goto('http://localhost:3333/login', { waitUntil: 'networkidle2' });
		await page.type('#email', Env.get('LOGIN_E_MAIL'));
		await page.type('#password', Env.get('LOGIN_PASSWORD'));
		// click and wait for navigation
		console.log('na login');
		await Promise.all([ page.click('#btnLogin'), page.waitForNavigation({ waitUntil: 'networkidle0' }) ]);
		await page.goto('http://localhost:3333/admin/sales/invoice/pdf/' + params.id, { waitUntil: 'networkidle2' });
		console.log('na route');
		await page.pdf(options);
		await browser.close();
		response.header('Content-type', 'application/pdf');
		response.type('application/pdf');
		response.download('public/pdf/invoice.pdf');
		//return await readFile('hn.pdf');
	}

	async getPdf({ view, params }) {
		const param = await Param.find(1);
		const invoice = (await SalesInvoice.find(params.id)).toJSON();
		const invoiceRows = (await SalesInvoiceRow.query().where('id_invoice', params.id).fetch()).toJSON();
		const customers = (await Customer.query().with('addresses').fetch()).toJSON();
		const addresses = (await Address.query().where('id_customer', invoice.id_customer).fetch()).toJSON();
		const products = (await Product.all()).toJSON();
		const customerTypes = (await CustomerType.all()).toJSON();
		return view.render('admin.sales.invoice.pdf.invoicePdf', {
			param,
			invoice,
			invoiceRows,
			customers,
			addresses,
			products,
			customerTypes
		});
	}
*/
}

module.exports = InvoiceController;
