//app.js
App({

  debug: require('./utils/debug.js'),
  util: require('./utils/util.js'),
  

  globalData: {
    appid: 'wx5aaf99b4af363750',//appid需自己提供，此处的appid我随机编写
    secret: 'c37d0449408a6f84d396445866e4fbf5',//secret需自己提供，此处的secret我随机编写
  },

  onLaunch: function () {
    var that = this
    var username = wx.getStorageSync('username');
    var user_id = wx.getStorageSync('user_id');
    if (user_id && username) {
      //如果用户已经登录过小程序，则直接跳转
      wx.redirectTo({
        url: '/pages/member/index?username=' + username,
      })
    }else{
      //如果用户未登录过小程序，则开始授权操作
      var user = wx.getStorageSync('user') || {};
      var userInfo = wx.getStorageSync('userInfo') || {};
      if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
        wx.login({
          success: function (res) {
            if (res.code) {
              wx.getUserInfo({
                success: function (res) {
                  var objz = {};
                  objz.avatarUrl = res.userInfo.avatarUrl;
                  objz.nickName = res.userInfo.nickName;
                  //console.log(objz);
                  wx.setStorageSync('userInfo', objz);//存储userInfo
                },
                fail: function (res) {
                  wx.showModal({
                    title: '提示',
                    content: '因为你未授权，部分信息将无法显示（重新授权请删除小程序并重新授权）',
                  })
                }
              });
              // var d = that.globalData;//这里存储了appid、secret、token串  
              // var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
              // wx.request({
              //   url: l,
              //   data: {},
              //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
              //   // header: {}, // 设置请求的 header  
              //   success: function (res) {
              //     var obj = {};
              //     obj.openid = res.data.openid;
              //     obj.expires_in = Date.now() + res.data.expires_in;
              //     console.log(obj)
              //     wx.setStorageSync('user', obj);//存储openid  
              //   }
              // });
            }
          }
        });
      }
    }
    
  },
})
