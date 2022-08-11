import { on, qs } from '../helpers.js'
import View from './View.js'

export default class SearchFormView extends View {
  constructor() {
    super(qs('#search-form-view'))

    this.inputElement = qs('[type=text]', this.element)
    this.resetElement = qs('[type=reset]', this.element)

    this.showResetButton(false)
    this.bindEvents()
  }

  showResetButton(visible = true) {
    this.resetElement.style.display = visible ? 'block' : 'none'
  }

  bindEvents() {
    on(this.inputElement, 'keyup', (event) => this.handleKeyUp(event))
    this.on('submit', (event) => this.handleSubmit(event))
    this.on('reset', () => this.handleReset())  
  }

  handleKeyUp(event) {
    event.stopPropagation()
    const { value } = this.inputElement
    this.showResetButton(value.length > 0)

    if (value.length <= 0) this.handleReset()
  }

  handleSubmit(event) {
    event.preventDefault()
    const { value } = this.inputElement
    this.emit('@submit', { value })
    event.stopPropagation()
  }

  handleReset() {
    this.emit('@reset')
  }

  show(searchKeyword) {
    this.inputElement.value = searchKeyword
    this.showResetButton(this.inputElement.value.length > 0)
    super.show()
  }
}
