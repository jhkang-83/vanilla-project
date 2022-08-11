import { delegate, formatRelativeDate, qs } from '../helpers.js'
import KeywordListView from './KeywordListView.js'

export default class HistoryListView extends KeywordListView {
  constructor() {
    super(qs('#history-list-view'), new Template())
  }

  bindEvents() {
    delegate(this.element, 'click', 'button.btn-remove', (event) => 
      this.handleClickRemoveBtn(event)
    )

    super.bindEvents()
  }

  handleClickRemoveBtn(event) {
    const value = event.target.parentElement.dataset.keyword
    this.emit('@remove', { value })
    event.stopPropagation()
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

  _getItem({ keyword, date }) {
    return `
      <li data-keyword="${keyword}">
        ${keyword}
        <span class="date">${formatRelativeDate(date)}</span>
        <button class="btn-remove"></button>
      </li>
    `
  }

  getEmptyMeassage() {
    return `<div class="empty-box">검색 이력이 없습니다.</div>`
  }
}