import ByteOrderValues from 'com/vividsolutions/jts/io/ByteOrderValues';
export default class ByteOrderDataInStream {
	constructor(...args) {
		(() => {
			this.byteOrder = ByteOrderValues.BIG_ENDIAN;
			this.stream = null;
			this.buf1 = new Array(1);
			this.buf4 = new Array(4);
			this.buf8 = new Array(8);
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						this.stream = null;
					})(...args);
				case 1:
					return ((...args) => {
						let [stream] = args;
						this.stream = stream;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	setInStream(stream) {
		this.stream = stream;
	}
	readLong() {
		this.stream.read(this.buf8);
		return ByteOrderValues.getLong(this.buf8, this.byteOrder);
	}
	setOrder(byteOrder) {
		this.byteOrder = byteOrder;
	}
	readByte() {
		this.stream.read(this.buf1);
		return this.buf1[0];
	}
	readDouble() {
		this.stream.read(this.buf8);
		return ByteOrderValues.getDouble(this.buf8, this.byteOrder);
	}
	readInt() {
		this.stream.read(this.buf4);
		return ByteOrderValues.getInt(this.buf4, this.byteOrder);
	}
	getClass() {
		return ByteOrderDataInStream;
	}
}

