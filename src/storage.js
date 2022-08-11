import { createPastDate } from './helpers.js'

const storage = {
  keywordData: [
    { id: 1, keyword: '홍대/합정' },
    { id: 2, keyword: '강남' },
    { id: 3, keyword: '성수' },
    { id: 4, keyword: '압구정/가로수길' },
  ],

  historyData: [],

  productData: [
    {
      id: 1,
      title: '',
      thumbnail: ''
    }
  ],
  existPost: false,
  currentPage: 1,
}

export default storage
