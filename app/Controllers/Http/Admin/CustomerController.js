'use strict';

//const Database = use('Database');
const Customer = use('App/Models/Customer');
const Address = use('App/Models/Address');
const Title = use('App/Models/Title');
const Origin = use('App/Models/CustomerOrigin');
const Type = use('App/Models/CustomerType');
const Language = use('App/Models/Language');

class CustomerController {
	async index({ view }) {
		const customers = (await Customer.all()).toJSON();

		return view.render('admin.customers.customerList', { customers });
	}

	async create({ view }) {
		const isNew = 1;
		const customer = new Customer();
		const titles = (await Title.all()).toJSON();
		const origins = (await Origin.all()).toJSON();
		const types = (await Type.all()).toJSON();
		const languages = (await Language.all()).toJSON();
		return view.render('admin.customers.customerForm', {
			isNew,
			customer,
			titles,
			origins,
			types,
			languages
		});
	}

	async edit({ view, params }) {
		const isNew = 0;
		const customerSer = await Customer.find(params.id);
		const customer = customerSer.toJSON();
		const titles = (await Title.all()).toJSON();
		const origins = (await Origin.all()).toJSON();
		const types = (await Type.all()).toJSON();
		const languages = (await Language.all()).toJSON();
		return view.render('admin.customers.customerForm', {
			isNew,
			customer,
			titles,
			origins,
			types,
			languages
		});
	}

	async getAddresses(request) {
		if (!request.params.id) {
			request.params.id = 0;
		}
		const customerSer = await Customer.find(request.params.id);
		if (customerSer) {
			const addresses = (await customerSer
				.addresses()
				.select('id', 'alias', 'street', 'number', 'bus', 'postcode', 'city')
				.fetch()).toJSON();
			return addresses;
		}
		return;
	}

	async save({ request, response, params, session, antl }) {
		// Flash old values to the session
		session.flashAll();
		// Get customerData data from form
		const customerData = request.except([
			'_csrf',
			'submit',
			'created_at',
			'updated_at',
			'alias',
			'street',
			'number',
			'postcode',
			'bus',
			'city',
			'state',
			'country',
			'other'
		]);
		// Save Record
		if (params.id === '0') {
			var customer = new Customer();
		} else {
			var customer = await Customer.find(params.id);
		}
		try {
			customer.merge(customerData);
			if (!customerData.birthday) {
				customer.birthday = null;
			}
			await customer.save();
		} catch (e) {
			console.log('there was an error');
			console.log(e);
		} finally {
			// After save new customer Add address Record
			if (params.id === '0') {
				var address = new Address();
				var addressData = request.except([ '_csrf', 'submit', 'created_at', 'updated_at' ]);
				address.id_customer = customer.id;
				address.country = addressData.country;
				address.state = addressData.state;
				address.postcode = addressData.postcode;
				address.alias = addressData.alias;
				address.company = addressData.company;
				address.street = addressData.street;
				address.number = addressData.number;
				address.bus = addressData.bus;
				address.city = addressData.city;
				address.other = addressData.other;
				address.phone = addressData.phone_1;
				address.email = addressData.email_1;
				address.vat_number = addressData.vat_number;
				address.last_name = addressData.last_name;
				address.first_name = addressData.first_name;
				await address.save();
			}

			session.flash({
				notification: {
					type: 'success',
					message: antl.formatMessage('messages.save_success')
				}
			});
			return response.redirect('back');
		}
	}

	async addressEdit({ params }) {
		const address = (await Address.find(params.id)).toJSON();
		return address;
	}

	async addressSave({ request, response }) {
		const addressData = request.except([ '_csrf', 'submit', 'created_at', 'updated_at' ]);
		// Validate Ajax data (Manual validation of ajax addressData same aviladation as on client site)
		if (
			!addressData.alias ||
			addressData.alias.length > 30 ||
			!addressData.street ||
			addressData.street.length > 50 ||
			!addressData.number ||
			addressData.number.length > 10 ||
			!addressData.postcode ||
			addressData.postcode.length > 20 ||
			!addressData.city ||
			addressData.city.length > 50 ||
			!addressData.country ||
			addressData.country.length > 50 ||
			!addressData.first_name ||
			addressData.first_name.length > 50 ||
			!addressData.last_name ||
			addressData.last_name.length > 50 ||
			!addressData.email ||
			addressData.email.length > 60 ||
			!validateEmail(addressData.email) ||
			addressData.bus.length > 10 ||
			addressData.other.length > 50 ||
			addressData.company.length > 50 ||
			addressData.vat_number.length > 50 ||
			addressData.phone.length > 50 ||
			addressData.mobile.length > 50 ||
			addressData.fax.length > 40 ||
			addressData.state.length > 50
		) {
			response.status(500).send('Form validation not ok');
			return;
		}

		// Save addrress data

		if (addressData.id === '0') {
			var address = new Address();
		} else {
			var address = await Address.find(addressData.id);
		}
		try {
			address.merge(addressData);
			await address.save();
		} catch (e) {
			console.log('there was an error');
			console.log(e);
		} finally {
			return;
		}
	}

	async addressDelete({ request, response }) {
		const addressData = request.except([ '_csrf', 'submit', 'created_at', 'updated_at' ]);
		const address = await Address.find(addressData.id);
		await address.delete();
		return;
	}
}

// Function to validate email

function validateEmail(email) {
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (!filter.test(email)) {
		return false;
	} else {
		return true;
	}
}

module.exports = CustomerController;
