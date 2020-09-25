/**
 * 用户相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');


/**
 * 调用微信登录
 */
function loginByWeixin(userInfo) {

  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code;
      return userInfo;
    }).then((userInfo) => {
      //登录远程服务器
      let data = {
        address: userInfo.userInfo.province+userInfo.userInfo.city,
        avatarUrl: userInfo.userInfo.avatarUrl,
        code: code,
        gender: userInfo.userInfo.gender,
        nickName: userInfo.userInfo.nickName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "**")
      }
      util.request(api.AuthLoginByWeixin, data, 'POST').then(res => {
        if (res.status === 1) {
          //存储用户信息
          wx.setStorageSync('userInfo', res.content);
          wx.setStorageSync('token', res.content.token.replace("\n",""));
          resolve(res);
        } else {
          util.showErrorToast(res.message)
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {

      util.checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });

    } else {
      reject(false);
    }
  });
}


module.exports = {
  loginByWeixin,
  checkLogin,
};











