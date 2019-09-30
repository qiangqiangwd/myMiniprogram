// miniprogram/pages/myTags/addOrEdit/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    id: null,

    upImgList: [], // 要上传的图片（未上传的状态）

    classifyList: [
      // {
      //   _id: '0d98b260-6bf0-4a95-ae51-7cad8429374f',
      //   name: '游戏',
      //   status: 1,
      //   type: 2,
      // }
    ],
    index: 0,

    // 各上传的参数
    desc: "",
    title: "",
    imgSrc: '',
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
      userInfo: app.globalData.userInfo,
      id: id
    });
    // 获取分类列表
    app.ajax.classify().then(data => {
      this.setData({
        classifyList: data
      });

      this.getDetailCntById(id, data);
    });

    // 获取 upload 组件
    this.upload = this.selectComponent('#uploadEle');
  },
  // 获取详细内容（在有id的情况下）
  getDetailCntById(id, arr) {
    if (!id) return

    app.ajax.menuList({
      id: id,
      type: "getById"
    }).then(data => {
      let index = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]._id === data.classifyId) {
          index = i;
          break
        }
      }

      this.setData({
        desc: data.desc,
        title: data.title,
        imgSrc: data.imgSrc,
        index: index,
      });
    });
  },
  // 选择类别 
  classifyChange({ detail }) {
    this.setData({
      index: detail.value
    });
  },
  // 各输入框值改变
  inputChange({ detail, currentTarget }) {
    let val = detail.value;
    let name = currentTarget.dataset.name;

    this.setData({
      [name]: val
    });
  },

  // 当前显示的本地图片链接
  bindtempFileChange({ detail }) {
    // console.log(detail);
    this.setData({
      imgSrc: detail[0] // 由于只允许上传一个，故取第一个
    });
  },
  // 删除当前上传的图片
  delImg() {
    let _this = this;
    this.upload._delFile(0, () => {
      _this.setData({
        imgSrc: null
      });
    });
  },

  // 确认提交（先开始上传图片获取到图片信息后再提交对应信息）
  sureToUpdata() {
    let _this = this;
    this.upload._submit(arr => {
      _this.startSetType(arr.length > 0 ? arr[0] : _this.data.imgSrc);
    });
  },

  // （图片上传完成后）开始添加对应数据
  startSetType(imgSrc) {
    let { desc, title, classifyList, index, id } = this.data;
    let userInfo = this.data.userInfo;
    let sendData = {
      classifyName: classifyList[index].name,  // 分类名
      classifyId: classifyList[index]._id,  // 分类id
      desc: desc,  // 描述内容
      title: title, // 标题
      nickName: userInfo.nickName, // 添加人昵称
      userId: userInfo.id, // 添加人id
      openid: userInfo.openid, // 添加人 openid
      imgSrc: imgSrc, // 封面图
      type: id ? 'update' : 'add',
    };
    // 为编辑时要上传id
    if (id) sendData.id = id;
    app.ajax.menuList(sendData).then(res => {
      wx.showToast({
        title: `${id ? '修改' : '新增'}成功`,
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        })
      }, 1000);
    });
  }
})