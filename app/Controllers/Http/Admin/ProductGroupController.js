'use strict';

const Product = use('App/Models/Product');
const ProductGroup = use('App/Models/ProductGroup');
const PrestaApi = use('App/ZawaClasses/PrestaApi');
const Database = use('Database');
const Env = use('Env');

class ProductGroupController {
	async index({ view }) {
		const isParent = 1;
		const parentGroupId = 2;
		const parentGroupName = 'Home';
		//const groups = await Database.table('product_groups').where('id_parent', '=', '2').with('childs');
		const groups = (await ProductGroup.query()
			.where('id_parent', 2)
			.with('childs')
			.orderBy('name_nl', 'asc')
			.fetch()).toJSON();
		//return groups;
		return view.render('admin.productGroups.productGroupList', {
			isParent,
			groups,
			parentGroupId,
			parentGroupName
		});
	}

	async childs({ view, params }) {
		const isParent = 0;
		const parentGroup = await Database.table('product_groups').where('id', params.id);
		let parentGroupName = parentGroup[0].name_nl;
		const allGroups = await ProductGroup.all();
		const parentGroupId = parentGroup[0].id;
		//const groups = await Database.table('product_groups').where('id_parent', params.id);
		const groups = (await ProductGroup.query()
			.where('id_parent', params.id)
			.with('childs')
			.orderBy('name_nl', 'asc')
			.fetch()).toJSON();
		return view.render('admin.productGroups.productGroupList', {
			isParent,
			groups,
			parentGroupName,
			parentGroupId
		});
	}

	async create({ view, params }) {
		const isNew = 1;
		const group = await new ProductGroup();
		const parentGroupId = params.parentId;
		return view.render('admin.productGroups.productGroupForm', {
			isNew,
			group,
			parentGroupId
		});
	}

	async edit({ view, params }) {
		const isNew = 0;
		const group = await ProductGroup.find(params.id);
		const parentGroupId = params.parentId;
		return view.render('admin.productGroups.productGroupForm', {
			isNew,
			group,
			parentGroupId
		});
	}

	async save({ request, response, params, session, antl }) {
		// Flash old values to the session
		session.flashAll();
		// Get productData data from form
		const groupData = request.except([ '_csrf', 'submit' ]);
		const parentGroup = await ProductGroup.find(params.parentId);
		if (params.id === '0') {
			var group = new ProductGroup();
		} else {
			var group = await ProductGroup.find(params.id);
		}
		group.id_parent = parentGroup.id;
		group.level_depth = parentGroup.level_depth + 1;
		if (!groupData.active) {
			groupData.active = 0;
		}
		group.active = groupData.active;
		group.nleft = 0;
		group.nright = 0;
		group.name_nl = groupData.name_nl;
		group.slug = groupData.slug;
		group.meta_descr_nl = groupData.meta_description;
		group.meta_keywords_nl = groupData.meta_keywords;
		group.meta_title_nl = groupData.meta_title;
		group.descr_nl = groupData.short_description;

		group.position = groupData.position;
		try {
			await group.save();
		} catch (e) {
			console.log('there was an error in saveing param data');
			console.log(e);
		} finally {
			// Re calc positions
			const groups = (await ProductGroup.query()
				.where('id_parent', parentGroup.id)
				.orderBy('position', 'asc')
				.fetch()).toJSON();
			const groupsLength = groups.length;
			for (let i = 0; i < groupsLength; i++) {
				const groupData = groups[i];
				const currentGroup = await ProductGroup.find(groupData.id);
				currentGroup.position = i;
				try {
					await currentGroup.save();
				} catch (e) {
					console.log('there was an error in saveing param data');
					console.log(e);
				}
			}
			// PRESTASHOP
			if (Env.get('APP_PRESTA')) {
				const prestaApi = new PrestaApi();
				const result = await prestaApi.setProductGroup(group.id);
			}
			session.flash({
				notification: {
					type: 'success',
					message: antl.formatMessage('products.product_success')
				}
			});
			return response.route('admin-product-group-edit', { parentId: group.id_parent, id: group.id });
		}
	}
}

module.exports = ProductGroupController;
