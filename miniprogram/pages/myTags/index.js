// miniprogram/pages/myTags/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 页面跳转
  turnUrl(){
    wx.navigateTo({
      url:'./addOrEdit/index'
    });
  },
})