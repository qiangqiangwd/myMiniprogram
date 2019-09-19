// components/home/hot.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 判断当前所在页面
    // index 首页热门 、self 我的标签
    type: {
      type: String,
      value: 'index'
    }
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
    // 跳转对应评论
    turnToComment(e) {
      let url = e.currentTarget.dataset.url
      wx.navigateTo({
        url: url,
      })
    }
  }
})
