const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
    data: {
        newGoods: [],
        hotGoods: [],
        validMaterial: [],
        material: [],
        materialMap: null,
        brands: [],
        floorGoods: [],
        banner: [],
        pageNo: 1,
        materialId: ''
    },
    onShareAppMessage: function () {
        return {
            title: '优惠商品尽在玲宝生活',
            desc: '玲宝生活',
            path: '/pages/index/index'
        }
    },
    onPullDownRefresh() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        // 增加下拉刷新数据的功能
        var self = this;
        this.getIndexData();
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
    },
    onReachBottom() {
        let that = this;
        let data = new Object();
        // 性能优化
        if (that.data.newGoods.length > 30 * 10) {
            that.data.newGoods = [];
        }
        // 下拉商品
        data.pageNo = that.data.pageNo + 1;
        let materialId = that.data.material[util.randomNum(0, that.data.material.length - 1)].materialId;
        // 记录每个类目的页数
        let pageNo = that.data.materialMap.get(materialId);
        that.data.materialMap.set(materialId, pageNo + 1);

        let newGood = {
            materialId: materialId,
            pageNo: pageNo + 1,
            pageSize: 10
        }
        this.getGoods(newGood);

    },
    getGoods: function (newGood) {
        let that = this;
        let data = new Object();
        util.request(api.IndexUrlMaterial, newGood, 'POST').then(function (res) {
            if (res.status === 1) {
                if (JSON.parse(res.content).tbk_dg_optimus_material_response == null) {
                    that.data.materialMap.delete(newGood.materialId);
                    for (let item = 0; item < that.data.material.length; item++) {
                        if (that.data.material[item].materialId === newGood.materialId) {
                            that.data.material.splice(item, 1)
                        }
                    }
                    if (that.data.materialMap.size === 0) {
                        wx.showLoading({
                            title: '没有更多商品了',
                        });
                        setTimeout(function () {
                            wx.hideLoading()
                        }, 2000)
                        return;
                    }
                    let materialId = that.data.material[util.randomNum(0, that.data.material.length - 1)].materialId;
                    // 记录每个类目的页数
                    let pageNo = that.data.materialMap.get(materialId);
                    that.data.materialMap.set(materialId, pageNo + 1);
                    newGood.materialId = materialId
                    newGood.pageNo = pageNo + 1;
                    that.getGoods(newGood);
                } else {
                    let goods = JSON.parse(res.content).tbk_dg_optimus_material_response.result_list.map_data;
                    data.newGoods = that.data.newGoods.concat(goods);
                    data.materialId = newGood.materialId;
                    that.setData(data);
                }
            }
        });
    },
    getIndexData: function () {
        let that = this;
        let data = new Object();

        // 获取banner数据
        util.request(api.IndexUrlBanner, '', 'POST').then(function (res) {
            if (res.status === 1) {
                data.banner = res.content
                that.setData(data);
            }
        });
        // 获取有效类目
        util.request(api.IndexUrlValidCategory, '', 'POST').then(function (res) {
            if (res.status === 1) {
                data.validMaterial = res.content;
                let materialId = res.content[util.randomNum(0, res.content.length - 1)].materialId;
                data.materialId = materialId;
                that.setData(data);
                // 初始化的商品
                let newGood = {
                    materialId: materialId,
                    pageNo: 1,
                    pageSize: 10
                }
                util.request(api.IndexUrlMaterial, newGood, 'POST').then(function (res) {
                    if (res.status === 1) {
                        if (JSON.parse(res.content).tbk_dg_optimus_material_response == null) {
                            return
                        }
                        data.newGoods = JSON.parse(res.content).tbk_dg_optimus_material_response.result_list.map_data;
                        that.setData(data);
                    }
                });
            }
        });
        // 获取所有的类目
        util.request(api.IndexUrlCategory, '', 'POST').then(function (res) {
            if (res.status === 1) {
                data.material = res.content;
                // 设置类目map
                let map = new Map();
                for (let item in data.material) {
                    map.set(data.material[item].materialId, 1)
                }
                that.data.materialMap = map;
                that.setData(data);
            }
        });

        // util.request(api.IndexUrlHotGoods).then(function (res) {
        //     if (res.errno === 0) {
        //         data.hotGoods = res.data.hotGoodsList
        //         that.setData(data);
        //     }
        // });
        // let materialData = {
        //     materialId: 32366,
        //     pageNo: 1,
        //     pageSize: 10
        // }
        // util.request(api.IndexUrlMaterial,materialData,'POST').then(function (res) {
        //     debugger;
        //     if (res.status === 1) {
        //         data.material = JSON.parse(res.content).tbk_dg_optimus_material_response.result_list.map_data;
        //         that.setData(data);
        //     }
        // });
        // util.request(api.IndexUrlBrand).then(function (res) {
        //     if (res.errno === 0) {
        //         data.brand = res.data.brandList
        //         that.setData(data);
        //     }
        // });
        // util.request(api.IndexUrlCategory).then(function (res) {
        //     if (res.errno === 0) {
        //         data.floorGoods = res.data.categoryList
        //         that.setData(data);
        //     }
        // });


    },
    onLoad: function (options) {
        this.getIndexData();
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})
