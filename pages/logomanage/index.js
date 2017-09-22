// pages/logomanage/index.js
var app = getApp();
var defaultImgSrc = app.debug.imgsrc + 'banner@2x.png';
var issmall;
var banner_res_id, banner_url, logo_res_id, logo_txt,logo_type,logo_url;
var style;
var nextNewsId, nextProductsId;
Page({
  data: {
    defaultImgSrc: defaultImgSrc,
    banner_res_id: banner_res_id,
    banner_url: '',
    style: style,
    logo_res_id: logo_res_id,
    logo_txt: logo_txt,
    logo_type: logo_type,
    logo_url: '',
    nextNewsId: nextNewsId,
    nextProductsId: nextProductsId,
    issmall:true, // 默认选中为小图的logo
    // actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'Menu1', txt: '拍照'},
      { bindtap: 'Menu2', txt: '从手机相册选择'}
    ],
    menu: ''
  },
  actionSheetTap: function (e) {
    var that = this;
    var issmall = e.currentTarget.dataset.small;
    //console.log(issmall);
    if(issmall != 'small'){
      that.setData({
        issmall: false,
        actionSheetHidden: !this.data.actionSheetHidden
      })
    }
    if (issmall == 'small') {
      that.setData({
        issmall: true,
        // actionSheetHidden: !this.data.actionSheetHidden
      })
    }
    wx.showActionSheet({
      itemList: ['拍照', '从手机相册选择'],
      success: function (res) {
        console.log(res.tapIndex)
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
  // actionSheetbindchange: function () {
  //   this.setData({
  //     actionSheetHidden: !this.data.actionSheetHidden
  //   })
  // },
  bindMenu1: function () {
    this.setData({
      menu: 1,
      // actionSheetHidden: !this.data.actionSheetHidden
    });
    this.chooseWxImage('camera');
  },
  bindMenu2: function () {
    this.setData({
      menu: 2,
      // actionSheetHidden: !this.data.actionSheetHidden
    });
    this.chooseWxImage('album');
  },

  chooseWxImage: function (type) {
      //console.log(this.data.issmall);
      var that = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: [type],
        success: function (res) {
          console.log(res);
          if (that.data.issmall == true){
            //改变小图
            that.setData({
              logo_url: res.tempFilePaths[0],
            })
            that.wxupload(that.data.logo_url,'logo');
            // that.uploadFile(that.data.logo_url);
          }else{
            //改变大图
            that.setData({
              banner_url: res.tempFilePaths[0],
            })
            that.wxupload(that.data.banner_url,'banner');
          }
        }
      })
  },

  //上传到服务器
  wxupload: function (fileUrl,pictype){
    var that = this;
    // console.log(fileUrl,app.debug.host_id, app.debug.user_id, app.debug.site_id);
    console.log(fileUrl);

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
        console.log(res.data);
        if (pictype == 'logo'){
          var logo_url = JSON.parse(res.data).rel.res_url ? JSON.parse(res.data).rel.res_url : that.data.style.logo_url;
          var logo_res_id = JSON.parse(res.data).rel.res_id ? JSON.parse(res.data).rel.res_id : that.data.style.logo_res_id;
        }else{
          var banner_url = JSON.parse(res.data).rel.res_url ? JSON.parse(res.data).rel.res_url : that.data.style.banner_url;
          var banner_res_id = JSON.parse(res.data).rel.res_id ? JSON.parse(res.data).rel.res_id : that.data.style.banner_res_id;
        }
        that.setData({
          logo_url: logo_url ? logo_url : that.data.logo_url,
          logo_res_id: logo_res_id ? logo_res_id : that.data.logo_res_id,
          banner_url: banner_url ? banner_url : that.data.banner_url,
          banner_res_id: banner_res_id ? banner_res_id : that.data.banner_res_id,
        })
        // console.log(that.data.banner_res_id, that.data.banner_url, that.data.logo_res_id, that.data.logo_txt,that.data.logo_type,that.data.logo_url)
        
      },
      fail: function (res) {
        console.log('fail');
      }
    })
  },

  publish:function(){
    var that = this;
    
    console.log(that.data.banner_res_id, that.data.banner_url, that.data.logo_res_id,  that.data.logo_url)
    wx.request({
      url: app.debug.apiurl + '/site/set-style',
      data: {
        host_id: app.debug.host_id,
        // user_id: app.debug.user_id,
        site_id: app.debug.site_id,
        style: JSON.stringify({
          logo_type: that.data.logo_type,
          logo_txt: that.data.logo_txt,
          logo_res_id: that.data.logo_res_id,
          banner_res_id: that.data.banner_res_id
        })
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        // app.util.showModal('提示', '修改图片成功', 'true')
        wx.redirectTo({
          url: '/pages/newslistmanage/index?nextNewsId=' + that.data.nextNewsId + '&nextProductsId=' + that.data.nextProductsId,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nextNewsId = options.nextNewsId;
    nextProductsId = options.nextProductsId;
    
    var that = this;
    // console.log('nextNewsId==========' + nextNewsId)
    that.setData({
      nextNewsId: nextNewsId,
      nextProductsId: nextProductsId
    })
    wx.request({
      url: app.debug.apiurl + '/site/style',
      data:{
        user_id:app.debug.user_id,
        host_id: app.debug.host_id,
        site_id: app.debug.site_id,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        that.setData({
          banner_res_id: res.data.style.banner_res_id,
          banner_url: res.data.style.banner_url,
          logo_res_id: res.data.style.logo_res_id,
          logo_txt: res.data.style.logo_txt,
          logo_type: res.data.style.logo_type,
          logo_url: res.data.style.logo_url,
        })
      }
    })
  },
})