import { delegate, qs } from '../helpers.js'
import View from './View.js'

export default class KeywordListView extends View {
  constructor(element = qs('#keyword-list-view'), template = new Template()) {
    super(element)
    this.template = template
    this.bindEvents()
  }

  bindEvents() {
    delegate(this.element, 'click', 'li', event => this.handleClick(event))
  }

  handleClick(event) {
    event.preventDefault()
    const value = `${ event.target.dataset.keyword }`
    this.emit('@click', { value })
    event.stopPropagation()
  }

  show(data = []) {
    this.element.innerHTML = data.length > 0
      ? this.template.getList(data)
      : this.template.getEmptyMeassage()
    super.show()
  }
}

class Template {
  getList(data = []) {
    return `
      <ul class="list">
        ${ data.map(this._getItem).join('') }
      </ul>
    `
  }

  _getItem({id, keyword}) {
    return `
      <li data-keyword="${keyword}">
        <span class="number">${id}</span>
        ${keyword}
      </li>
    `
  }

  getEmptyMeassage() {
    return `<div class="empty-box">추천 검색어가 없습니다.</div>`
  }
}