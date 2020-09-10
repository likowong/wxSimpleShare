var util = require('../../utils/util.js');
var api = require('../../config/api.js');


var app = getApp();
Page({
    data: {
        brandId: null, // 商品id
        brandData: null, // 商品数据
        couponAmount: null,// 优惠卷
        twdUrl: null, // 淘口令地址
        indicatorDots: true, //是否显示面板指示点
        autoplay: false, //是否自动切换
        interval: 3000, //自动切换时间间隔,3s
        duration: 1000, //  滑动动画时长1s
    },
    onLoad: function (options) {
        debugger
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;
        let twdUrl = decodeURIComponent(options.twdUrl)
        that.setData({
            brandId: options.brandId,
            couponAmount: options.couponAmount,
            twdUrl: twdUrl
        });
        this.getGoodsList()
    },
    getGoodsList() {
        var that = this;
        util.request(api.GoodsDetail, that.data.brandId, "POST").then(function (res) {
            if (res.status === 1) {
                let parse = JSON.parse(res.content);
                if (!parse.tbk_item_info_get_response.results.n_tbk_item) {
                    wx.showLoading({
                        title: '没有数据了',
                    });
                    setTimeout(function () {
                        wx.hideLoading()
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 1000)
                    return
                }
                that.setData({
                    brandData: parse.tbk_item_info_get_response.results.n_tbk_item[0]
                });
            }
        });
    },
    createTwd: function () {
        var that = this;
        let url = "https:" + that.data.twdUrl
        let text = "复制口令到tb或tm领取优惠卷"
        let reqData = {text: text, url: url}
        util.request(api.createTpw, reqData, "POST").then(function (res) {
            if (res.status === 1) {
                if (!JSON.parse(res.content).tbk_tpwd_create_response) {
                    return
                }
                wx.setClipboardData({
                    data: JSON.parse(res.content).tbk_tpwd_create_response.data.password_simple,
                    success: function () {
                        wx.showToast({
                            title: '淘口令复制成功',
                            duration: 2000
                        })
                    }
                })
            }
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
    ,
    onShareAppMessage: function () {
        var that = this;
        let brandId = that.data.brandId;
        let couponAmount = that.data.couponAmount;
        let twdUrl = that.data.twdUrl;
        return {
            title: '优惠商品尽在玲宝生活',
            desc: '玲宝生活',
            path: '/pages/brandDetail/brandDetail?brandId=' + brandId + '&couponAmount=' + couponAmount + "&twdUrl=" + twdUrl
        }
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