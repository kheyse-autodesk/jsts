import BufferedReader from 'java/io/BufferedReader';
import WKBReader from './WKBReader';
import File from 'java/io/File';
import StreamTokenizer from 'java/io/StreamTokenizer';
import ArrayList from 'java/util/ArrayList';
import FileReader from 'java/io/FileReader';
import Reader from 'java/io/Reader';
export default class WKBHexFileReader {
	constructor(...args) {
		(() => {
			this.file = null;
			this.reader = null;
			this.wkbReader = null;
			this.count = 0;
			this.limit = -1;
			this.offset = 0;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					if (args[0] instanceof Reader && args[1] instanceof WKBReader) {
						return ((...args) => {
							let [reader, wkbReader] = args;
							this.reader = reader;
							this.wkbReader = wkbReader;
						})(...args);
					} else if (typeof args[0] === "string" && args[1] instanceof WKBReader) {
						return ((...args) => {
							let [filename, wkbReader] = args;
							overloads.call(this, new File(filename), wkbReader);
						})(...args);
					} else if (args[0] instanceof File && args[1] instanceof WKBReader) {
						return ((...args) => {
							let [file, wkbReader] = args;
							this.file = file;
							this.wkbReader = wkbReader;
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
							var line = bufferedReader.readLine().trim();
							if (line.length() === 0) continue;
							var g = this.wkbReader.read(WKBReader.hexToBytes(line));
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
		bufferedReader.mark(WKBHexFileReader.MAX_LOOKAHEAD);
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
		return WKBHexFileReader;
	}
}

