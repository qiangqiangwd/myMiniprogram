const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database() // 云函数中调用数据库
const comment = db.collection('comment'); // 连接表 conment
const liked = db.collection('liked'); // 连接表 liked
const _ = db.command

// 接口相关
class commentDb {
  constructor(event) {
    // 对参数的一些处理
    this.event = event;

    // 请求的返回提示
    this.resMsg = {
      get: '获取评论失败',
      add: '添加评论失败',
    }
  }
  async returnResult() {
    let data = await this[this.event.type](this.event);
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
  // 请求所有评论（含分页）
  get(data) {
    return this.getPublic(data, 'get');
  }
  // 获取二级评论
  getSecond(data) {
    return this.getPublic(data, 'getSecond');
  }
  // 获取公用部分
  async getPublic({ pageIndex = 0, pageSize = 10, userId = '', commentId = '' }, type) {
    // 请求参数
    let reqData = type == 'get' ?
      { commentId: _.eq(null) } :
      { commentId: commentId }

    let getRes = await comment
      .where(reqData)
      .skip(pageIndex * pageSize)
      .limit(pageSize)
      .orderBy('time', 'desc')  // 时间越晚排前面
      .get();

    // 循环获取点赞、回复数
    let list = getRes.data;
    let resArr = []; // 点赞参数
    let replyArr = []; // 回复参数
    if (list.length > 0) {
      let likeNumArr = []; // 喜欢的数组
      let replyNumArr = []; // 回复的数组
      for (let i = 0; i < list.length; i++) {
        // 将Promise放入一个数组中等下一起同时请求（10个），以减少请求时间
        let repData = {
          commentId: list[i]._id,
        }
        // 获取点赞信息
        likeNumArr.push(liked
          .where(repData)
          .get());

        // 获取子评论时不需要获取评论数
        if (type === 'get') {
          // 获取回复数量
          replyNumArr.push(comment
            .where(repData)
            .count());
        }
      }

      let p1 = Promise.all(likeNumArr);
      let p2 = type === 'get' ? Promise.all(replyNumArr) : null;

      let getTotalInfo = p2 ? await Promise.all([p1, p2]) : await p1; // 其他参数

      resArr = p2 ? getTotalInfo[0] : getTotalInfo; // 点赞
      replyArr = p2 ? getTotalInfo[1] : []; // 回复
    }
    // console.log(type, resArr, replyArr);

    list.forEach((item, index) => {
      let data = resArr[index].data
      item.liked = data.length; // 数量
      item.isAddLiked = data.filter(r => r.userId === userId).length > 0; // 当前用户是否点赞
      if (replyArr.length > 0) item.reply = replyArr[index].total; // 回复数量
    });

    getRes.data = list;

    return getRes
  }
  // 删除评论
  remove({ id, userId }) {
    // console.log(id, userId);
    return comment.where(_.or([
      { _id: id, userId: userId },
      { commentId: id }
    ])).remove();
  }
  // 点赞操作
  async liked({ commentId, userId, status }) {
    let is = await liked.where({
      commentId: commentId,
      userId: userId
    }).get();

    let resData = {
      msg: '',
      status: true
    };
    // 判断是否包含点赞
    if (is.data.length > 0) {
      if (status) {
        resData.status = false;
        resData.msg = '已经点过赞了~';
      } else {
        let remove = await liked.doc(is.data[0]._id).remove();
      }
    } else if (status) {
      let add = await liked.add({
        data: {
          commentId: commentId,
          userId: userId
        }
      });
    } else {
      resData.status = false;
      resData.msg = '未曾点赞';
    }
    return resData
  }
  // 添加评论
  add({ userId, openid, avatarUrl, nickName, content, commentId }) {
    let sendData = {
      userId: userId,
      openid: openid || '',
      avatarUrl: avatarUrl || '', // 头像
      nickName: nickName || '', // 昵称
      content: content, // 内容
      time: (new Date).getTime(), // 评论时间
      commentId: commentId || null, // 关联的评论id
    };
    return comment.add({
      data: sendData
    })
  }
}


// 云函数入口函数
exports.main = async (event, context) => {
  return (new commentDb(event)).returnResult()
}