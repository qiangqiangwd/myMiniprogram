/**
 * === 此部分为首页-》热门部分公共js
*/
const app = getApp();
module.exports = {
    name: 'hot',
    state: {
        classifyList: [], // 分类列表

        // 分页参数
        pageIndex: 0,
        pageSize: 5,

        isInFooter:false, // 是否到底了
    },
    actions: {
        // 获取所有参数
        getData0({ setData, state }, callback) {
            let { pageIndex, pageSize, classifyList } = state; // 获取当前参数

            if (typeof callback === 'number' && classifyList.length > 0) return

            let sendData = {
                openid: app.globalData.userInfo.openid,
                pageIndex: pageIndex,
                pageSize: pageSize,
                type: 'get'
            };

            // 获取所有大分类数据
            app.ajax.menuList(sendData).then(data => {
                // 是否需要先清空
                pageIndex <= 0 && setData({
                    classifyList: []
                });
                setData({
                    classifyList: data,
                    isInFooter: data.length < pageSize
                });
                callback && callback();
            }).catch(() => {
                callback && callback();
            });
        },
        // 下拉刷新
        pullDownRefresh_0({ setData }) {
            // 页数重新变为第一页
            setData({
                pageIndex: 0
            });
            this.getData0(() => {
                console.log('请求完成');
                wx.stopPullDownRefresh();
            });
        },
    },
}