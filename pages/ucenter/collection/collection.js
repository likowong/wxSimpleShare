var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
    data: {
        collectionList: [],
        page: 1,
        size: 10,
        loadmoreText: '正在加载更多数据',
        nomoreText: '全部加载完成',
        nomore: false,
        totalPages: 1
    },
    onLoad: function (options) {
        this.getOrderList()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log("下一页")
        this.getOrderList()
    },

    getOrderList() {
        let that = this;
        let pageData = {
            "pageSize": that.data.size,
            "startPage": that.data.page,
        }
        util.request(api.pageCollection, pageData, "POST").then(function (res) {
            if (res.status === 1) {
                if (res.page.list.length ===0 ) {
                    wx.showLoading({
                        title: '没有收藏了',
                    });
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 1000)
                    return
                }
                that.setData({
                    page: that.data.size + 1,
                    collectionList: that.data.collectionList.concat(res.page.list),
                });
            }
        });
    },

    onReachBottom() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        // 增加下拉刷新数据的功能
        var self = this;
        this.getOrderList();
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {

    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    },
})