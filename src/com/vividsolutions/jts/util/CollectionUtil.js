function CollectionUtil() {}
module.exports = CollectionUtil
var ArrayList = require('java/util/ArrayList');
CollectionUtil.transform = function (coll, func) {
	var result = new ArrayList();
	for (var i = coll.iterator(); i.hasNext(); ) {
		result.add(func.execute(i.next()));
	}
	return result;
};
CollectionUtil.select = function (collection, func) {
	var result = new ArrayList();
	for (var i = collection.iterator(); i.hasNext(); ) {
		var item = i.next();
		if (Boolean.TRUE.equals(func.execute(item))) {
			result.add(item);
		}
	}
	return result;
};
CollectionUtil.apply = function (coll, func) {
	for (var i = coll.iterator(); i.hasNext(); ) {
		func.execute(i.next());
	}
};

