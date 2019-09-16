//index.js
const app = getApp()

const aniJson = require('../../static/json/loading')
Page({
  data: {
    isReady: false,

    width: 375,
    height: 300,
    aniPath: '',    // Web URL
    anidata: aniJson     // JSON
  },
  onLoad: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        let auth = res.authSetting['scope.userInfo'];
        setTimeout(() => {
          if (auth) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                this.readyToLogin(res.userInfo);
              }
            })
          }
          this.setData({
            isReady: !auth
          });
        }, 800);
      },
      fail(err) {
        console.log('getSetting调用错误', err);
      }
    })
  },
  // 获取并保存用户信息
  readyToLogin(e) {
    let userInfo = e.detail ? e.detail.userInfo : e;
    // 获取用户信息后再获取openId
    this.onGetOpenid(userInfo);
    // 再度开始加载
    this.setData({
      isReady: false
    });
  },
  // 通过接口获取其他信息
  onGetOpenid: function (userInfo) {
    app.ajax.login().then(({ openid, id, registeredTime }) => {
      userInfo.openid = openid;
      userInfo.id = id;
      userInfo.registeredTime = registeredTime;
      app.globalData.userInfo = userInfo;

      // 跳转首页
      wx.redirectTo({
        url: '../index/index',
      });
    });
  }
})
