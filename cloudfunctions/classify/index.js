/**
 * 操作分类相关接口
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 数据库操作入口
const db = cloud.database() // 云函数中调用数据库
const classify = db.collection('classify'); // 连接表 conment

// 云函数入口函数
exports.main = async (event, context) => {
  let sendData = {
    data: null,
    status: true,
    msg: ''
  };
  // 查询
  let result = await classify.where({
    status: 1
  })
    .field({
      name: true,
      type: true,
    })
    .get();

  if (/ok$/.test(result.errMsg)){
    sendData.data = result.data;
  }else{
    sendData.status = false;
    sendData.msg = '获取分类失败';
  } 

  return sendData
}