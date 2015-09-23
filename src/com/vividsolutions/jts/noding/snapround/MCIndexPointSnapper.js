function MCIndexPointSnapper(index) {
	this.index = null;
	if (arguments.length === 0) return;
	this.index = index;
}
module.exports = MCIndexPointSnapper
var ItemVisitor = require('com/vividsolutions/jts/index/ItemVisitor');
MCIndexPointSnapper.prototype.snap = function (...args) {
	switch (args.length) {
		case 1:
			return ((...args) => {
				let [hotPixel] = args;
				return this.snap(hotPixel, null, -1);
			})(...args);
		case 3:
			return ((...args) => {
				let [hotPixel, parentEdge, hotPixelVertexIndex] = args;
				var pixelEnv = hotPixel.getSafeEnvelope();
				var hotPixelSnapAction = new HotPixelSnapAction(hotPixel, parentEdge, hotPixelVertexIndex);
				this.index.query(pixelEnv, new ItemVisitor());
				return hotPixelSnapAction.isNodeAdded();
			})(...args);
	}
};

