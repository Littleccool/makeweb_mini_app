// pages/preview/index.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var category_id, category_name, info, coverImgSrc, res_id, synopsis, title;
Page({

  data: {
    category_id:category_id,
    category_name: category_name,
    info: info,
    coverImgSrc: coverImgSrc,
    res_id: res_id,
    synopsis: synopsis,
    title: title
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    
    var that = this;
    var id = options.id;
    var system_id = options.system_id;
    var manageType = options.manageType;
    if (typeof (id) != 'undefined'){
      if (manageType == 'news') {
        wx.request({
          url: app.debug.apiurl + '/article/get',
          data: {
            // user_id: app.debug.user_id,
            host_id: app.debug.host_id,
            site_id: app.debug.site_id,
            system_id: system_id ? system_id : app.debug.system_id,
            id: id
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function (res) {
            console.log(res);
            that.setData({
              category_id: res.data.info.category_id,
              category_name: res.data.info.category_name,
              info: res.data.info.info,
              coverImgSrc: res.data.info.res.res_url,
              res_id: res.data.info.res.res_id,
              synopsis: res.data.info.synopsis,
              title: res.data.info.title
            });
            WxParse.wxParse('info', 'html', that.data.info, that, 5);

          }
        })
      }
      if (manageType == 'products') {
        wx.request({
          url: app.debug.apiurl + '/product/get',
          data: {
            // user_id: app.debug.user_id,
            host_id: app.debug.host_id,
            site_id: app.debug.site_id,
            system_id: system_id ? system_id : app.debug.system_id,
            id: id
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'POST',
          success: function (res) {
            console.log(res);
            that.setData({
              category_id: res.data.info.category.length != 0 ? res.data.info.category[0].id : '',
              category_name: res.data.info.category.length != 0 ? res.data.info.category[0].name : '',
              info: res.data.info.info,
              coverImgSrc: res.data.info.res.length > 0 ? res.data.info.res[0].res_url : '',
              res_id: res.data.info.res.length > 0 ? res.data.info.res[0].res_id : '',
              synopsis: res.data.info.synopsis,
              title: res.data.info.title
            })
            WxParse.wxParse('info', 'html', that.data.info, that, 5);
          }
        })
      }
    }else{
      var coverImgSrc = wx.getStorageSync('res_url');
      var title = wx.getStorageSync('title');
      var synopsis = wx.getStorageSync('synopsis');
      var category_name = wx.getStorageSync('categoryName');
      var html = wx.getStorageSync('html');

      if (manageType == 'news') {
        that.setData({
          category_name: category_name,
          info: html,
          coverImgSrc: coverImgSrc,
          synopsis: synopsis,
          title: title
        });
        WxParse.wxParse('info', 'html', html, that, 5);
      }
      // if (manageType == 'products') {
      //   that.setData({
      //     category_id: res.data.info.category.length != 0 ? res.data.info.category[0].id : '',
      //     category_name: res.data.info.category.length != 0 ? res.data.info.category[0].name : '',
      //     info: res.data.info.info,
      //     coverImgSrc: res.data.info.res.length > 0 ? res.data.info.res[0].res_url : '',
      //     res_id: res.data.info.res.length > 0 ? res.data.info.res[0].res_id : '',
      //     synopsis: res.data.info.synopsis,
      //     title: res.data.info.title
      //   })
      // }
    }
    
    
  },

})