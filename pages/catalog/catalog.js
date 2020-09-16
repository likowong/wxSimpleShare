var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
    data: {
        newGoods: [],
        validMaterial: [],
    },
    onLoad: function (options) {
        var that =this;
        let data = new Object();
        this.getCatalog();
        // 获取有效类目
        util.request(api.IndexUrlValidCategory, '', 'POST').then(function (res) {
            if (res.status === 1) {
                data.validMaterial = res.content;
                that.setData(data);
            }
        });
    },

    onPullDownRefresh() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        // 增加下拉刷新数据的功能
        var self = this;
        this.getCatalog();
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
    },

    getCatalog: function () {
        let that = this;
        let data = new Object();
        wx.showLoading({
            title: '加载中...',
        });
        util.request(api.IndexUrlValidCategory, '', 'POST').then(function (res) {
            wx.hideLoading();
            if (res.status === 1) {
                for (let item in res.content) {
                    let newGood = {
                        materialId: res.content[item].materialId,
                        pageNo: 1,
                        pageSize: 10,
                        materialName: res.content[item].materialName
                    }
                    util.request(api.IndexUrlMaterial, newGood, 'POST').then(function (res) {
                        if (res.status === 1) {
                            let newGoods = [];
                            let goods = JSON.parse(res.content).tbk_dg_optimus_material_response.result_list.map_data;
                            let goodsData = {materialName: newGood.materialName, goodsData: goods}
                            newGoods.push(goodsData);
                            data.newGoods = that.data.newGoods.concat(newGoods);
                            that.setData(data);
                        }
                    });
                }
            }
        });
    },
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