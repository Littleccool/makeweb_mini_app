// pages/newslistmanage/index.js
var app = getApp();
var newsList = [];
var id;
var page_index = 1;
var page_size = 8;
var articleList = [];
var nextNewsId, nextProductsId;
var tempPageIndex = 1;
Page({
  data: {
    reachBottom: false,
    tempPageIndex: tempPageIndex,
    page_count:'',
    imgsrc: app.debug.imgsrc,    
    // actionSheetHidden: true,
    id: id,
    page_index: page_index,
    page_size: page_size,
    articleList: articleList,
    nextNewsId: nextNewsId,
    nextProductsId: nextProductsId,
    // actionSheetItems: [
    //   { bindtap: 'Menu1', txt: '编辑' },
    //   { bindtap: 'Menu2', txt: '删除' },
    //   { bindtap: 'Menu3', txt: '预览' }
    // ]
  },
  // actionSheetTap: function (e) {
  //   id = e.currentTarget.dataset.id,
  //     this.setData({
  //       actionSheetHidden: !this.data.actionSheetHidden,
  //       id: id
  //     })
  // },
  actionSheetTap: function (e) {
    var that = this;    
    
    id = e.currentTarget.dataset.id,
    that.setData({
      id: id
    })
    // this.setData({
    //   actionSheetHidden: !this.data.actionSheetHidden,
    //   id: id
    // })
    wx.showActionSheet({
      itemList: ['编辑', '删除', '预览'],
      success: function (res) {
        if (res.tapIndex == 0){
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
    })
    var system_id = this.data.nextNewsId ? this.data.nextNewsId : app.debug.system_id;
    wx.navigateTo({
      url: '/pages/editcontent/index?system_id=' + system_id +'&id=' + this.data.id,
      success:function(){
        console.log('success');
      }
    })
  },
  bindMenu2: function () {
    var that = this;
    var system_id = that.data.nextNewsId ? that.data.nextNewsId : app.debug.system_id
    
    wx.showModal({
      title: '提示',
      content: '确定删除这条新闻?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.debug.apiurl + '/article/delete',
            data: {
              // user_id: app.debug.user_id,
              host_id: app.debug.host_id,
              site_id: app.debug.site_id,
              system_id: system_id ? system_id : app.debug.system_id,
              id:that.data.id
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (res) {
              // that.setData({
              //   articleList: res.data.list
              // })
              that.getArticleList(system_id);
              app.util.showModal('提示', '删除文章成功！', 'true')
            },
          })
        } else if (res.cancel) {
          return;
        }
      }
    })
    
    // this.setData({
    //   actionSheetHidden: !this.data.actionSheetHidden
    // })
  },
  bindMenu3: function () {
    // this.setData({
    //   menu: 3,
    //   actionSheetHidden: !this.data.actionSheetHidden
    // })
    var system_id = app.debug.system_id ? app.debug.system_id : this.data.nextNewsId
    wx.navigateTo({
      url: '/pages/preview/index?system_id=' + system_id +'&id='+this.data.id + '&manageType=news'
    })
  },

  getArticleList: function(systemId,page='1'){
    console.log(page);
    var that = this;

    // console.log(app.debug.host_id, app.debug.site_id, systemId, that.data.page_index, that.data.page_size)
    wx.request({
      url: app.debug.apiurl + '/article/list',
      data: {
        // user_id: app.debug.user_id,
        host_id: app.debug.host_id,
        site_id: app.debug.site_id,
        system_id: systemId ? systemId :app.debug.system_id,
        page_index: page ? page : that.data.page_index,
        page_size: that.data.page_size
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        
        that.setData({
          page_count : res.data.page_count
        })

        var articleList = that.data.articleList;
        
        //下拉刷新的时候
        if(page != 1){
          if (res.data.list.length > 0) {
            for (let i in res.data.list) {
              res.data.list[i].synopsis = res.data.list[i].synopsis.replace(/\n/g, "")
              articleList.push(res.data.list[i]);
            }
            that.setData({
              articleList: articleList,
              reachBottom: false
            })
          }else{
            that.setData({
              articleList: articleList,
              reachBottom: true
            })
          }
        }else{ //修改删除增加的时候
          for (let i in res.data.list) {
            res.data.list[i].synopsis = res.data.list[i].synopsis.replace(/\n/g, "")
          }
          that.setData({
            articleList: res.data.list,
          })
        }
        // that.setData({
        //   articleList: res.data.list,
        // })
      },
      fail:function(){
        console.log('fail');
      }
    })
    
  },
  next:function(){
    var that = this;
    wx.redirectTo({
      url: '/pages/productslistmanage/index?nextProductsId=' + that.data.nextProductsId,
      fail:function(e){
        console.log(e);
      }
    })
  },
  loadMore:function(){
    var that = this;
    var tempPageIndex = that.data.tempPageIndex;
      that.setData({
        tempPageIndex: tempPageIndex + 1,
      })
      //that.data.page_count + 1（加1是为了防止有些页的数据没满，便被以为到底底部，无法显示“没有更多”）
      if (that.data.page_count + 1 >= that.data.tempPageIndex){
        that.getArticleList(that.data.nextNewsId, that.data.tempPageIndex)
      }
      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this;
    nextNewsId = options.nextNewsId;
    nextProductsId = options.nextProductsId

    that.setData({
      nextNewsId: nextNewsId,
      nextProductsId: nextProductsId
    })

    that.getArticleList(that.data.nextNewsId);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log('onShow')
    var isNewsRefresh = wx.getStorageSync('isNewsRefresh')
    if (isNewsRefresh){
      var that = this;
      that.getArticleList(that.data.nextNewsId);
      that.setData({
        tempPageIndex: 1
      })
    }
    wx.removeStorageSync('isNewsRefresh')
  },
})