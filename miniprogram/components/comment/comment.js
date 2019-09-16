// components/comment/comment.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 对应参数
    option: {
      type: Object,
      value: {}
    },
    userId: {
      type: String,
      value: ''
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
    // 点赞操作
    likeChange() {
      let option = this.data.option;
      let userId = this.data.userId;

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
    // 删除评论操作
    delectComment(){
      let option = this.data.option;
      let _this = this;
      wx.showModal({
        title: '提示',
        content: '是否确认删除该评论？',
        success(res) {
          if (res.confirm) {
            _this.triggerEvent('delComment', option._id);
          }
        }
      })
    },
    // 查询相关子评论
    queryReply(){
      let option = this.data.option;
      this.triggerEvent('queryReply', {
        commentId: option._id,
        reply: option.reply,
      });
    }
  }
})
