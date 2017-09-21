// pages/addnewscontent/index.js
var app = getApp();
var imgsrc = app.debug.imgsrc;
var contentimgs = []; //动态添加view组件以及存储图片的数组
var imageIndex;  //定义修改图片的下标
var contenttexts = []; //存储正文内容的数组
var contentIndex;   //定义修改正文内容的下标
var imageTemp;
Page({
  data: {
    imageTemp: imageTemp,
    imgsrc: imgsrc,
    imageIndex: imageIndex,
    contenttexts: contenttexts,
    contentIndex: contentIndex,
    contentimgs: [
      { contentimg: imgsrc + 'frame@2x.png', contentimgishidden:true }
      // { contentimg: imgsrc +'frame@3x.png' }
    ],
    // actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'Menu1', txt: '拍照' },
      { bindtap: 'Menu2', txt: '从手机相册选择' }
    ],
  },

  actionSheetTap: function (e) {
    // console.log(222);
    imageIndex = e.currentTarget.dataset.imageIndex;
    this.setData({
      // actionSheetHidden: !this.data.actionSheetHidden,
      imageIndex: imageIndex
    })

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
    // console.log(this.data.contentimgs[0].contentimg);
    var that = this;
    var ci = that.data.contentimgs;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        // var index = 0;
        var contentimg = "contentimgs[" + that.data.imageIndex+"].contentimg";
        var contentimgishidden = "contentimgs[" + that.data.imageIndex + "].contentimgishidden";

        //增加上传图片到服务器的逻辑
        console.log(res.tempFilePaths[0]);
        wx.uploadFile({
          url: app.debug.apiurl + '/upload/image',
          filePath: res.tempFilePaths[0],
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
            console.log('teststetasettstt');
            console.log(res.data)
            
            // console.log(res.data.rel.res_url)
            // console.log(JSON.parse(res.data).rel.res_url)
            that.setData({
              [contentimg]: JSON.parse(res.data).rel.res_url,
              [contentimgishidden]: false
            });
          },
          fail: function (res) {
            app.util.showModal('提示', '图片上传失败', 'true')
          }
        })

        //增加一块view视图组件
        if (that.data.imageIndex == that.data.contentimgs.length -1 ){
          var newimg = { contentimg: that.data.imgsrc + "picture@2x.png", contentimgishidden: true };
          ci.push(newimg);
          that.setData({
            contentimgs: ci,
          });
        }
        // console.log(ci);
      }
    })
  },
  
  getcontenttext:function(e){
    // console.log(111);
    contentIndex = e.currentTarget.dataset.contentIndex;
    var contenttext = "contenttexts[" + contentIndex + "]";
    // console.log([contenttext],e.detail.value)
    this.setData({
      // [contenttext]: JSON.parse(e.detail.value)
      [contenttext]: e.detail.value
    })
  },
  jump: function(){
    var that = this;
    
    //将正文内容户进行缓存，下次增加正文内容的时候可以正常回显
    wx.setStorage({
      key: 'info',
      data: {
        contentimgs: that.data.contentimgs,
        contenttexts: that.data.contenttexts
      },
      success:function(){
        //这里数组拼接的逻辑
        var html = '';
        var contenttexts = '';
        var contentimgs = '';
        // console.log(that.data.contentimgs, that.data.contenttexts);
        
        if (that.data.contentimgs && that.data.contenttexts) {
          if (that.data.contentimgs.length == 1) {
            html = that.data.contenttexts[0];
          }else{
            for (var i = 0; i < that.data.contentimgs.length - 1; i++) {
              if (that.data.contenttexts[i]) {
                contenttexts = "<p>" + that.data.contenttexts[i] + "</p>";
              } else {
                contenttexts = "";
              }
              if (that.data.contentimgs[i]) {
                contentimgs = "<div style='text-align:center'><img style='margin:0 auto;' src='" + that.data.contentimgs[i]['contentimg'] + "'></div>";
              } else {
                contentimgs = '';
              }
              html += contenttexts + "<br />" + contentimgs;
            }
          }
          // console.log(html);
          wx.setStorage({
            key: 'html',
            data: html,
            success: function () {
              // console.log('html cache success')
              wx.navigateBack({
                url: 'pages/addnews/index',
              })
            }
          })
        }
      },
      fail: function (res) {
        console.log('cache fail');
      },
    })

    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(this.data.contenttexts);
    wx.getStorage({
      key: 'info',
      success: function (res) {
        console.log(res.data)
        that.setData({
          contentimgs: res.data.contentimgs,
          contenttexts: res.data.contenttexts
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