// components/secondCmt/secondCmt.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 当前二级评论参数
    data: {
      type: Array,
      value: [
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
      ]
    },
    isShow: {
      type: Boolean,
      value: false,
      observer(newVal) {
        if (newVal) { // 重置内容
          this.setData({
            replyCnt: ''
          });
        }
      }
    },
    // 当前所在评论id
    commentId: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    replyCnt: '', // 回复内容
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 输入框内容改变
    _inputChange(e) {
      this.setData({
        replyCnt: e.detail.value
      });
    },

    // 关闭
    _close() {
      this.setData({
        isShow: false
      });
    },
    // 点赞操作
    likeChange() {
      let option = this.data.option;
      let userId = this.data.userId;
      return

      app.ajax.comment({
        type: 'liked',
        status: !option.isAddLiked,
        commentId: option._id,
        userId: userId,
      }).then(() => {
        option.liked += option.isAddLiked ? -1 : 1;
        option.isAddLiked = !option.isAddLiked;
        this.setData({
          option: option
        });
      });
    },

    // 进行回复
    reply() {
      let cnt = this.data.replyCnt.trim();
      let sendData = {
        commentId: this.data.commentId,
        content: cnt
      };
      if (cnt) {
        this.setData({
          replyCnt: ''
        });
      }
      this.triggerEvent('reply', sendData);
    }
  }
})
