// pages/addnews/index.js
var app = getApp();
var coverImgSrc = app.debug.imgsrc + '+cover@2x.png';
var swiperCurrentIndex = 0;
var selectType = '';
var content = '';
var id, res_id, title, synopsis, category_id, info, category_name;
var system_id;

Page({
  data: {
    id: id,
    info: info,
    coverImgSrc: coverImgSrc,  
    synopsis: synopsis,      
    res_id: res_id,
    title: title,
    category_id: category_id,
    category_name: category_name,
    imgsrc: app.debug.imgsrc,
    swiperCurrentIndex: swiperCurrentIndex,
    selectType: selectType,
    content: content,
    system_id: system_id,
    actionSheetItems:[],
    menu: ''
  },

  actionSheetTap: function () {
    var that = this;
    var actionSheetItems = that.data.actionSheetItems;
    var itemList = [];
    var idList = [];
    for (let i in actionSheetItems) {
      itemList.push(actionSheetItems[i]['name']);
      idList.push(actionSheetItems[i]['id']);
    }
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        // console.log(res.tapIndex)
        // console.log(itemList);
        // console.log(idList);
        that.setData({
          menu: 1,
          // actionSheetHidden: !this.data.actionSheetHidden,
          category_id: idList[res.tapIndex],
          category_name: itemList[res.tapIndex]
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },


  // 封面图片上传上拉菜单以及正文内容上拉菜单
  coveractionSheetTap: function (e) {

    var that = this;    
    wx.showActionSheet({
      itemList: ['拍照', '从手机相册选择'],
      success: function (res) {
        if (res.tapIndex == 0){
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
    //console.log(this.data.issmall);
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
          that.setData({
            coverImgSrc: res.tempFilePaths[0],
          })
          that.wxupload(that.data.coverImgSrc)
      }
    })
  },

  //上传到服务器
  wxupload: function (fileUrl) {
    var that = this;
    // console.log(fileUrl,app.debug.host_id, app.debug.user_id, app.debug.site_id);

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
        console.log(res);
        that.setData({
          coverImgSrc: JSON.parse(res.data).rel.res_url,
          res_id: JSON.parse(res.data).rel.res_id
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  getTitle: function (e) {
    title = e.detail.value;
    this.setData({
      title: title
    })
  },
  getSynopsis: function (e) {
    synopsis = e.detail.value;
    console.log(synopsis);
    this.setData({
      synopsis: synopsis
    })
  },
  publish: function () {
    var that = this;
    wx.request({
      url: app.debug.apiurl + '/article/edit',
      data: {
        // user_id: app.debug.user_id,
        host_id: app.debug.host_id,
        site_id: app.debug.site_id,
        system_id: that.data.system_id ? that.data.system_id : app.debug.system_id,
        id: that.data.id,
        title: that.data.title,
        category_id: that.data.category_id,
        synopsis: that.data.synopsis,
        info: that.data.info,
        res: JSON.stringify({ 
          res_id: that.data.res_id
        })
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if (res.data.msg == 'success'){
          wx.setStorage({
            key: 'isNewsRefresh',
            data: true,
          })
          wx.navigateBack({
            url: '/pages/newslistmanage/index?change=1',
          })
        }
      }
    })
  },
  preview:function(){
    var that = this;
    wx.request({
      url: app.debug.apiurl + '/article/edit',
      data: {
        // user_id: app.debug.user_id,
        host_id: app.debug.host_id,
        site_id: app.debug.site_id,
        system_id: that.data.system_id ? that.data.system_id : app.debug.system_id,
        id: that.data.id,
        title: that.data.title,
        category_id: that.data.category_id,
        synopsis: that.data.synopsis,
        info: that.data.info,
        res: JSON.stringify({
          res_id: that.data.res_id
        })
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if (res.data.msg == 'success') {
          wx.setStorage({
            key: 'isNewsRefresh',
            data: true,
          })
          wx.navigateTo({
            url: '/pages/preview/index?system_id=' + that.data.system_id + '&id=' + that.data.id + '&manageType=news',
          })
        }
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var system_id = options.system_id;
    if (id && system_id){
      that.setData({
        id: id,
        system_id: system_id
      })
    }
    // console.log('edit system id = ' + that.data.system_id);

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
        })
      }
    })
    wx.request({
      url: app.debug.apiurl + '/article/categories-list',
      data: {
        host_id: app.debug.host_id,
        // user_id: app.debug.user_id,
        site_id: app.debug.site_id,
        system_id: system_id ? system_id : app.debug.system_id,
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
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'content',
      success: function (res) {
        console.log(res.data)
      }
    })
  },
})