import Cloneable from 'java/lang/Cloneable';
import Serializable from 'java/io/Serializable';
import Envelope from 'com/vividsolutions/jts/geom/Envelope';
import Assert from 'com/vividsolutions/jts/util/Assert';
export default class Geometry {
	constructor(...args) {
		(() => {
			this.envelope = null;
			this.factory = null;
			this.SRID = null;
			this.userData = null;
		})();
		const overloads = (...args) => {
			switch (args.length) {
				case 1:
					return ((...args) => {
						let [factory] = args;
						this.factory = factory;
						this.SRID = factory.getSRID();
					})(...args);
			}
		};
		return overloads.apply(this, args);
	}
	get interfaces_() {
		return [Cloneable, Serializable];
	}
	static get serialVersionUID() {
		return 8763622679187376702;
	}
	static hasNonEmptyElements(geometries) {
		for (var i = 0; i < geometries.length; i++) {
			if (!geometries[i].isEmpty()) {
				return true;
			}
		}
		return false;
	}
	static hasNullElements(array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] === null) {
				return true;
			}
		}
		return false;
	}
	getFactory() {
		return this.factory;
	}
	getGeometryN(n) {
		return this;
	}
	getArea() {
		return 0.0;
	}
	isRectangle() {
		return false;
	}
	equals(o) {
		if (!(o instanceof Geometry)) return false;
		var g = o;
		return this.equalsExact(g);
	}
	equalsExact(other) {
		return this === other || this.equalsExact(other, 0);
	}
	getLength() {
		return 0.0;
	}
	getNumGeometries() {
		return 1;
	}
	getUserData() {
		return this.userData;
	}
	getSRID() {
		return this.SRID;
	}
	getEnvelope() {
		return this.getFactory().toGeometry(this.getEnvelopeInternal());
	}
	equal(a, b, tolerance) {
		if (tolerance === 0) {
			return a.equals(b);
		}
		return a.distance(b) <= tolerance;
	}
	getPrecisionModel() {
		return this.factory.getPrecisionModel();
	}
	getEnvelopeInternal() {
		if (this.envelope === null) {
			this.envelope = this.computeEnvelopeInternal();
		}
		return new Envelope(this.envelope);
	}
	clone() {
		try {
			var clone = super.clone();
			if (clone.envelope !== null) {
				clone.envelope = new Envelope(clone.envelope);
			}
			return clone;
		} catch (e) {
			if (e instanceof CloneNotSupportedException) {
				Assert.shouldNeverReachHere();
				return null;
			} else throw e;
		} finally {}
	}
	setSRID(SRID) {
		this.SRID = SRID;
	}
	setUserData(userData) {
		this.userData = userData;
	}
	hashCode() {
		return this.getEnvelopeInternal().hashCode();
	}
	getClass() {
		return Geometry;
	}
}

