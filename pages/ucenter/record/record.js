var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');


var app = getApp();
Page({
    data: {
        isRecord: ''
    },
    onLoad: function (options) {
        let that = this;
        util.request(api.tbkInfoSave, '', "POST").then(function (res) {
            if (res.content === true) {
                wx.showModal({
                    title: '',
                    content: '您已备案成功',
                    success: function (res) {
                        wx.switchTab({
                            url: '/pages/ucenter/index/index'
                        });
                    }
                });
            }
            that.setData({
                isRecord: true
            });
        });
    },
    onPullDownRefresh() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        // 增加下拉刷新数据的功能
        var self = this;
        // this.getBrand();
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
    }
    , createTwd: function () {
        util.request(api.createInviterCodeResultTbCode, '', "POST").then(function (res) {
            wx.setClipboardData({
                data: res.content,
                success: function () {
                    wx.showToast({
                        title: '邀请码领取成功',
                        duration: 2000
                    })
                }
            })
        });
    }
    ,
    onReady: function () {
        // 页面渲染完成
    }
    ,
    onShow: function () {
        // 页面显示
    }
    ,
    onHide: function () {
        // 页面隐藏
    }
    ,
    onUnload: function () {
        // 页面关闭
    }
})