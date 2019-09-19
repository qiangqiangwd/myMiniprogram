// miniprogram/pages/myTags/addOrEdit/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},

    upImgList: [], // 要上传的图片（未上传的状态）

    classifyList: [
      {
        _id: '0d98b260-6bf0-4a95-ae51-7cad8429374f',
        name: '游戏',
        status: 1,
        type: 2,
      },
      {
        _id: '0d98b260-6bf0-4a95-ae51-7cad8429374f',
        name: '动漫',
        status: 1,
        type: 1,
      },
    ],
    index: 0,

    // 各输入框内容参数
    descCnt:"",
    nameCnt:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    wx.setNavigationBarTitle({
      title: (id ? '编辑' : '新建') + '标签'
    });

    this.setData({
      userInfo: app.globalData.userInfo
    });

    // 获取 upload 组件
    this.upload = this.selectComponent('#uploadEle');
  },
  // 选择类别 
  classifyChange({ detail }){
    this.setData({
      index: detail.value
    });
  },
  // 各输入框值改变
  inputChange({ detail, currentTarget }){
    let val = detail.value;
    let name = currentTarget.dataset.name;

    this.setData({
      [name]: val
    });
    // console.log(e);
  },

  // 获取上传后的图片链接
  bindtempFileChange({ detail }) {
    console.log(detail);
    this.setData({
      upImgList: detail
    });
  },
  // 删除当前上传的图片
  delImg() {
    this.upload._delFile(0);
  },

  // 开始添加对应数据
  startSetType() { }
})