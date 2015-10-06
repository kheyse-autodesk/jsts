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
							overloads.call(this, e.toString());
						})(...args);
					} else if (typeof args[0] === "string") {
						return ((...args) => {
							let [message] = args;
							super(message);
						})(...args);
					}
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

