var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({
    data: {
        userInfo: {},
        token: '',
        hasMobile: '',
        memberAmountVo: ''
    },
    onLoad: function (options) {
        var self = this;
        this.onShow();
        let userInfo = wx.getStorageSync('userInfo');
        let token = wx.getStorageSync('token');

        // 页面显示
        if (userInfo && token) {
            app.globalData.userInfo = userInfo;
            app.globalData.token = token;
        }

        this.setData({
            userInfo: app.globalData.userInfo,
            token: app.globalData.token,
        });
        if (wx.getStorageSync('token')) {
            this.getMemberAmount();
        }
    },
    onReady: function () {

    },
    onShow: function (options) {
        var self = this;
        let userInfo = wx.getStorageSync('userInfo');
        let token = wx.getStorageSync('token');

        // 页面显示
        if (userInfo && token) {
            app.globalData.userInfo = userInfo;
            app.globalData.token = token;
        } else {
            this.setData({
                userInfo: {
                    nickName: 'Hi,游客',
                    userName: '点击去登录',
                    avatarUrl: 'https://platform-wxmall.oss-cn-beijing.aliyuncs.com/upload/20180727/150547696d798c.png'
                },
                token: '',
            });
        }
        if (wx.getStorageSync('token')) {
            this.getMemberAmount();
        }
    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭
    },
    bindGetUserInfo(e) {
        let userInfo = wx.getStorageSync('userInfo');
        let token = wx.getStorageSync('token');

        if (userInfo && token) {
            return;
        }
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            user.loginByWeixin(e.detail).then(res => {
                this.setData({
                    userInfo: res.content
                });
                app.globalData.userInfo = res.content;
                app.globalData.token = res.content.token;
                if (wx.getStorageSync('token')) {
                    this.getMemberAmount();
                }
            }).catch((err) => {
                console.log(err)
            });
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告通知',
                content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                success: function (res) {
                    if (res.confirm) {
                        wx.openSetting({
                            success: (res) => {
                                if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                                    user.loginByWeixin(e.detail).then(res => {
                                        this.setData({
                                            userInfo: res.content
                                        });
                                        app.globalData.userInfo = res.content;
                                        app.globalData.token = res.content.token;
                                        if (wx.getStorageSync('token')) {
                                            this.getMemberAmount();
                                        }
                                    }).catch((err) => {
                                        console.log(err)
                                    });
                                }
                            }
                        })
                    }
                }
            });
        }

    },

    onPullDownRefresh() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        // 增加下拉刷新数据的功能
        var self = this;
        this.onShow();
        let userInfo = wx.getStorageSync('userInfo');
        let token = wx.getStorageSync('token');

        // 页面显示
        if (userInfo && token) {
            app.globalData.userInfo = userInfo;
            app.globalData.token = token;
        } else {
            this.setData({
                userInfo: {},
                token: '',
            });
        }

        this.setData({
            userInfo: app.globalData.userInfo,
            token: app.globalData.token,
        });
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
    },

    exitLogin: function () {
        wx.showModal({
            title: '',
            confirmColor: '#b4282d',
            content: '退出登录？',
            success: function (res) {
                if (res.confirm) {
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userInfo');

                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                }
            }
        })

    },
    getMemberAmount: function () {
        var that = this;
        util.request(api.getMemberAmount, '', "POST").then(function (res) {
            if (res.status === 1) {
                that.setData({
                    memberAmountVo: res.content,
                });
            }
        });
    },
})