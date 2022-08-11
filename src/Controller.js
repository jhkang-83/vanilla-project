import { TabType } from './views/TabView.js'

export default class Controller {
  constructor(
    store, 
    { 
      searchFormView, 
      searchResultView, 
      tabView, 
      keywordListView,
      historyListView 
    }
    ) {
      this.store = store

      this.searchFormView = searchFormView
      this.searchResultView = searchResultView
      this.tabView = tabView
      this.keywordListView = keywordListView
      this.historyListView = historyListView

      this.render()
      this.subscribeViewEvents()
    }
    
    subscribeViewEvents() {
    this.searchFormView
      .on('@submit', (event) => this.search(event.detail.value))
      .on('@reset', () => this.reset())
      
    this.tabView.on('@change', (event) => this.changeTab(event.detail.value))
    this.keywordListView.on('@click', (event) => this.search(event.detail.value))

    this.historyListView
      .on('@click', (event) => this.search(event.detail.value))
      .on('@remove', (event) => this.removeHistory(event.detail.value))

    this.searchResultView
      .on('@observer', (event) => this.infiniteScroll(event.detail.value))

  }

  async search(keyword) {
    await this.store.search(keyword)
    await this.render()
  }

  async infiniteScroll (keyword) {
    const currentPage = this.store.getCurrentPage() + 1
    await this.store.search(keyword, currentPage)
    await this.render()
  }

  async reset() {
    this.store.searchKeyword = ''
    this.store.searchResult = []
    await this.render()
  }

  async changeTab(tab) {
    this.store.selectedTab = tab
    await this.render()
  }

  async removeHistory(keyword) {
    this.store.removeHistory(keyword)
    await this.render()
  }

  async render() {
    if (this.store.searchKeyword.length > 0) {
      return await this.renderSearchResult()
    }
    
    this.searchResultView.hide()
    this.tabView.show(this.store.selectedTab)
    if (this.store.selectedTab === TabType.KEYWORD) {
      this.keywordListView.show(this.store.getKeywordList())
      this.historyListView.hide()
    } else if (this.store.selectedTab === TabType.HISTORY) {
      this.keywordListView.hide()
      this.historyListView.show(this.store.getHistoryList())
    } else {
      throw '사용할 수 없는 탭입니다.'
    }
  }

  async renderSearchResult() {
    this.searchFormView.show(this.store.searchKeyword)
    this.tabView.hide()
    this.keywordListView.hide()
    this.historyListView.hide()
    await this.searchResultView.show(this.store.searchResult)
  }
}
