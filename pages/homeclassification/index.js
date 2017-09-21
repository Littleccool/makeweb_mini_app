// pages/homeclassification/index.js
var app = getApp();
var classific = [];
var goods = [];
var app = getApp();
var homeimgsrc = app.debug.homeimgsrc;
var swiperCurrentIndex = 0;
var currentTab;

Page({
  data: {
    swiperCurrentIndex: swiperCurrentIndex,
    homeimgsrc: homeimgsrc,
    navbar: [
      { id: '1', type: '分类1' },
      { id: '2', type: '分类2' },
      { id: '3', type: '分类3' },
      { id: '4', type: '分类4' },
      // { id: '5', type: '分类5' },
      // { id: '6', type: '分类6' },
      // { id: '7', type: '分类7' },
      // { id: '8', type: '分类8' },
      // { id: '9', type: '分类9' },
    ],
    goods:[
      { id: '1', title: '苏泊尔产品荣获中轻联创新产品标兵苏泊尔产品荣获中轻联创新产品标兵苏泊尔产品荣获中轻联创新产品标兵', date: '2017-09-15', image: '', desc:'这里是内容简介这里是内容简介这里是内容简介这里是内容简介这里是内容简介这里是内容简介这里是内容简介'},
      { id: '2', title: '苏泊尔产品荣获中轻联创新产品标兵苏泊尔产品荣获中轻联创新产品标兵苏泊尔产品荣获中轻联创新产品标兵', date: '2017-09-15', image: '', desc: '这里是内容简介这里是内容简介这里是内容简介这里是内容简介这里是内容简介这里是内容简介这里是内容简介' },
      { id: '3', title: '苏泊尔产品荣获中轻联创新产品标兵苏泊尔产品荣获中轻联创新产品标兵苏泊尔产品荣获中轻联创新产品标兵', date: '2017-09-15', image: '', desc: '这里是内容简介这里是内容简介这里是内容简介这里是内容简介这里是内容简介这里是内容简介这里是内容简介' },
    ],
    currentTab: 0
  },
  navbarTap: function (e) {
    var goodsId = e.currentTarget.dataset.idx;
    console.log(goodsId);
    //在这里根据id重新请求goods数据，并赋值
    this.setData({
      currentTab: goodsId - 1,
      swiperCurrentIndex: goodsId - 1
    })
  },
  switchSwpier: function (event){
    var currentTab = event.detail.current;
    var goodsId = currentTab + 1;
    //在这里根据id重新请求goods数据，并赋值
    this.setData({
      currentTab: currentTab,
      goodsId: goodsId
    });
    console.log(goodsId)
  }
})