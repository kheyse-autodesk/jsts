import Exception from 'java/lang/Exception';
export default class ParseException extends Exception {
	constructor(...args) {
		super();
		(() => {})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (args[0] instanceof Exception) {
						return ((...args) => {
							let [e] = args;
							overloads.call(this, e.toString(), e);
						})(...args);
					} else if (typeof args[0] === "string") {
						return ((...args) => {
							let [message] = args;
							super(message);
						})(...args);
					}
				case 2:
					return ((...args) => {
						let [message, e] = args;
						super(message, e);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	getClass() {
		return ParseException;
	}
}

