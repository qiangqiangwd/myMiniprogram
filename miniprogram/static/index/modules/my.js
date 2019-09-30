/**
 * === 此部分为首页-》我的部分公共js
*/
const app = getApp();
module.exports = {
    name: 'my',
    state: {
        classifyList: [], // 分类列表

        // 分页参数
        pageIndex: 0,
        pageSize: 5,
    },
    actions: {
        // 获取所有参数
        getData2({ setData, state }, callback) {
            let { pageIndex, pageSize, classifyList } = state; // 获取当前参数
            if (typeof callback === 'number' && classifyList.length > 0) return
            console.log('获取我的部分参数');
        }
    },
}