// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database() // 云函数中调用数据库
const menuList = db.collection('firstLevelList'); // 连接表 menuList
const _ = db.command;

// 接口相关
class commentDb {
  constructor(event) {
    // 对参数的一些处理
    this.event = event;

    // 请求的返回提示
    this.resMsg = {
      add: '添加失败',
    }
  }
  async returnResult() {
    let data = await this[this.event.type](JSON.parse(JSON.stringify(this.event)));
    // 若有返回以返回 status 为准
    let status = typeof data.status === 'boolean' ? data.status : /ok$/.test(data.errMsg);
    let result = {
      data: data.data || null,
      status: status,
      msg: status ? '成功' : (this.resMsg[this.event.type] || data.msg)
    };
    console.log('returnResult 环节', data);
    return result;
  }
  // 添加 新的内容
  add(data) {
    delete data.type; // 删除 type 属性
    let sendData = {
      ...data,
      time: (new Date).getTime(), // 评论时间
    };
    // console.log('上传的参数', sendData);
    return menuList.add({
      data: sendData
    })
  }
}


// 云函数入口函数
exports.main = async (event, context) => {
  return (new commentDb(event)).returnResult()
}