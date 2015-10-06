import BufferedReader from 'java/io/BufferedReader';
import File from 'java/io/File';
import StreamTokenizer from 'java/io/StreamTokenizer';
import WKTReader from 'com/vividsolutions/jts/io/WKTReader';
import ArrayList from 'java/util/ArrayList';
import FileReader from 'java/io/FileReader';
import Reader from 'java/io/Reader';
export default class WKTFileReader {
	constructor(...args) {
		(() => {
			this.file = null;
			this.reader = null;
			this.wktReader = null;
			this.count = 0;
			this.limit = -1;
			this.offset = 0;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					if (args[0] instanceof Reader && args[1] instanceof WKTReader) {
						return ((...args) => {
							let [reader, wktReader] = args;
							this.reader = reader;
							this.wktReader = wktReader;
						})(...args);
					} else if (typeof args[0] === "string" && args[1] instanceof WKTReader) {
						return ((...args) => {
							let [filename, wktReader] = args;
							overloads.call(this, new File(filename), wktReader);
						})(...args);
					} else if (args[0] instanceof File && args[1] instanceof WKTReader) {
						return ((...args) => {
							let [file, wktReader] = args;
							this.file = file;
							this.wktReader = wktReader;
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get MAX_LOOKAHEAD() {
		return 1000;
	}
	read(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						if (this.file !== null) this.reader = new FileReader(this.file);
						this.count = 0;
						try {
							var bufferedReader = new BufferedReader(this.reader);
							try {
								return this.read(bufferedReader);
							} finally {
								bufferedReader.close();
							}
						} finally {
							this.reader.close();
						}
					})(...args);
				case 1:
					return ((...args) => {
						let [bufferedReader] = args;
						var geoms = new ArrayList();
						while (!this.isAtEndOfFile(bufferedReader) && !this.isAtLimit(geoms)) {
							var g = this.wktReader.read(bufferedReader);
							if (this.count >= this.offset) geoms.add(g);
							this.count++;
						}
						return geoms;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	setLimit(limit) {
		this.limit = limit;
	}
	isAtEndOfFile(bufferedReader) {
		bufferedReader.mark(WKTFileReader.MAX_LOOKAHEAD);
		var tokenizer = new StreamTokenizer(bufferedReader);
		var type = tokenizer.nextToken();
		if (type === StreamTokenizer.TT_EOF) {
			return true;
		}
		bufferedReader.reset();
		return false;
	}
	setOffset(offset) {
		this.offset = offset;
	}
	isAtLimit(geoms) {
		if (this.limit < 0) return false;
		if (geoms.size() < this.limit) return false;
		return true;
	}
	getClass() {
		return WKTFileReader;
	}
}

