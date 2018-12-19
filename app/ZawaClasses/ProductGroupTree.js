'use strict';
const Product = use('App/Models/Product');
const ProductGroup = use('App/Models/ProductGroup');
const Database = use('Database');


//     TEST EN STUDIE CLASSS NIET IN GEBRUIK !!!!!!!!!





class ProductGroupTree {
	/*
	First record in PRoductGroup must be Root   id : 1   id_parent : 0   nleft : 1   nRight #records x 2  level_depth : 1   is_root : 0
	Second record fa-liid Product groups must be Home : id : 2 id_parent : 1 nleft : 2 nRight : #records x 2 - 1 level_depth : 2  is_root : 1
	*/

	async calcTree() {
		const count = await Database.from('product_groups').count();
		var nRight = count[0]['count(*)'] * 2 + 1;
		var nLeft = 0;
		//const lastIdParent = (await Database.from('product_groups').orderBy('id_parent', 'desc').first()).id_parent;
		// Loop over ALL groups

		// ATTENTION the following is NOT a good solution !!!!! (searching for a better  one !)
		const productGroups = (await ProductGroup.query()
			.where('id', 1)
			.with('childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs.childs')
			.orderBy('name', 'asc')
			.fetch()).toJSON();
		let left = 0;
		//return countChilds(productGroups[0]);
		groupLoop(productGroups[0], 0, 0);
		return productGroups[0];
	}
}
function countChilds(obj) {
	var count = obj.childs.length;
	for (let index = 0; index < obj.childs.length; index++) {
		count += countChilds(obj.childs[index]);
	}
	return count;
}

function groupLoop(obj, counter) {
	counter = counter +1;
  	for (var i = 0; i < obj.childs.length; i ++) {
		var element = obj.childs[i];
		var childcount = countChilds(element);	
		console.log('element :  ' + i + ' ' +  childcount  + ' ' + element.name);
		var result = groupLoop(obj.childs[i], counter);
  	}
  	return null;
}


module.exports = ProductGroupTree;
