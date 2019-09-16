// components/home/classify/classify.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 排行榜
    rankList: {
      type: Array,
      value: [
        {
          name: '游戏三人娘',
          type:'动漫',
        },
        {
          name: '芒种',
          type: '音乐',
        },
        {
          name: '从零开始的异界生活',
          type: '动漫',
        },
        {
          name: '男高',
          type: '动漫',
        },
        {
          name: '日常',
          type: '动漫',
        },
        {
          name: '中国篮球',
          type: '体育',
        },
        {
          name: '英雄联盟',
          type: '游戏',
        },
        {
          name: '鬼灭之刃',
          type: '动漫',
        },
      ]
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 确认搜索
    sureToSearch() { }
  }
})
