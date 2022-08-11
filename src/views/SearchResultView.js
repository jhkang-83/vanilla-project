import View from './View.js'
import { ce, on, qs } from '../helpers.js'

export default class SearchResultView extends View {
  constructor(storage) {
    super(qs('#search-result-view'))

    this.storage = storage
    this.template = new Template()
  }

  async show(data = []) {
    this.element.innerHTML =
      data.productData.length
        ? await this.template.getList(data.productData)
        : this.template.getEmptyMessage()
    
    super.show()
    this.handleScroll(data)
  }

  showTopButton() {
    const targetElement = qs('.result li:first-child')
    const btnTopElement = ce('div')
    btnTopElement.innerHTML = this.template._getBtnTop()
    qs('#search-result-view').appendChild(btnTopElement)

    const io = new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) {
        observer.observe(targetElement)
        btnTopElement.classList.add('showTopBtn')
      } else {
        btnTopElement.classList.remove('showTopBtn')
      }
    }, { threshod: 0 })

    on(btnTopElement, 'click', () => this.scrollToTop())

    io.observe(targetElement)

  }

  scrollToTop() {
    const rootElement = document.documentElement

    rootElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  handleScroll(data = []) {
    const options = {
      root: null,
      rootMargin: '5px',
      threshod: 1
    }
    let listElement = this.getDataForScroll()
    

    if (!listElement) return

    this.showTopButton()

    const isEnd = data.meta.is_end

    const io = new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) {
        observer.unobserve(listElement)
        
        this.handleSubmit()
        listElement = this.getDataForScroll()

        if (isEnd) observer.disconnect()
      }
      
    }, options)

    io.observe(listElement)
  }

  getDataForScroll() {
    const listElement = qs('.result li:last-child')
    return listElement
  }

  handleSubmit() {
    const { value } = qs('[type=text]')
    this.emit('@observer', { value })
  }
}

class Template {
  async getList(data = []) {
    return `
    <ul class="result">
      ${data.map(this._getItem).join('')}
    </ul>
    <div id="endList"></div>
    `
  }

  getEmptyMessage() {
    return `
      <div class="empty-box">검색결과가 없습니다.</div>
    `
  }

  _getItem({ thumbnail, title }) {
    return `
      <li class="list-item">
        <div>
        <img src="${thumbnail}" alt="${title}"/>
          <p>${title}</p>
        </div>
      </li>`
  }

  _getBtnTop() {
    return `
      <div>
        <a href="#" class="btn-top">
          <span>Top</span>
        </a>
      </div>
    `
  }
}
