import Arrays from './Arrays'

export default class Collections {
  static reverseOrder() {
    return {
      compare(a, b) {
        return b.compareTo(a)
      }
    }
  }
  static sort(l, c) {
    const a = l.toArray();
    Arrays.sort(a, c);
    const i = l.iterator();
    for (let pos = 0, alen = a.length;  pos < alen;  pos++) {
      i.next();
      i.set(a[pos]);
    }
  }
}
