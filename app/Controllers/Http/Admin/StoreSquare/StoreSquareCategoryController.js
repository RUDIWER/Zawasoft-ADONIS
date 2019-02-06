'use strict';

const StoreSquareCategory = use('App/Models/StoreSquareCategory');
const Env = use('Env');

class StoreSquareCategoryController {
	async index({ view }) {
		const categories = (await StoreSquareCategory.all()).toJSON();
		return view.render('admin.storeSquare.categoryList', {
			categories
		});
	}

	async create({ view }) {
		const isNew = 1;
		const category = await new StoreSquareCategory();
		return view.render('admin.storeSquare.categoryForm', {
			isNew,
			category
		});
	}

	async edit({ view, params }) {
		const isNew = 0;
		const category = await StoreSquareCategory.find(params.id);
		return view.render('admin.storeSquare.categoryForm', {
			isNew,
			category
		});
	}

	async save({ request, response, params, session, antl }) {
		// Flash old values to the session
		session.flashAll();
		// Get categoryData data from form
		const categoryData = request.except([ '_csrf', 'submit' ]);
	//	return categoryData;
		if (params.id === '0') {
			var category =  new StoreSquareCategory();;
		} else {
			var category = await StoreSquareCategory.find(params.id);
		}
		category.id_storesquare = categoryData.id_storesquare;
		category.name_nl = categoryData.name_nl;
		category.cost_fix = categoryData.cost_fix;
		category.cost_procent = categoryData.cost_procent;
		try {
			await category.save();
		} catch (e) {
			console.log('there was an error in saveing storesquare catagory data');
			console.log(e);
		} finally {
			session.flash({
				notification: {
					type: 'success',
					message: 'Categorie succesvol opgeslagen in de database!'
				}
			});
			return response.route('admin-storesquare-category-edit',  { id: category.id });
		}
	}
}

module.exports = StoreSquareCategoryController;
