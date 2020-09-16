var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
    data: {
        newGoods: [],
        validMaterial: [],
        materialId: '',
        materialName: '',
        pageNo: 1
    },
    onLoad: function (options) {
        var that = this;
        let data = new Object();
        data.materialId = options.materialId
        data.materialName = options.materialName
        that.setData(data);
        this.getCatalog();
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
        let newGood = {
            materialId: that.data.materialId,
            pageNo: that.data.pageNo,
            pageSize: 10,
            materialName: data.materialName
        }
        util.request(api.IndexUrlMaterial, newGood, 'POST').then(function (res) {
            if (res.status === 1) {
                let goods = JSON.parse(res.content).tbk_dg_optimus_material_response.result_list.map_data;
                data.newGoods = that.data.newGoods.concat(goods);
                data.pageNo = that.data.pageNo + 1;
                that.setData(data);
            }
        });
    },
    onReady: function () {
        // 页面渲染完成
    },
    onReachBottom() {
        this.getCatalog();
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