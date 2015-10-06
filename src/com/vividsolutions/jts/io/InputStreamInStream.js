import InStream from 'com/vividsolutions/jts/io/InStream';
export default class InputStreamInStream {
	constructor(...args) {
		(() => {
			this.is = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [is] = args;
						this.is = is;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [InStream];
	}
	read(buf) {
		this.is.read(buf);
	}
}

