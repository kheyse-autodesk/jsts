export default class Integer {
  constructor(value) {
    this.value = value
  }
  static isNaN(n) {
    return Number.isNaN(n)
  }
  intValue() {
    return this.value
  }
}
