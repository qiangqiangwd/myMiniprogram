Page({
  data: {
    selectIndex: 2, // 当前所在（初始0）

    footerList: [
      {
        name: '热门',
        imgSrc: 'hot',
        activeImgSrc: 'hot-active',
        index: 0
      },
      {
        name: '分类',
        imgSrc: 'classify',
        activeImgSrc: 'classify-active',
        index: 1
      },
      {
        name: '我的',
        imgSrc: 'my',
        activeImgSrc: 'my-active',
        index: 2
      },
    ],
  },

  // 切换
  // menuChange({ detail }) {
  // },

  // 当页面切换动画结束后
  menuFinish(e) {
    let current = typeof e.detail.current === 'number' ? e.detail.current : e.target.dataset.index;
    let selectIndex = this.data.selectIndex;
    if (current != selectIndex) {
      this.setData({
        selectIndex: current
      });
    }
  },
})