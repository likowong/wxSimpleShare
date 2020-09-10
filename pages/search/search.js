var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp()
Page({
    data: {
        newGoods: [],
        pageNo: 1,
        keywrod: '',
        searchStatus: false,
        goodsList: [],
        historyKeyword: [],
        categoryFilter: false,
        filterCategory: [],
        defaultKeyword: {},
        hotKeyword: ['女装', '男装', 'iphone', '母婴'],
        page: 1,
        size: 20,
        currentSortType: 'id',
        currentSortOrder: '_asc',
        categoryId: 0,
        sort: ''
    },
    //事件处理函数
    closeSearch: function () {
        wx.navigateBack()
    },
    clearKeyword: function () {
        this.setData({
            keyword: '',
            searchStatus: false
        });
    },
    onLoad: function () {

        this.getSearchKeyword();
    },

    getSearchKeyword() {
        let that = this;
        let data = new Object();
        wx.getStorage({
            key: 'historyKeyword',
            success(res) {
                let cache = res.data;
                that.setData({
                    historyKeyword: cache
                });
            }
        })
        // 获取热门搜索
        util.request(api.GoodsHot, '', "POST").then(function (res) {
            if (res.status === 1) {
                if (res.content.length != 0) {
                    data.hotKeyword = res.content;
                    that.setData(data);
                }
            }
        });
    },

    inputChange: function (e) {

        this.setData({
            keyword: e.detail.value,
            searchStatus: false
        });
        this.getHelpKeyword();
    }
    ,
    getHelpKeyword: function () {
        let that = this;
        let data = new Object();
        if (!that.data.keyword.trim()) {
            return;
        }
        let reqData = {pageNo: that.data.pageNo, pageSize: 10, text: that.data.keyword}
        util.request(api.SearchHelper, reqData, "POST").then(function (res) {
            if (res.status === 1) {
                if (JSON.parse(res.content).tbk_dg_material_optional_response) {
                    wx.getStorage({
                        key: 'historyKeyword',
                        success(res) {
                            let cache = res.data;
                            cache.push(that.data.keyword);
                            let uniqueCache = util.cacheUnique(cache);
                            wx.setStorage({
                                key: "historyKeyword",
                                data: uniqueCache
                            })
                        }, fail(res) {
                            let historyKeyword = [];
                            historyKeyword.push(that.data.keyword)
                            wx.setStorage({
                                key: "historyKeyword",
                                data: historyKeyword
                            })
                        }
                    })
                    let goods = JSON.parse(res.content).tbk_dg_material_optional_response.result_list.map_data;
                    data.searchStatus = true
                    data.newGoods = goods;
                    that.setData(data);
                }
            }
        });
    }
    ,
    inputFocus: function () {
        this.setData({
            searchStatus: false,
            goodsList: []
        });

        if (this.data.keyword) {
            this.getHelpKeyword();
        }
    }
    ,
    clearHistory: function () {
        this.setData({
            historyKeyword: []
        })
        wx.setStorage({
            key: "historyKeyword",
            data: []
        })
    }
    ,
    getGoodsList: function () {
        let that = this;
        let data = new Object();
        let key = that.data.keyword.trim()
        if (!key) {
            return;
        }
        if (key = null || key == undefined || key == 'undefined' || key == '' || key == "") {
            return;
        }
        let reqData = {pageNo: that.data.pageNo, pageSize: 10, text: that.data.keyword, sort: that.data.sort}
        util.request(api.SearchHelper, reqData, "POST").then(function (res) {
            if (res.status === 1) {
                if (JSON.parse(res.content).tbk_dg_material_optional_response) {
                    let goods = JSON.parse(res.content).tbk_dg_material_optional_response.result_list.map_data;
                    data.newGoods = goods;
                    data.searchStatus = true;
                    that.setData(data);
                }
            }
        });
    }
    ,
    onKeywordTap: function (event) {
        if (event.target.dataset.keyword) {
            this.getSearchResult(event.target.dataset.keyword);
        }
    }
    ,
    getSearchResult(keyword) {
        this.setData({
            keyword: keyword,
            page: 1,
            categoryId: 0,
            goodsList: []
        });

        this.getGoodsList();
    }
    ,
    openSortFilter: function (event) {
        let currentId = event.currentTarget.id;
        let tmpSortOrder = '_asc';

        switch (currentId) {
            case 'priceSort':
                if (this.data.currentSortOrder == '_asc') {
                    tmpSortOrder = '_des';
                }
                this.setData({
                    sort: 'price' + tmpSortOrder,
                    currentSortType: 'price',
                    currentSortOrder: tmpSortOrder
                });

                this.getGoodsList();
                break;
            case 'totalSalesSort':
                if (this.data.currentSortOrder == '_asc') {
                    tmpSortOrder = '_des';
                }
                this.setData({
                    sort: 'total_sales' + tmpSortOrder,
                    currentSortType: 'total_sales',
                    currentSortOrder: tmpSortOrder
                });
                this.getGoodsList();
                break;
            case 'tkRateSort':
                if (this.data.currentSortOrder == '_asc') {
                    tmpSortOrder = '_des';
                }
                this.setData({
                    sort: 'tk_total_commi' + tmpSortOrder,
                    currentSortType: 'tk_rate',
                    currentSortOrder: tmpSortOrder
                });
                this.getGoodsList();
                break;
            default:
                if (this.data.currentSortOrder == '_asc') {
                    tmpSortOrder = '_des';
                }
                //综合排序
                this.setData({
                    sort: tmpSortOrder,
                    currentSortType: 'default'
                });
                this.getGoodsList();
        }
    }
    ,
    selectCategory: function (event) {
        let currentIndex = event.target.dataset.categoryIndex;
        let filterCategory = this.data.filterCategory;
        let currentCategory = null;
        for (let key in filterCategory) {
            if (key == currentIndex) {
                filterCategory[key].selected = true;
                currentCategory = filterCategory[key];
            } else {
                filterCategory[key].selected = false;
            }
        }
        this.setData({
            'filterCategory': filterCategory,
            'categoryFilter': false,
            categoryId: currentCategory.id,
            page: 1,
            goodsList: []
        });
        this.getGoodsList();
    }
    ,

    onPullDownRefresh() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        // 增加下拉刷新数据的功能
        var self = this;
        // this.getGoodsList();
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
    }
    ,
    onKeywordConfirm(event) {
        this.getSearchResult(event.detail.value);
    }
    ,
    onReachBottom() {
        let that = this;
        let data = new Object();
        let reqData = {pageNo: that.data.pageNo + 1, pageSize: 10, text: that.data.keyword}
        util.request(api.SearchHelper, reqData, "POST").then(function (res) {
            if (res.status === 1) {
                if (!JSON.parse(res.content).tbk_dg_material_optional_response) {
                    wx.showToast({
                        title: '抱歉,没有更多了',
                    });
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 2000)
                    return;
                } else {
                    let goods = JSON.parse(res.content).tbk_dg_material_optional_response.result_list.map_data;
                    data.newGoods = that.data.newGoods.concat(goods);
                    data.pageNo = that.data.pageNo + 1
                    that.setData(data);
                }
            }
        });
    }
})