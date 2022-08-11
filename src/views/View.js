import { emit, on } from '../helpers.js'

export default class View {
  constructor(element) {
    if (!element) throw 'no element'

    this.element = element
    this.originalDisplay = this.element.style.display || 'block'

    return this
  }

  hide() {
    this.element.style.display = 'none'
    return this
  }

  show() {
    this.element.style.display = 'block'
    return this
  }

  on(evnentName, handler) {
    on(this.element, evnentName, handler)
    return this
  }

  emit(evnentName, data) {
    emit(this.element, evnentName, data)
    return this
  }
}
