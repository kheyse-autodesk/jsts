import InStream from './InStream';
export default class ByteArrayInStream {
	constructor(...args) {
		(() => {
			this.buffer = null;
			this.position = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [buffer] = args;
						this.setBytes(buffer);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [InStream];
	}
	setBytes(buffer) {
		this.buffer = buffer;
		this.position = 0;
	}
	read(buf) {
		var numToRead = buf.length;
		if (this.position + numToRead > this.buffer.length) {
			numToRead = this.buffer.length - this.position;
			System.arraycopy(this.buffer, this.position, buf, 0, numToRead);
			for (var i = numToRead; i < buf.length; i++) {
				buf[i] = 0;
			}
		} else {
			System.arraycopy(this.buffer, this.position, buf, 0, numToRead);
		}
		this.position += numToRead;
	}
	getClass() {
		return ByteArrayInStream;
	}
}

