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
      delete: '删除失败',
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
    // console.log('returnResult 环节', data);
    return result;
  }
  // 添加 新的内容
  add(data) {
    delete data.type; // 删除 type 属性

    let sendData = this.cntChange(data);
    // console.log('上传的参数', sendData);
    return menuList.add({
      data: sendData
    })
  }
  // 修改内容
  update(data){
    let id = data.id;
    delete data.type; // 删除 type 属性
    delete data.id; // 删除 id 属性

    let sendData = this.cntChange(data);
    return menuList.doc(id).update({
      // data 传入需要局部更新的数据
      data: sendData
    })
  }
  // 公共改变其中的一些值
  cntChange(data){
    data.desc = data.desc.split('\n').join('&hc'); //&hc表示换行  用于输出时候的转换
    return {
      ...data,
      time: (new Date).getTime(), // 更新的评论时间
    };
  }
  // 获取 内容
  async get({ openid, pageSize = 10, pageIndex = 0 }) {
    let result = await menuList.where({
      openid: openid
    })
      .field({
        openid: false
      })
      .orderBy('time', 'desc')
      .skip(pageIndex + pageSize * pageIndex)
      .limit(pageSize)
      .get();
    let data = result.data;
    if (data && data.length > 0) {
      data.forEach(item => {
        // 将空格转换
        item.desc = item.desc.replace(/\s/g, '&nbsp;');
        // 将&hc转换为换行符
        item.desc = item.desc.split('&hc').join('\n');
      });
    }
    console.log('转换后的data', data);
    let sendData = {
      data: data,
      status: !!data,
      msg: !!data ? '成功' : '获取内容出错'
    };

    return sendData
  }
  // 获取指定内容
  async getById({ id }) {
    let result = await menuList.doc(id).get();
    console.log('获取的id：', id);
    // 将&hc转换为换行符
    result.data.desc = result.data.desc.split('&hc').join('\n');
    return result
  }
  // 删除
  delete({ id }) {
    console.log(id);
    return menuList.doc(id).field({
      openid: false
    }).remove();
  }
}


// 云函数入口函数
exports.main = async (event, context) => {
  return (new commentDb(event)).returnResult()
}