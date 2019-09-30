/**
 * === 此部分为首页-》分类部分公共js
*/
const app = getApp();
module.exports = {
    name: 'classify',
    state: {
        classifyList: [], // 

        // 分页参数
        pageIndex: 0,
        pageSize: 5,
    },
    actions: {
        // 获取所有参数
        getData1({ setData, state }, callback) {
            let { classifyList } = state; // 获取当前参数
            if (typeof callback === 'number' && classifyList.length > 0) return

            console.log('获取分类部分参数');
            // 获取分类列表
            app.ajax.classify().then(data => {
                setData({
                    classifyList: data
                });
            });
        }
    },
}