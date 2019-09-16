// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init()

const db = cloud.database() // 云函数中调用数据库
const user = db.collection('user'); // 连接表 user 


function setSendData(sendData, { _id, registeredTime }, isNew) {
  sendData.data.isNew = isNew; // 是否为新用户
  sendData.data.id = _id; // 保存id
  sendData.data.registeredTime = registeredTime; // 注册时间

  return sendData
}


exports.main = async (event, context) => {
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext();
  let sendData = {
    status: true,
    data: {
      openid: wxContext.OPENID,
    }
  }
  // 先查询是否为用户（通过openId）
  let isNew = false;
  await user.where({
    openid: wxContext.OPENID,
  }).get().then(res => {
    let userArr = res.data;
    isNew = userArr.length <= 0;
    if (!isNew) { // 不为新用户
      sendData = setSendData(sendData, userArr[0], false);
    }
    console.log('查询用户：', res, isNew);
  });
  if (isNew) {  // 若为新用户则添加进数据库
    let regTime = (new Date()).getTime()
    await user.add({
      data: {
        // data 字段表示需新增的 JSON 数据
        registeredTime: regTime, // 注册时间
        openid: wxContext.OPENID, // openid
      }
    }).then(resp => {
      console.log('添加用户：', resp);
      sendData = setSendData(sendData, { _id: resp._id, registeredTime: regTime }, true);
    })
  }

  return sendData
}
