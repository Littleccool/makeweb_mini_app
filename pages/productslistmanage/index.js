// pages/newslistmanage/index.js
var app = getApp();
var newsList = [];
var id;
var page_index = 1;
var page_size = 8;
var productList = [];
var nextProductsId;
var tempPageIndex = 1;
Page({
  data: {
    page_count:'',
    reachBottom:false,
    tempPageIndex: tempPageIndex,
    imgsrc: app.debug.imgsrc,    
    actionSheetHidden: true,
    id: id,
    page_index: page_index,
    page_size: page_size,
    productList: productList,
    nextProductsId: nextProductsId,
    // actionSheetItems: [
    //   { bindtap: 'Menu1', txt: '编辑' },
    //   { bindtap: 'Menu2', txt: '删除' },
    //   { bindtap: 'Menu3', txt: '预览' }
    // ]
  },
  actionSheetTap: function (e) {
    var that = this;
    id = e.currentTarget.dataset.id,
    that.setData({
      // actionSheetHidden: !this.data.actionSheetHidden,
      id: id
    })
    wx.showActionSheet({
      itemList: ['编辑', '删除', '预览'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          that.bindMenu1()
        }
        if (res.tapIndex == 1) {
          that.bindMenu2()
        }
        if (res.tapIndex == 2) {
          that.bindMenu3()
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
      actionSheetHidden: !this.data.actionSheetHidden
    })
    var system_id = this.data.nextProductsId ? this.data.nextProductsId : app.debug.system_id ;
    console.log('edit system id = ' + system_id)
    wx.navigateTo({
      url: '/pages/editproducts/index?system_id=' + system_id +'&id=' + this.data.id,
      success:function(){
        console.log('success');
      }
    })
  },
  bindMenu2: function () {
    var that = this;
    var system_id = that.data.nextProductsId ? that.data.nextProductsId : app.debug.system_id
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })

    wx.showModal({
      title: '提示',
      content: '确定删除这件产品？',
      success: function (res) {
        if (res.confirm) {
          
          wx.request({
            url: app.debug.apiurl + '/product/delete',
            data: {
              // user_id: app.debug.user_id,
              host_id: app.debug.host_id,
              site_id: app.debug.site_id,
              system_id: system_id ? system_id : app.debug.system_id,
              id: that.data.id
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (res) {
              // that.setData({
              //   productList: res.data.list
              // })
              that.getProductList(system_id);
              app.util.showModal('提示', '删除产品成功！', 'true')
            }
          })
          
        } else if (res.cancel) {
          return;
        }
      }
    })
    
  },
  bindMenu3: function () {
    this.setData({
      menu: 3,
      actionSheetHidden: !this.data.actionSheetHidden
    })
    var system_id = this.data.nextProductsId ? this.data.nextProductsId : app.debug.system_id ;
    wx.navigateTo({
      url: '/pages/preview/index?system_id=' + system_id + '&id=' + this.data.id + '&manageType=products'
    })
  },

  getProductList: function (systemId,page='1'){
    var that = this;
    wx.request({
      url: app.debug.apiurl + '/product/list',
      data: {
        // user_id: app.debug.user_id,
        host_id: app.debug.host_id,
        site_id: app.debug.site_id,
        system_id: systemId ? systemId : app.debug.system_id,
        page_index: page ? page : that.data.page_index,
        page_size: that.data.page_size
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {

        that.setData({
          page_count: res.data.page_count
        })

        var productList = that.data.productList;
        if (page != 1) {
          if (res.data.list.length > 0) {
            for (let i in res.data.list) {
              productList.push(res.data.list[i]);
            }
            that.setData({
              productList: productList,
              reachBottom: false
            })
          } else {
            that.setData({
              productList: productList,
              reachBottom: true
            })
          }
        } else {
          that.setData({
            productList: res.data.list,
            reachBottom: true
          })
        }
        // that.setData({
        //   productList: res.data.list,
        // })
      }
    })
    
    
    console.log(that.data.productList);
  },
  next:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  loadMore: function () {
    var that = this;
    var tempPageIndex = that.data.tempPageIndex;
    that.setData({
      tempPageIndex: tempPageIndex + 1,
    })
    //that.data.page_count + 1（加1是为了防止有些页的数据没满，便被以为到底底部，无法显示“没有更多”）
    if (that.data.page_count + 1 >= that.data.tempPageIndex) {
      that.getProductList(that.data.nextProductsId, that.data.tempPageIndex)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this;
    nextProductsId = options.nextProductsId;
    that.setData({
      nextProductsId: nextProductsId
    })
    that.getProductList(that.data.nextProductsId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var isNewsRefresh = wx.getStorageSync('isProductsRefresh')
    if (isNewsRefresh){
      var that = this;
      that.getProductList(that.data.nextProductsId);
      that.setData({
        tempPageIndex : 1
      })
    }
    wx.removeStorageSync('isProductsRefresh');
  },

})