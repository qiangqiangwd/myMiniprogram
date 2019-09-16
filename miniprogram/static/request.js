// 接口公共存放地

// 封装的云函数
function request({ name, data = {}, isShowLoading = true }) {
    isShowLoading && wx.showLoading({
        title: '加载中...',
        mask: true
    }); // 显示加载
    return new Promise((resolve, reject) => {
        // 调用云函数
        wx.cloud.callFunction({
            name: name,
            data: data,
            success: res => {
                isShowLoading && wx.hideLoading();
                if (res.result.status) {
                    resolve(res.result.data);
                } else {
                    wx.showToast({
                        title: res.result.msg || '',
                        icon: 'none'
                    });
                    reject(res.result);
                }
            },
            fail: err => {
                wx.hideLoading();
                console.error(`[云函数] [${name}] 调用失败`, err)
                reject(err);
            }
        })
    });
}

const ajax = {
    // 登录
    login: () => request({
        name: 'login',
        isShowLoading: false,
    }),
    // 评论相关
    comment: data => request({
        name: 'comment',
        data: data
    }),
}

module.exports = ajax