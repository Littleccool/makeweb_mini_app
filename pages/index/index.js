//index.js
var app = getApp();
var openid, nickname, face_img, username, password;

Page({
  data: {
    imgsrc: app.debug.imgsrc,
    openid: openid,
    nickname: nickname,
    face_img: face_img,
    username: username,
    password: password
  },
  getUserName:function(e){
    username = e.detail.value;
    
    this.setData({
      username: username
    }) ;
  },
  getPassword:function(e){
    password = e.detail.value;
    this.setData({
      password: password
    });
  },
  login:function(){
    var that = this;  
    // console.log(that.data.nickname, that.data.face_img, that.data.openid, that.data.username, that.data.password);
      
    var telreg = /^(((1[3,7]{1}[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!telreg.test(that.data.username)) {
      app.util.showModal('提示', '请输入有效的手机号码！', 'true')
    }else{
      try {
        var userInfo = wx.getStorageSync('userInfo');
        var user = wx.getStorageSync('user');

        if (userInfo) {
          that.setData({
            nickname: userInfo.nickName,
            face_img: userInfo.avatarUrl,
            openid: user.openid
          })
        }
        wx.request({
          url: app.debug.host + '/user/bind',
          data: {
            // openid: that.data.openid,
            openid: that.data.openid,
            nickname: that.data.nickname,
            face_img: that.data.face_img,
            username: that.data.username,
            password: that.data.password
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function (res) {
            if (res.data.user_id && res.data.user_id!= '0'){
              // app.debug.user_id = res.data.user_id;
              // app.debug.isLogin = true;
              wx.setStorage({
                key: 'username',
                data: that.data.username
              })
              wx.setStorage({
                key: 'user_id',
                data: res.data.user_id
              })
              wx.redirectTo({
                url: '/pages/member/index?username=' + that.data.username,
              })
            }else{
              app.util.showModal('提示', res.data.msg, 'true')
            }
          },
          fail: function (event) {
            app.util.showModal('提示', '系统发生错误！', 'true')
          },
        })

      } catch (e) {
        app.util.showModal('提示', '系统发生错误！', 'true')
      }
    }

  },
})

