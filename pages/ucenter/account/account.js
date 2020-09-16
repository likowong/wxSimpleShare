var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var app = getApp()

Page({
    data: {
        accountCode: '',
        mobile: '',
        name: '',
    },

    onShow: function () {
    },

    onLoad: function () {
        var that = this;
        util.request(api.getMemberAliAccount, '', 'POST').then(function (res) {
            if (res.status === 1) {
                if (res.content) {
                    that.setData({
                        accountCode: res.content.aliPayAccount,
                        mobile: res.content.phone,
                        name: res.content.name,
                    })
                }
            }
        })
    },

    onPullDownRefresh() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        // 增加下拉刷新数据的功能
        var self = this;
        //this.getGoodsList();
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
    },

    bindCheckMobile: function (mobile) {
        if (!mobile) {
            wx.showModal({
                title: '错误',
                content: '请输入手机号码'
            });
            return false
        }
        if (!mobile.match(/^1[3-9][0-9]\d{8}$/)) {
            wx.showModal({
                title: '错误',
                content: '手机号格式不正确，仅支持国内手机号码'
            });
            return false
        }
        return true
    },

    bindInputMobile: function (e) {
        this.setData({
            mobile: e.detail.value,
        })
    },
    bindInputAccount: function (e) {
        this.setData({
            accountCode: e.detail.value,
        })
    },
    bindInputName: function (e) {
        this.setData({
            name: e.detail.value,
        })
    },

    bindLoginMobilecode: function (e) {
        var mobile = this.data.mobile;
        var accountCode = this.data.accountCode;
        var name = this.data.name;
        if (!this.bindCheckMobile(mobile)) {
            return
        }
        util.request(api.addMemberAliAccountVo, {
            aliPayAccount: accountCode,
            name: name,
            phone: mobile
        }, 'POST').then(function (res) {
            if (res.status === 1) {
                wx.showModal({
                    title: '提示',
                    content: '操作成功',
                    showCancel: false
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '操作失败,请重试',
                    showCancel: false
                })
            }
        })
    }
})