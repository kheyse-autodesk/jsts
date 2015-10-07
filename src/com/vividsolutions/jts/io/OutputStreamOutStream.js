import OutStream from './OutStream';
export default class OutputStreamOutStream {
	constructor(...args) {
		(() => {
			this.os = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [os] = args;
						this.os = os;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [OutStream];
	}
	write(buf, len) {
		this.os.write(buf, 0, len);
	}
	getClass() {
		return OutputStreamOutStream;
	}
}

