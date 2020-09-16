var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
    data: {
        orderList: [],
        orderStatus: 12,
        orderStatusName: '付款成功',
        amountStatusName: '预计佣金',
        page: 1,
        size: 10,
        loadmoreText: '正在加载更多数据',
        nomoreText: '全部加载完成',
        nomore: false,
        totalPages: 1
    },
    onLoad: function (options) {
        var that = this;
        // 页面初始化 options为页面跳转所带来的参数

        let pageData = {
            "pageSize": that.page,
            "startPage": that.size
        }
        util.request(api.pageOrderInfo, pageData, "POST").then(function (res) {
            if (res.status === 1) {
                if (!res.page.list) {
                    wx.showLoading({
                        title: '暂无订单',
                    });
                    setTimeout(function () {
                        wx.hideLoading()
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1000)
                    return
                }
                let orderList = [];
                for (let item in res.page.list) {
                    if (res.page.list[item].tkStatus === "12") {
                        orderList.push(res.page.list[item]);
                    }
                }
                that.setData({
                    orderList: orderList,
                    orderStatus: 12
                });
            }
        });
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
            "orderStatus": that.data.orderStatus
        }
        util.request(api.pageOrderInfo, pageData, "POST").then(function (res) {
            if (res.status === 1) {
                if (!res.page.list) {
                    that.setData({
                        nomore: true
                    })
                    wx.showLoading({
                        title: '没有数据了',
                    });
                    return
                }
                that.setData({
                    page: that.page + 1,
                    orderList: res.page.list
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
    checkCurrent: function (e) {
        var that = this;
        let current = e.target.dataset.current;
        // 重置页数
        if (current != that.data.orderStatus) {
            that.setData({
                page: 1,
                size: 10,
            });
        }
        if (current == 12) {
            that.setData({
                amountStatusName: '预计佣金'
            });
        }
        if (current == 13) {
            that.setData({
                amountStatusName: '无效佣金'
            });
        }
        if (current == 14) {
            that.setData({
                amountStatusName: '佣金'
            });
        }
        // 查询条件修改
        that.setData({
            orderStatus: current
        });
        this.getOrderList();

    }
})