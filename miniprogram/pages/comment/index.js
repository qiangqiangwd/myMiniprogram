// miniprogram/pages/index/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      id: '3c4c6d855d75b4c615f1bfc1449edb8b'
    },

    commentList: [], // 评论列表
    comment: '', // 输入的评论

    // 一级评论部分的分页数据
    pageData: {
      pageIndex: 0, // 当前页数 （0开始）
      pageSize: 10, // 每页总和
    },
    isInFooter: false, // 是否到底
    isAtLoading:false, // 是否正在加载


    // 二级评论弹框部分
    isShow: false,
    secondData: [],
    commentId: null, // 当前所在评论id

    // 菜单栏部分
    isShowTextarea: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    }

    this.getCommentList();
  },

  // 获取评论列表
  getCommentList(callback) {
    let page = this.data.pageData;
    let userInfo = this.data.userInfo;
    let setComment = page.pageIndex <= 0 ? [] : this.data.commentList; // 若为第一页则清空

    app.ajax.comment({
      type: 'get',
      userId: userInfo.id || '',
      ...page
    }).then(data => {
      data.forEach(item => {
        let t = new Date(item.time);
        item.showDate = app.globalData.format('yyyy-MM-dd hh:mm:ss', t);
      });
      setComment.push(...data);
      console.log('获取的评论：', setComment);
      this.setData({
        commentList: setComment,
        isInFooter: data.length < page.pageSize, // 获取的数量是否等于总的数量
      });

      callback && callback()
    });
  },
  // 提交评论
  submitComment(e) {
    let cnt = e.detail.content || this.data.comment.trim();
    console.log(cnt);
    if (!cnt) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return
    }

    let userInfo = this.data.userInfo;
    console.log(userInfo)
    let sendData = {
      userId: userInfo.id,
      openid: userInfo.openid,
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
      content: cnt,
    };
    // 若为二级评论则添加对应 评论id
    if (e) sendData.commentId = e.detail.commentId

    app.ajax.comment({
      type: 'add',
      ...sendData
    }).then(() => {
      // {
      //   "_id": "efdeb2615d777a0c17129dfb0b3e0dda",
      //   "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/mNHUFBJiaZzVB44sCqiaVicWUA2TjwFHnIRPuJjUetzfAzrHKzaGc5dwvY9smPE8jTT4tAZdQP8MMrTbnmIvp4icjA/132",
      //   "commentId": "efdeb2615d7779f7171289dd2589de5c",
      //   "content": "这也会是一条子评论",
      //   "nickName": "城墙～",
      //   "openid": "oT_dF4z9cVaP0JvhfhwJsIhIJfO0",
      //   "time": 1568111116369,
      //   "userId": "3c4c6d855d75b4c615f1bfc1449edb8b",
      //   "liked": 0,
      //   "isAddLiked": false,
      //   "showDate": "2019-09-10 18:25:08"
      // }
      // 重新获取评论
      if (e.detail.content) { // 添加二级评论
        let secondData = this.data.secondData;
        secondData.unshift({
          ...sendData,
          "liked": 0,
          "isAddLiked": false,
          "showDate": '刚刚',
        });
        this.setData({
          secondData: secondData
        });

      } else { // 一级评论
        this.setData({
          isShowTextarea: false,
        });
        // this.getCommentList();
      }
      wx.showToast({
        title: '添加成功',
        icon: 'none'
      });
    })
  },

  // 同步内容（输入框）
  changeComment(e) {
    let val = e.detail.value;
    this.setData({
      comment: val
    });
  },

  // 删除评论
  delComment(e) {
    let id = e.detail;
    let userId = this.data.userInfo.id;
    app.ajax.comment({
      type: 'remove',
      id: id,
      userId: userId,
    }).then(res => {
      console.log(res);
    });
  },
  // 查询评论（二级评论）
  queryReply(e) {
    let { commentId, reply } = e.detail;
    let userId = this.data.userInfo.id;
    if (reply > 0) {
      app.ajax.comment({
        type: 'getSecond',
        commentId: commentId,
        userId: userId
      }).then(data => {
        data.forEach(item => {
          let t = new Date(item.time);
          item.showDate = app.globalData.format('yyyy-MM-dd hh:mm:ss', t);
        });
        this.setData({
          isShow: true,
          secondData: data,
          commentId: commentId,
        });
      });
    } else {
      this.setData({
        isShow: true,
        secondData: [],
        commentId: commentId,
      });
    }
  },

  // 输入框打开和隐藏部分
  ocTextarea() {
    this.setData({
      isShowTextarea: !this.data.isShowTextarea,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('下拉了！');
    // 重置页数参数
    this.setData({
      pageData: {
        pageIndex: 0, // 当前页数 （0开始）
        pageSize: 10, // 每页总和
      }
    });
    this.getCommentList(() => {
      wx.stopPullDownRefresh();
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (!this.data.isInFooter && !this.data.isAtLoading){
      let page = this.data.pageData;
      page.pageIndex += 1;
      this.setData({
        pageData:page,
        isAtLoading:true
      });

      this.getCommentList(()=>{
        this.setData({
          isAtLoading: false
        });
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})