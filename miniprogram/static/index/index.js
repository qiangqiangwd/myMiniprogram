// 公共区域


const fs = wx.getFileSystemManager(); // 获取fs

// 获取 modules 下所有文件
let fileArr = fs.readdirSync('/static/index/modules');
let allFileData = {
    state: {},
    actions: {}
}; // 保存所有模块下的数据
fileArr.forEach(item => {
    if (/\.js$/.test(item)) {
        let data = require(`modules/${item}`);
        let name = item.name || item.replace('.js', ''); // a参数设定的名称，若没有则已js名称为主

        // 注册参数
        if (data.state) {
            allFileData.state[name] = data.state;
        }

        // 注册函数
        if (data.actions) {
            for (let item in data.actions) {
                allFileData.actions[item] = function () {
                    let _this = this;
                    data.actions[item].bind(this)({
                        // 动态改变函数中的值
                        setData(changeData) {
                            if (changeData) {
                                let oldVal = allFileData.state[name]; // 原本的值
                                for (let item in changeData){
                                    oldVal[item] = changeData[item];
                                }
                                _this.setData({
                                    [name]:oldVal
                                });
                            }
                        },
                        // 参数
                        state: data.state || {}
                    }, ...arguments);
                };
            }
        }
    }
});

module.exports = allFileData;