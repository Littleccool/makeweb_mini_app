// pages/manage/index.js
var app = getApp();
var systemList;
var nextNewsId,nextProductsId;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hostInfo : [],
    systemList: systemList,
    imgsrc: app.debug.imgsrc,
    nextNewsId: nextNewsId,
    nextProductsId: nextProductsId
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: "管理建站"//页面标题为路由参数
    })
    
    try {
      var api_url = wx.getStorageSync('api_url');
      var host_id = wx.getStorageSync('host_id');
      if (api_url && host_id && app.debug.user_id) {
        app.debug.apiurl = api_url;
        app.debug.host_id = host_id;
      }
      // console.log(app.debug.apiurl, app.debug.host_id, app.debug.user_id)

      wx.request({
        url: app.debug.host + '/host/info',
        data: {
          host_id: host_id,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            hostInfo: res.data.info
          })
        }
      })

      wx.request({
        url: app.debug.apiurl + '/site/list',
        data: {
          host_id: app.debug.host_id,
          user_id: app.debug.user_id
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success:function(res){
          console.log(res);
          app.debug.site_id = res.data.list[0].site_id;
          // console.log(app.debug.site_id)

          //获取系统刘表
          wx.request({
            url: app.debug.apiurl + '/system/list',
            data: {
              user_id: app.debug.user_id,
              host_id: app.debug.host_id,
              site_id: app.debug.site_id,
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (res) {
              for (let i in res.data.list) {
                if (res.data.list[i].name == '新闻中心'){
                  that.setData({
                    nextNewsId: res.data.list[i].system_id
                  })
                }
                if (res.data.list[i].name == '产品中心') {
                  that.setData({
                    nextProductsId: res.data.list[i].system_id
                  })
                }
              }
              that.setData({
                systemList : res.data.list,
              })
            }
          })
          // console.log(that.data.systemList)
        },
        fail:function(e){
          console.log(e);
        }
      })
    } catch (e) {
      app.util.showModal('提示', '无法获取站点列表！', 'true')
    }
  },

  navigate:function(e){
    var that = this;
    var systemId = e.currentTarget.dataset.systemId;
    var typeId = e.currentTarget.dataset.typeId;
    if(systemId && typeId){
      app.debug.system_id = systemId
    }
    if (typeId == '1'){
      wx.navigateTo({
        url: '/pages/productslistmanage/index?system_id=' + app.debug.system_id,
      })
    }
    if (typeId == '2') {
      wx.navigateTo({
        url: '/pages/newslistmanage/index?system_id=' + app.debug.system_id + '&nextProductsId=' + that.data.nextProductsId,
      })
    }
    
  },
  copy:function(){
    console.log('copy');
    var that = this;
    var domain = that.data.hostInfo.domain;
    wx.setClipboardData({
      data: domain,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
            app.util.showModal('网址复制成功', '可以到浏览器去访问查看啦！', 'true')
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //防止添加产品和添加新闻缓存共用
    var info = wx.getStorageInfoSync('info')
    if (info) {
      wx.removeStorage({
        key: 'info',
        success: function (res) {
          console.log('delete cache info success');
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})