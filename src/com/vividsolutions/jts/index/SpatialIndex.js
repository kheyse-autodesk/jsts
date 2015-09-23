function SpatialIndex() {}
module.exports = SpatialIndex
SpatialIndex.prototype.insert = function (itemEnv, item) {};
SpatialIndex.prototype.remove = function (itemEnv, item) {};
SpatialIndex.prototype.query = function (...args) {
	switch (args.length) {
		case 2:
			return ((...args) => {
				let [searchEnv, visitor] = args;
			})(...args);
		case 1:
			return ((...args) => {
				let [searchEnv] = args;
			})(...args);
	}
};

