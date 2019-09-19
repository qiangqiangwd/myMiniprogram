// components/home/my/my.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },
  lifetimes: {
    attached() {
      // 获取用户信息
      this.setData({
        userInfo: app.globalData.userInfo
      });
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},

    myOptions: {
      bgUrl: "cloud://cqqserver-lqo61.6371-cqqserver-lqo61-1300157969/bg.jpg"
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 页面跳转
    turnPage(e){
      let url = e.currentTarget.dataset.url;
      console.log(url);
      wx.navigateTo({
        url: url
      })
    },
  }
})
