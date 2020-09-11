// 线上环境
var NewApiRootUrl = 'https://fastgo.icu/share/';
// 开发环境
//var NewApiRootUrl = 'http://192.168.0.2:8000/';

module.exports = {
    IndexUrlMaterial: NewApiRootUrl + '/data/config/v1/MaterialService/getListMaterial', //首页数据接口
    IndexUrlBanner: NewApiRootUrl + 'data/config/v1/BannerService/getListBanner', //首页数据接口IndexUrlChannel
    IndexUrlValidCategory: NewApiRootUrl + 'data/config/v1/MaterialService/getValidListCategoryVo', //首页数据接口IndexUrlChannel
    IndexUrlCategory: NewApiRootUrl + 'data/config/v1/MaterialService/getListCategoryVo', //首页数据接口IndexUrlChannel
    CatalogList: NewApiRootUrl + 'data/config/v1/MaterialService/getListCategoryVo',  //分类目录全部分类数据接口
    AuthLoginByWeixin: NewApiRootUrl + 'data/config/v1/MemberService/login', //微信登录
    GoodsDetail: NewApiRootUrl + 'data/config/v1/MaterialService/getGoodsDetail',  //获得商品的详情
    createTpw: NewApiRootUrl + 'data/config/v1/MaterialService/createTpw',  //生成淘口令
    GoodsHot: NewApiRootUrl + 'data/config/v1/MaterialService/getHotKey',  //热门
    SearchHelper: NewApiRootUrl + 'data/config/v1/MaterialService/searchGoods',  //搜索数据
    SearchClearHistory: NewApiRootUrl + 'search/clearhistory',  //搜索帮助
    Login: NewApiRootUrl + 'data/config/v1/MemberService/login', //账号登录


};
