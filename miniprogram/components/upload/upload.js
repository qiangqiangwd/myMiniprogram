// components/upload/upload.js
Component({
  /**
     * 启用插槽
     */
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 可以选择上传图片的张数
    count: {
      type: Number,
      value: 1
    },
    // 存放的文件夹位置
    folderPos: {
      type: String,
      value: ""
    },
    // 是否自动上传（不通过点击上传按钮）
    isAutoUpload: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tempImg: null, // 当前保存的所有图片路径
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取文件
    _uplaodFile() {
      let { count, isAutoUpload } = this.data;
      let _this = this;
      wx.chooseImage({
        count: count, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success(res) {
          const tempFilePaths = res.tempFilePaths;
          _this.setData({
            tempImg: tempFilePaths
          });
          // console.log(res);

          _this.triggerEvent('tempFileChange', tempFilePaths);
          if (isAutoUpload) {
            _this._submit();
          }
        },
        fail() {
          // fail
          wx.showToast({
            title: '获取图片失败',
            icon: 'none'
          });
        }
      })
    },
    // 删除图片
    _delFile(i) {
      let tempImg = this.data.tempImg;
      if (!tempImg) return

      let _this = this;
      wx.showModal({
        title: '提示',
        content: '是否确认删除该图片',
        success(res) {
          if (res.confirm) {
            tempImg.splice(i, 1); // 删除对应
            _this.setData({
              tempImg: tempImg
            });
            _this.triggerEvent('tempFileChange', tempImg);
          }
        }
      })
    },

    // 提交上传
    async _submit() {
      let { tempImg, folderPos } = this.data;
      console.log('进入', tempImg)
      if (!tempImg || tempImg.length <= 0) return

      let promiseArr = [];
      wx.showLoading({
        title: '上传中'
      });
      tempImg.forEach(item => {
        let suffix = /\.[^\.]+$/.exec(item)[0]; // 正则表达式，获取文件扩展名
        promiseArr.push(wx.cloud.uploadFile({
          cloudPath: `${folderPos ? folderPos + '/' : ''}${(new Date().getTime() + suffix)}`,
          filePath: item
        }));
      });

      let resData = await Promise.all(promiseArr); // 上传到后台
      wx.hideLoading();

      let arr = [];
      resData.forEach(item => {
        if (/ok$/.test(item.errMsg)) {
          arr.push(item.fileID)
        }
      });

      this.triggerEvent('success', arr);
    }
  },
})
