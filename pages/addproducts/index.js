// pages/addnews/index.js
var app = getApp();
var coverImgSrc = app.debug.imgsrc + '+cover@2x.png';
var swiperCurrentIndex = 0;
var content = '';
var res_id, title, synopsis, category_id;
var categoryName;
var info;
var contenttexts, contentimgs;
var  html = '';
var system_id;

Page({
  data: {
    res_id: res_id,
    title: title,
    synopsis: synopsis,
    category_id: category_id,
    info: info,
    categoryName: categoryName,
    imgsrc: app.debug.imgsrc,
    coverImgSrc: coverImgSrc,
    system_id: system_id,
    swiperCurrentIndex: swiperCurrentIndex,
    category_id: category_id,
    content: content,
    actionSheetHidden: true,
    // coveractionSheetHidden: true,
    // actionSheetItems: [
    //   { bindtap: 'select', menuList: ['分类1','分类2']}
    // ],
    actionSheetItems :[],
    coveractionSheetItems: [
      { bindtap: 'Menu1', txt: '拍照' },
      { bindtap: 'Menu2', txt: '从手机相册选择' }
    ],
    html: html,
    menu: ''
  },

  // 分类上拉菜单
  actionSheetTap: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindselect: function (e) {
    category_id = e.currentTarget.dataset.category_id;
    this.setData({
      menu: 1,
      actionSheetHidden: !this.data.actionSheetHidden,
      category_id: category_id
    })
  },

  getCategoryId: function(e){
    var categoryId = e.currentTarget.dataset.id;
    categoryName = e.currentTarget.dataset.name;
    this.setData({
      menu: 1,
      actionSheetHidden: !this.data.actionSheetHidden,
      category_id: categoryId,
      categoryName: categoryName
    })
  },

  // 封面图片上传上拉菜单以及正文内容上拉菜单
  coveractionSheetTap: function (e) {
    // this.setData({
    //   coveractionSheetHidden: !this.data.coveractionSheetHidden,
    // })
    var that = this;
    wx.showActionSheet({
      itemList: ['拍照', '从手机相册选择'],
      success: function (res) {
        if (res.tapIndex == 0) {
          that.bindMenu1()
        }
        if (res.tapIndex == 1) {
          that.bindMenu2()
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  // coveractionSheetbindchange: function () {
  //   this.setData({
  //     coveractionSheetHidden: !this.data.coveractionSheetHidden
  //   })
  // },
  bindMenu1: function () {
    this.setData({
      menu: 1,
      // coveractionSheetHidden: !this.data.coveractionSheetHidden
    });
    this.chooseWxImage('camera');
  },
  bindMenu2: function () {
    this.setData({
      menu: 2,
      // coveractionSheetHidden: !this.data.coveractionSheetHidden
    });
    this.chooseWxImage('album');
  },

  //选择拍照或者从手机相册中取图片 
  chooseWxImage: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        that.setData({
          coverImgSrc: res.tempFilePaths[0],
        })
        that.wxupload(that.data.coverImgSrc);
      }
    })
  },

  getTitle:function(e){
    title = e.detail.value;
    this.setData({
      title: title
    })
  },
  getSynopsis:function(e){
    synopsis = e.detail.value;
    this.setData({
      synopsis: synopsis
    })
  },

  wxupload: function (fileUrl) {
    var that = this;

    wx.uploadFile({
      url: app.debug.apiurl + '/upload/image',
      filePath: fileUrl,
      name: 'file',
      // 设置请求的 header
      header: {
        'content-type': 'multipart/form-data'
      },
      // HTTP 请求中其他额外的 form data
      formData: {
        host_id: app.debug.host_id,
        user_id: app.debug.user_id,
        site_id: app.debug.site_id,
      },
      method: 'POST',

      success: function (res) {
        res_id = JSON.parse(res.data).rel.res_id;
        if (res_id) {
          that.setData({
            res_id: res_id
          })
        }
      },
      fail: function (res) {
      }
    })
  },
  publish:function(){
    var that = this;

    if (typeof (that.data.synopsis) == "undefined") {
      that.setData({
        synopsis: ''
      })
    }

    wx.removeStorageSync('html');

    var system_id = that.data.system_id ? that.data.system_id : app.debug.system_id;
    if (typeof (that.data.category_id) == "undefined") {
      that.setData({
        category_id: ''
      })
    }
    if (typeof (that.data.title) == "undefined" || that.data.title == '') {
      app.util.showModal('提示', '请输入标题！', 'true');
    }else{
      wx.request({
        url: app.debug.apiurl + '/product/add',
        data: {
          host_id: app.debug.host_id,
          user_id: app.debug.user_id,
          site_id: app.debug.site_id,
          system_id: system_id,
          title: that.data.title,
          category: that.data.category_id ? JSON.stringify([{
            id: that.data.category_id,
          }]) : '',
          synopsis: that.data.synopsis,
          info: that.data.html,
          res: that.data.res_id ? JSON.stringify([{
            res_id: that.data.res_id
          }]) : ''
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          wx.setStorage({
            key: 'isProductsRefresh',
            data: true,
          })
          wx.removeStorage({
            key: 'info',
            success: function (res) {
            }
          })
          wx.redirectTo({
            url: '/pages/preview/index?system_id=' + system_id +'&id=' + res.data.id + '&manageType=products',
          })
        }
      });
    }
    
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var system_id = options.system_id;

    that.setData({
      system_id: system_id ? system_id : app.debug.system_id
    })

    wx.request({
      url: app.debug.apiurl + '/article/categories-list',
      data: {
        host_id: app.debug.host_id,
        // user_id: app.debug.user_id,
        site_id: app.debug.site_id,
        system_id: system_id ? system_id : app.debug.system_id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        var actionSheetItems = res.data.list;
        that.setData({
          actionSheetItems: actionSheetItems
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    html = wx.getStorageSync('html');
    var info = '';
    if (html) {
      that.setData({
        html: html
      })
      var returninfo = wx.getStorageSync('info');
      if (returninfo.contentimgs.length == 1){
        info = that.data.html;
      }else{
        for (var i = 0; i < returninfo.contentimgs.length; i++) {
          if (returninfo.contenttexts[i]) {
            contenttexts = returninfo.contenttexts[i];
          } else {
            contenttexts = "";
          }
          if (returninfo.contentimgs[i].contentimg != '../../public/trueimages/picture@2x.png') {
            contentimgs = "[图片]";
          } else {
            contentimgs = '';
          }
          info += contenttexts + contentimgs;
        }
      }
      
      that.setData({
        info: info
      })
    }
  },

})