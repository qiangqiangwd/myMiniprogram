// miniprogram/pages/myTags/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 分页部分的参数
    pageIndex: 0,
    pageSize: 5,

    // 列表参数
    classifyList: [],

    isInit: true, // 是否为初始化加载
    isInFooter: false, // 是否为到底
    isAtLoading: false, // 正在加载中
  },

  onShow() {
    this.initData();
    this.getClassifyList();
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    console.log('下拉了！');
    this.initData();
    this.getClassifyList(() => {
      wx.stopPullDownRefresh();
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (!this.data.isInFooter && !this.data.isAtLoading) {
      this.setData({
        pageIndex: (this.data.pageIndex + 1),
        isAtLoading: true
      });

      this.getClassifyList(() => {
        this.setData({
          isAtLoading: false
        });
      });
    }
  },
  // 初始化数据
  initData() {
    this.setData({
      isInit: true,
      pageIndex: 0,
      pageSize: 5,
    });
  },
  // 获取列表
  getClassifyList(callback) {
    let { pageIndex, pageSize } = this.data;
    let sendData = {
      openid: app.globalData.userInfo.openid,
      pageIndex: pageIndex,
      pageSize: pageSize,
      type: 'get'
    };

    pageIndex <= 0 && this.setData({
      classifyList: []
    });
    app.ajax.menuList(sendData).then(data => {
      this.setData({
        classifyList: data,
        isInit: false,
        isInFooter: !(pageSize <= data.length), // 判断是否到底
      });
      callback && callback();
    }).catch(() => {
      callback && callback();
    });
  },

  // 页面跳转
  turnUrl() {
    wx.navigateTo({
      url: './addOrEdit/index'
    });
  },

  // 删除其中一个
  delClassify({ detail }) {
    let classifyList = this.data.classifyList;
    classifyList.splice(detail.index, 1);


    console.log(detail);
    app.ajax.menuList({
      id: detail.id,
      type: 'delete'
    }).then(data => {
      this.setData({
        classifyList: classifyList
      });
      app.message('删除成功');
    });
  },
})