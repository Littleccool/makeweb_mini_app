var imgSrc = '../../public/trueimages/';
var homeimgSrc = '../../public/homeimages/';
var apiurl = '';
var host_id = '';
var user_id = '';
var site_id = '';
var system_id= "";

//用于调试的host路径
var isDebug = false;
if (!isDebug) {
  var host = 'https://apisd.35.com';
} else {
  var host = 'http://api.d.35test.cn';
}

module.exports = {
  imgsrc: imgSrc,
  homeimgsrc: homeimgSrc,
  host:host,
  apiurl: apiurl,
  host_id: host_id,
  user_id: user_id,
  site_id: site_id,
  system_id: system_id
};