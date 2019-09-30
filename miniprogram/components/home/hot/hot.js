// components/home/hot.js

const app = getApp();
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
    },
    index: {
      type: Number,
      value: 0
    },
    // 当前参数
    option: {
      type: Object,
      value: {
        "_id": "075734515d883c1c0303bba925d91cd0",
        "classifyId": "0d98b260-6bf0-4a95-ae51-7cad8429374f",
        "classifyName": "游戏",
        "desc": "666666&hc黄航&hcs",
        "imgSrc": "cloud://cqqserver-lqo61.6371-cqqserver-lqo61-1300157969/3c4c6d855d75b4c615f1bfc1449edb8b/1569037276500.jpg",
        "nickName": "城墙～",
        "time": 1569209369766,
        "title": "三人行",
        "userId": "3c4c6d855d75b4c615f1bfc1449edb8b"
      },
      observer(newVal) {
        if (newVal) {
          let wordNum = 100; //  最多显示的字数
          newVal.showTime = app.globalData.format('yyyy-MM-dd hh:mm:ss', new Date(newVal.time));
          newVal.showDesc = newVal.desc.length >= wordNum ? newVal.desc.slice(0, wordNum) + ' ...' : false; // 截取120个字

          this.setData({
            option: newVal
          });
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    seeMore: true, // 是否能够显示更多
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
    },

    // 删除操作
    _del() {
      let { option, index } = this.data;
      let _this = this;
      wx.showModal({
        title: '提示',
        content: '是否确认删除？',
        success(res) {
          if (res.confirm) {
            _this.triggerEvent('del', {
              id: option._id,
              index: index
            });
          }
        }
      })
    },
    // 跳转编辑页面
    _edit(){
      let option = this.data.option;
      wx.navigateTo({
        url: `./addOrEdit/index?id=${option._id}`
      })
    },

    // 查看更多
    _seeMore(){
      this.setData({
        seeMore: !this.data.seeMore
      });
    },
  }
})
