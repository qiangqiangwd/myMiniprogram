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
    userInfo:null,
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
  }
})
