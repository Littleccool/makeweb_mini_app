//index.js
var app = getApp();
var username;
var hostList = [];
var userInfo = [];

Page({
  data: {
    hostList: hostList,
    username: username,
    imgsrc: app.debug.imgsrc,
    userInfo: userInfo
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    var user_id = wx.getStorageSync('user_id');
    if(user_id){
      app.debug.user_id = user_id;
    }

    userInfo = wx.getStorageSync('userInfo');
    that.setData({
      userInfo: userInfo,
      username: options.username
    })
    // console.log(userInfo,app.debug.user_id);
    if (app.debug.user_id && app.debug.user_id != '0'){
      // app.debug.user_id = user_id;
      wx.request({
        url: app.debug.host + '/host/list',
        data: {
          user_id: app.debug.user_id
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          // console.log(res.data.list);
          hostList = res.data.list;
          that.setData({
            hostList: hostList
          });
        }
      })
    }else{
      app.util.showModal('提示', '不正确的参数！', 'true')
    }
  },

  redirect:function(e){
    var hostId = e.currentTarget.dataset.hostId;
    var apiUrl = e.currentTarget.dataset.apiUrl;
    if(hostId && apiUrl){
      wx.setStorage({
        key: 'host_id',
        data: hostId,
      })
      wx.setStorage({
        key: 'api_url',
        data: apiUrl,
      })
      wx.navigateTo({
        url: '/pages/manage/index?host_id=' + hostId,
      })
    }else{
      app.util.showModal('提示', '不可用的参数', 'true')
    }
  },

})

