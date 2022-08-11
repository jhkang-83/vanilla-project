import { TabType } from './views/TabView.js'
import { createNextId } from './helpers.js'

export default class Store {
  constructor(storage) {
    if (!storage) throw 'no storage'

    this.storage = storage

    this.searchKeyword = ''
    this.searchResult = []
    this.selectedTab = TabType.KEYWORD
  }

  async search(keyword, page = 1, size = 30) {
    const BASE_API = process.env.APP_BASE_API
    const SEARCH_API = process.env.APP_SEARCH_API
    const REST_API_KEY = process.env.APP_API_KEY
    
    this.searchKeyword = keyword
    this.storage.currentPage = page

    try {
      const res = await fetch(`${BASE_API}${SEARCH_API}?query=${this.searchKeyword}&page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Authorization': `KakaoAK ${REST_API_KEY}`
        }
      })

      const data = await res.json()

      if (page <= 1) {
        this.storage.productData = data.documents
      } else {
        this.storage.productData = [...this.storage.productData, ...data.documents]
      }
      this.searchResult = { 
        productData: 
          this.storage.productData 
            ? this.storage.productData
                .map(product => ({ ...product }))
                .filter(x => x.thumbnail !== '') 
            : [],
        meta: data.meta
      }

    } catch (error) {
      console.log('error >>', error)
    }
    
    this.addHistory(keyword)
  }

  getKeywordList() {
    return this.storage.keywordData
  }

  getHistoryList() {
    return this.storage.historyData.sort(this._sortHistory)
  }

  getCurrentPage() {
    return this.storage.currentPage
  }

  _sortHistory(history1, history2) {
    return history2.date - history1.date
  }

  removeHistory(keyword) {
    this.storage.historyData = this.storage.historyData.filter(
      (history) => history.keyword !== keyword
    )
  }

  addHistory(keyword = '') {
    keyword = keyword.trim()
    if (!keyword) return

    const hasHistory = this.storage.historyData.some((history) => history.keyword === keyword)
    if (hasHistory) this.removeHistory(keyword)

    const id = createNextId(this.storage.historyData)
    const date = new Date()

    this.storage.historyData.push({ id, keyword, date })
    this.storage.historyData = this.storage.historyData.sort(this._sortHistory)
  }
}
