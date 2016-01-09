import GeometryFactory from '../geom/GeometryFactory';
import Collection from 'java/util/Collection';
import Iterator from 'java/util/Iterator';
import Exception from 'java/lang/Exception';
import Stopwatch from './Stopwatch';
import System from 'java/lang/System';
import CoordinateSequenceFilter from '../geom/CoordinateSequenceFilter';
export default class Debug {
	constructor(...args) {
		(() => {
			this.out = null;
			this.printArgs = null;
			this.watchObj = null;
			this.args = new Array(1);
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 0:
					return ((...args) => {
						let [] = args;
						this.out = System.out;
						this.printArgs = new Array(1);
						try {
							this.printArgs[0] = Class.forName("java.io.PrintStream");
						} catch (ex) {
							if (ex instanceof Exception) {} else throw ex;
						} finally {}
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [];
	}
	static get DEBUG_PROPERTY_NAME() {
		return "jts.debug";
	}
	static get DEBUG_PROPERTY_VALUE_ON() {
		return "on";
	}
	static get DEBUG_PROPERTY_VALUE_TRUE() {
		return "true";
	}
	static get debugOn() {
		return false;
	}
	static get stopwatch() {
		return new Stopwatch();
	}
	static get lastTimePrinted() {
		return null;
	}
	static get debug() {
		return new Debug();
	}
	static get fact() {
		return new GeometryFactory();
	}
	static get DEBUG_LINE_TAG() {
		return "D! ";
	}
	static get SegmentFindingFilter() {
		return SegmentFindingFilter;
	}
	static addWatch(obj) {
		Debug.debug.instanceAddWatch(obj);
	}
	static isDebugging() {
		return Debug.debugOn;
	}
	static equals(c1, c2, tolerance) {
		return c1.distance(c2) <= tolerance;
	}
	static print(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (typeof args[0] === "string") {
						return ((...args) => {
							let [str] = args;
							if (!Debug.debugOn) {
								return null;
							}
							Debug.debug.instancePrint(str);
						})(...args);
					} else if (args[0] instanceof Object) {
						return ((...args) => {
							let [obj] = args;
							if (!Debug.debugOn) return null;
							Debug.debug.instancePrint(obj);
						})(...args);
					}
				case 2:
					return ((...args) => {
						let [isTrue, obj] = args;
						if (!Debug.debugOn) return null;
						if (!isTrue) return null;
						Debug.debug.instancePrint(obj);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	static hasSegment(geom, p0, p1) {
		var filter = new SegmentFindingFilter(p0, p1);
		geom.apply(filter);
		return filter.hasSegment();
	}
	static breakIf(cond) {
		if (cond) Debug.doBreak();
	}
	static formatField(s, fieldLen) {
		var nPad = fieldLen - s.length();
		if (nPad <= 0) return s;
		var padStr = Debug.spaces(nPad) + s;
		return padStr.substring(padStr.length() - fieldLen);
	}
	static main(args) {
		System.out.println("JTS Debugging is " + (Debug.debugOn ? "ON" : "OFF"));
	}
	static println(obj) {
		if (!Debug.debugOn) {
			return null;
		}
		Debug.debug.instancePrint(obj);
		Debug.debug.println();
	}
	static printWatch() {
		Debug.debug.instancePrintWatch();
	}
	static printIfWatch(obj) {
		Debug.debug.instancePrintIfWatch(obj);
	}
	static resetTime() {
		Debug.stopwatch.reset();
		Debug.lastTimePrinted = Debug.stopwatch.getTime();
	}
	static printTime(tag) {
		if (!Debug.debugOn) {
			return null;
		}
		var time = Debug.stopwatch.getTime();
		var elapsedTime = time - Debug.lastTimePrinted;
		Debug.debug.instancePrint(Math.trunc(Math.trunc(Debug.formatField(Stopwatch.getTimeString(time), 10) + " (" + Debug.formatField(Stopwatch.getTimeString(elapsedTime), 10)) + " ) ") + tag);
		Debug.debug.println();
		Debug.lastTimePrinted = time;
	}
	static doBreak() {
		return null;
	}
	static breakIfEqual(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [o1, o2] = args;
						if (o1.equals(o2)) Debug.doBreak();
					})(...args);
				case 3:
					return ((...args) => {
						let [p0, p1, tolerance] = args;
						if (p0.distance(p1) <= tolerance) Debug.doBreak();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	static spaces(n) {
		var ch = new Array(n);
		for (var i = 0; i < n; i++) {
			ch[i] = ' ';
		}
		return new String(ch);
	}
	static toLine(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [p0, p1] = args;
						return Debug.fact.createLineString([p0, p1]);
					})(...args);
				case 3:
					return ((...args) => {
						let [p0, p1, p2] = args;
						return Debug.fact.createLineString([p0, p1, p2]);
					})(...args);
				case 4:
					return ((...args) => {
						let [p0, p1, p2, p3] = args;
						return Debug.fact.createLineString([p0, p1, p2, p3]);
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	instancePrintWatch() {
		if (this.watchObj === null) return null;
		this.instancePrint(this.watchObj);
	}
	instancePrintObject(obj) {
		var printMethod = null;
		try {
			var cls = obj.getClass();
			try {
				printMethod = cls.getMethod("print", this.printArgs);
				this.args[0] = this.out;
				this.out.print(Debug.DEBUG_LINE_TAG);
				printMethod.invoke(obj, this.args);
			} catch (ex) {
				if (ex instanceof NoSuchMethodException) {
					this.instancePrint(obj.toString());
				} else throw ex;
			} finally {}
		} catch (ex) {
			if (ex instanceof Exception) {
				ex.printStackTrace(this.out);
			} else throw ex;
		} finally {}
	}
	println() {
		this.out.println();
	}
	instanceAddWatch(obj) {
		this.watchObj = obj;
	}
	instancePrint(...args) {
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					if (typeof args[0] === "string") {
						return ((...args) => {
							let [str] = args;
							this.out.print(Debug.DEBUG_LINE_TAG);
							this.out.print(str);
						})(...args);
					} else if (args[0] instanceof Object) {
						return ((...args) => {
							let [obj] = args;
							if (obj instanceof Collection) {
								this.instancePrint(obj.iterator());
							} else if (obj instanceof Iterator) {
								this.instancePrint(obj);
							} else {
								this.instancePrintObject(obj);
							}
						})(...args);
					} else if (args[0].interfaces_ && args[0].interfaces_.indexOf(Iterator) > -1) {
						return ((...args) => {
							let [it] = args;
							for (; it.hasNext(); ) {
								var obj = it.next();
								this.instancePrintObject(obj);
							}
						})(...args);
					}
			}
		};
		return overloads.apply(this, args);
	}
	instancePrintIfWatch(obj) {
		if (obj !== this.watchObj) return null;
		if (this.watchObj === null) return null;
		this.instancePrint(this.watchObj);
	}
	getClass() {
		return Debug;
	}
}
class SegmentFindingFilter {
	constructor(...args) {
		(() => {
			this.p0 = null;
			this.p1 = null;
			this.hasSegment = false;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 2:
					return ((...args) => {
						let [p0, p1] = args;
						this.p0 = p0;
						this.p1 = p1;
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [CoordinateSequenceFilter];
	}
	hasSegment() {
		return this.hasSegment;
	}
	filter(seq, i) {
		if (i === 0) return null;
		this.hasSegment = this.p0.equals2D(seq.getCoordinate(i - 1)) && this.p1.equals2D(seq.getCoordinate(i));
	}
	isDone() {
		return this.hasSegment;
	}
	isGeometryChanged() {
		return false;
	}
	getClass() {
		return SegmentFindingFilter;
	}
}

