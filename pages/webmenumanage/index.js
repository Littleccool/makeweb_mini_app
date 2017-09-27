//index.js
var app = getApp();
var menuList = [];
var changeType = '';
var isInput=true; 
var menuName = '';
var id = '', orderNum='';
var menuVal = '';
var nextNewsId, nextProductsId;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuName: menuName,
    id: id,
    orderNum: orderNum,
    nextNewsId: nextNewsId,
    nextProductsId: nextProductsId,
    hiddenmodalput: true,//可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框  
    //actionSheetHidden: true,点击菜单列表弹出的下拉框开关
    changeType: changeType,//判断添加菜单弹框还是修改菜单弹框
    isInput: isInput,//设置当前页面在手机不一显示久跳出键盘输入框
    menuVal: menuVal,
    actionSheetItems: [
      { bindtap: 'Menu1', txt: '修改名称' },
      { bindtap: 'Menu2', txt: '删除菜单' },
      // { bindtap: 'Menu3', txt: '排序' },
    ],
    menu: '',
    menuList: [
      // { menuTitle: '首页'},
      // { menuTitle: '产品中心' },
      // { menuTitle: '新闻中心' },
      // { menuTitle: '联系我们' },
    ],
    imgsrc: app.debug.imgsrc
  }, 
  // actionSheetTap: function (e) {
  //   id = e.currentTarget.dataset.id;
  //   orderNum = e.currentTarget.dataset.orderNum;
  //   menuVal = e.currentTarget.dataset.menuVal;
  //   this.setData({
  //     actionSheetHidden: !this.data.actionSheetHidden,
  //     id: id,
  //     orderNum: orderNum,
  //     menuVal: menuVal
  //   })
  // },
  changeName:function(e){
    var that = this;
    id = e.currentTarget.dataset.id;
    orderNum = e.currentTarget.dataset.orderNum;
    menuVal = e.currentTarget.dataset.menuVal;
    that.setData({
      id: id,
      orderNum: orderNum,
      menuVal: menuVal
    })
    wx.showActionSheet({
      itemList: ['修改名称'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          that.bindMenu1()
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  actionSheetTap: function (e) {
    var that = this;  
    id = e.currentTarget.dataset.id;
    orderNum = e.currentTarget.dataset.orderNum;
    menuVal = e.currentTarget.dataset.menuVal;
    that.setData({
      id: id,
      orderNum: orderNum,
      menuVal: menuVal
    })
    wx.showActionSheet({
      itemList: ['修改名称', '删除菜单'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          that.bindMenu1()
        }
        if (res.tapIndex == 1) {
          that.bindMenu2()
        }
        // if (res.tapIndex == 2) {
        //   that.bindMenu3()
        // }
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
    var that = this;
    this.setData({
      menu: 1,
      // actionSheetHidden: !this.data.actionSheetHidden,
      changeType: 'edit'
    })
    // console.log('edit');
    this.modalinput('', this.data.changeType);
  },
  bindMenu2: function () {
    var that = this;

    wx.showModal({
      confirmColor: '#00a8f1',
      cancelColor: '#333333',
      title: '删除提示',
      content: '删除后不可恢复，请谨慎操作！',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.debug.apiurl + '/menu/delete',
            data: {
              host_id: app.debug.host_id,
              user_id: app.debug.user_id,
              site_id: app.debug.site_id,
              id: that.data.id
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (res) {
              console.log(res);
              that.getMenu();
            }
          });
          that.setData({
            menu: 2,
            // actionSheetHidden: !this.data.actionSheetHidden
          })
        } else if (res.cancel) {
          return ;
        }
      }
    })
    
  },
  bindMenu3: function () {
    this.setData({
      menu: 3,
      // actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  getMenuName:function(e){
    menuName = e.detail.value;
    this.setData({
      menuName: menuName
    })
    // console.log(this.data.menuName)
  },

  //点击按钮弹出指定的hiddenmodalput弹出框  
  modalinput: function (e, type) {
    
    if (e) {
      changeType = e.currentTarget.dataset.changeType;
    } else {
      changeType = type;
    }
    
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      changeType: changeType,
      isInput: false
    })
    if (changeType == 'add'){
      this.setData({
        menuVal:''
      })
    }
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function () {
    var that = this;
    // console.log('confirm');
    if (that.data.changeType == 'add'){
      if(that.data.menuName == ''){
        app.util.showModal('提示', '请输入菜单名称！', 'true');
        return;
      }
      wx.request({
        url: app.debug.apiurl + '/menu/add',
        data: {
          host_id: app.debug.host_id,
          user_id: app.debug.user_id,
          site_id: app.debug.site_id,
          name: that.data.menuName
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            menuName : ''
          })
          that.getMenu();
        }
      })
    }else{
      wx.request({
        url: app.debug.apiurl + '/menu/edit',
        data: {
          host_id: app.debug.host_id,
          user_id: app.debug.user_id,
          site_id: app.debug.site_id,
          name: that.data.menuName,
          id: that.data.id
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          console.log(res);
          that.getMenu();
        }
      })
    }
    this.setData({
      hiddenmodalput: true
    })
  }, 

  getMenu:function(){
    var that = this;
    wx.request({
      url: app.debug.apiurl + '/menu/list',
      data: ({
        user_id: app.debug.user_id,
        host_id: app.debug.host_id,
        site_id: app.debug.site_id,
      }),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        that.setData({
          menuList: res.data.list
        })
        // console.log(that.data.menuList);
      }
    })
  },
  next:function(){
    var that = this;
    wx.redirectTo({
      url: '/pages/logomanage/index?nextNewsId=' + that.data.nextNewsId + '&nextProductsId=' + that.data.nextProductsId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    nextNewsId = options.nextNewsId;
    nextProductsId = options.nextProductsId;
    that.setData({
      nextNewsId: nextNewsId,
      nextProductsId: nextProductsId
    })
    this.getMenu();
  },
  
})