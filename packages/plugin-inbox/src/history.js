
class History extends Array {
  lastValue () {
    return this[this.length - 1]
  }

  push (value) {
    if (value !== this.lastValue()) {
      super.push(value)
    }
    return this.length
  }

  back (number = 1) {
    const removed = this.splice(number * -1)
    return removed[0]
  }
}

module.exports = History
