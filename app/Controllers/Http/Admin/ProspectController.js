'use strict';

const Prospect = use('App/Models/Prospect');
const Customer = use('App/Models/Customer');
const Title = use('App/Models/Title');
const Type = use('App/Models/CustomerType');
const Language = use('App/Models/Language');

class ProspectController {
	async index({ view }) {
		const prospects = (await Prospect.all()).toJSON();
		return view.render('admin.prospects.prospectList', { prospects });
	}

	async create({ view }) {
		const isNew = 1;
		const prospect = new Prospect();
		const titles = (await Title.all()).toJSON();
		const types = (await Type.all()).toJSON();
		const languages = (await Language.all()).toJSON();
		return view.render('admin.prospects.prospectForm', {
			isNew,
			prospect,
			titles,
			types,
			languages
		});
	}

	async edit({ view, params }) {
		const isNew = 0;
		const prospect = (await Prospect.find(params.id)).toJSON();
		const titles = (await Title.all()).toJSON();
		const types = (await Type.all()).toJSON();
		const languages = (await Language.all()).toJSON();
		return view.render('admin.prospects.prospectForm', {
			isNew,
			prospect,
			titles,
			types,
			languages
		});
	}

	async save({ request, response, params, session, antl }) {
		// Flash old values to the session
		session.flashAll();
		// Get customerData data from form
		const prospectData = request.except([ '_csrf', 'submit', 'created_at', 'updated_at' ]);
		// Save Record
		if (params.id === '0') {
			var prospect = new Prospect();
		} else {
			var prospect = await Prospect.find(params.id);
		}
		try {
			prospect.merge(prospectData);
			if (!prospectData.birthday) {
				prospect.birthday = null;
			}
			await prospect.save();
			console.log('prospect gesaved !!!');
		} catch (e) {
			console.log('there was an error');
			console.log(e);
		} finally {
			session.flash({
				notification: {
					type: 'success',
					message: antl.formatMessage('messages.save_success')
				}
			});
			return response.route('admin-prospect-edit', { id: prospect.id });
		}
	}

	async syncCustomers({ view, params }) {
		//const customer = await Customer.all(); // WITH ADDRESSES !!!!!!
		var customerCount = await Customer.getCount();
		for (let i = 1; (i = customerCount); i++) {
			console.log(i);
			var customer = await Customer.find(i);

			//	console.log(customer);
			const customerEmail = customer.email_1;

			console.log(customerEmail);
		}
		console.log('uit loop');

		/*
			if (customerEmail.includes('verkopen.bol.com')) {
				continue;
			}
			const prospect = await Prospect.query().where('email', '=', customerEmail).first();
			if (!prospect) {
				const prospect = new Prospect();
				//Optimize
				if (!customerArray[i].company) {
					customerArray[i].company = '';
				}
				if (!customerArray[i].state) {
					customerArray[i].state = '';
				}
				if (!customerArray[i].country) {
					customerArray[i].country = '';
				}
				if (!customerArray[i].postcode) {
					customerArray[i].postcode = '';
				}
				if (!customerArray[i].city) {
					customerArray[i].city = '';
				}
				if (!customerArray[i].street) {
					customerArray[i].street = '';
				}
				if (!customerArray[i].number) {
					customerArray[i].number = '';
				}
				if (!customerArray[i].bus) {
					customerArray[i].bus = '';
				}
				if (!customerArray[i].phone_1) {
					customerArray[i].phone_1 = '';
				}
				if (!customerArray[i].phone_2) {
					customerArray[i].phone_2 = '';
				}
				if (!customerArray[i].website) {
					customerArray[i].website = '';
				}
				if (!customerArray[i].birthday) {
					customerArray[i].birthday = '';
				}
				if (!customerArray[i].website) {
					customerArray[i].website = '';
				}
				if (!customerArray[i].newsletter) {
					customerArray[i].newsletter = 1;
				}

				prospect.id_title = customerArray[i].id_title;
				prospect.id_lang = customerArray[i].id_lang;
				prospect.id_type = customerArray[i].id_type;
				prospect.first_name = customerArray[i].first_name;
				prospect.last_name = customerArray[i].last_name;
				prospect.company = customerArray[i].company;
				prospect.country = customerArray[i].country;
				prospect.state = customerArray[i].state;
				prospect.postcode = customerArray[i].postcode;
				prospect.city = customerArray[i].city;
				prospect.street = customerArray[i].street;
				prospect.number = customerArray[i].number;
				prospect.bus = customerArray[i].bus;
				prospect.phone = customerArray[i].phone_1;
				prospect.mobile = customerArray[i].phone_2;
				prospect.email = customerArray[i].email_1;
				prospect.website = customerArray[i].website;
				prospect.birthday = customerArray[i].birthday;
				prospect.newsletter = customerArray[i].newsletter;
				await prospect.save();
				console.log('prospect gesaved !!!');
			}
		}

		session.flash({
			notification: {
				type: 'success',
				message: 'De klantengegevens werden gesynchroniseerd met de prospecten'
			}
		});
		const prospects = (await Prospect.all()).toJSON();
		return view.render('admin.prospects.prospectList', { prospects });
	*/
	}
}

module.exports = ProspectController;
