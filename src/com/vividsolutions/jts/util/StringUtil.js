import PrintStream from 'java/io/PrintStream';
import StringReader from 'java/io/StringReader';
import DecimalFormat from 'java/text/DecimalFormat';
import System from 'java/lang/System';
import ArrayList from 'java/util/ArrayList';
import ByteArrayOutputStream from 'java/io/ByteArrayOutputStream';
import Assert from './Assert';
import IOException from 'java/io/IOException';
import LineNumberReader from 'java/io/LineNumberReader';
export default class StringUtil {
	get interfaces_() {
		return [];
	}
	static get NEWLINE() {
		return System.getProperty("line.separator");
	}
	static get SIMPLE_ORDINATE_FORMAT() {
		return new DecimalFormat("0.#");
	}
	static chars(c, n) {
		var ch = new Array(n);
		for (var i = 0; i < n; i++) {
			ch[i] = c;
		}
		return new String(ch);
	}
	static getStackTrace(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [t] = args;
						var os = new ByteArrayOutputStream();
						var ps = new PrintStream(os);
						t.printStackTrace(ps);
						return os.toString();
					})(...args);
				case 2:
					return ((...args) => {
						let [t, depth] = args;
						var stackTrace = "";
						var stringReader = new StringReader(StringUtil.getStackTrace(t));
						var lineNumberReader = new LineNumberReader(stringReader);
						for (var i = 0; i < depth; i++) {
							try {
								stackTrace += lineNumberReader.readLine() + StringUtil.NEWLINE;
							} catch (e) {
								if (e instanceof IOException) {
									Assert.shouldNeverReachHere();
								} else throw e;
							} finally {}
						}
						return stackTrace;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	static split(s, separator) {
		var separatorlen = separator.length;
		var tokenList = new ArrayList();
		var tmpString = "" + s;
		var pos = tmpString.indexOf(separator);
		while (pos >= 0) {
			var token = tmpString.substring(0, pos);
			tokenList.add(token);
			tmpString = tmpString.substring(pos + separatorlen);
			pos = tmpString.indexOf(separator);
		}
		if (tmpString.length > 0) tokenList.add(tmpString);
		var res = new Array(tokenList.size());
		for (var i = 0; i < res.length; i++) {
			res[i] = tokenList.get(i);
		}
		return res;
	}
	static toString(d) {
		return StringUtil.SIMPLE_ORDINATE_FORMAT.format(d);
	}
	static spaces(n) {
		return StringUtil.chars(' ', n);
	}
	getClass() {
		return StringUtil;
	}
}

