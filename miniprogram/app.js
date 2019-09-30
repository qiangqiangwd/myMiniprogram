//app.js

// 公共接口存放地
const ajax = require('./static/request.js');
App({
  onLaunch: function () {
    // 初始化云服务器
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      });
    }
  },
  ajax: ajax,
  // 全局变量
  globalData:{
    // userInfo:null,
    userInfo: {
      "nickName": "城墙～",
      "gender": 1,
      "language": "zh_CN",
      "city": "Chengdu",
      "province": "Sichuan",
      "country": "China",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/mNHUFBJiaZzVB44sCqiaVicWUA2TjwFHnIRPuJjUetzfAzrHKzaGc5dwvY9smPE8jTT4tAZdQP8MMrTbnmIvp4icjA/132",
      "openid": "oT_dF4z9cVaP0JvhfhwJsIhIJfO0",
      "id": "3c4c6d855d75b4c615f1bfc1449edb8b",
      "registeredTime": 1567995078907
    },
    // 时间转换函数
    // 格式：yyyy-MM-dd hh:mm:ss 或者 yyyy-MM-dd
    format(fmt,date) {
      if (!date){ // 若未上传时间对象则默认当前
        date = new Date();
      }
      var o = {
        "M+": date.getMonth() + 1,                 //月份 
        "d+": date.getDate(),                    //日 
        "h+": date.getHours(),                   //小时 
        "m+": date.getMinutes(),                 //分 
        "s+": date.getSeconds(),                 //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds()             //毫秒 
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    },
  },
  // 提示
  message(msg) {
    wx.showToast({
      title: msg,
      icon: 'none'
    })
  }
})
