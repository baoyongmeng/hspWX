/**
 * GET请求封装
 */
function get(url, data = {}) {
  var contentType = 'application/x-www-form-urlencoded';
  return request(url, data, 'GET', contentType)
}
 
/**
 * POST请求封装
 */
function post(url, data = {}) {
  var contentType = 'application/json';
  return request(url, data, 'POST', contentType)
}
 
/**
 * PUT请求封装
 */
function put(url, data = {}) {
  var contentType = 'application/json';
  return request(url, data, 'PUT', contentType)
}
 
/**
 * DELETE请求封装
 */
function del(url, data = {}) {
  var contentType = 'application/json';
  return request(url, data, 'DELETE', contentType)
}
 
/**
 * 微信的request
 */
function request(url, data = {}, method, contentType) {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': contentType,
        //'Authorization': 'Bearer ' + getDataByKey('token'),
        'X-Token': wx.getStorageSync('token'),
        'Cookie':wx.getStorageSync('cookie')
      },
      success: function(res) {
        console.log('===========================================================')
        console.log('==    接口地址：' + url)
        console.log('==    接口参数：' + JSON.stringify(data))
        console.log('==    请求类型：' + method)
        console.log("==    接口状态：" + res.statusCode);
        console.log('===========================================================')
        if (res.statusCode == 200) {
          //请求正常200
          //AES解密返回的数据
          var result = null
          console.log(res.data)
          try {
            //此处结合了上篇文章的AES解密，如果不需要加解密，可以自行去掉，直接使用数据 res.data。
            result = res.data
            // console.log('数据：' + result.data)
            //data = JSON.parse(data)
            if (result.status) {
              //正常
              resolve(result);
            } else {
                if(result.code == 403){
                    reject("登录已过期")
                    wx.reLaunch({
                        url: '/pages/login/login',
                      })
                }
              
              reject(result.msg)
            }
          } catch (error) {
            console.log('==    数据解码失败')
            reject("数据解码失败")
          }
        } else if (res.statusCode == 401) {
          //此处验证了token的登录失效，如果不需要，可以去掉。
          //未登录，跳转登录界面
          reject("登录已过期")
        } else {
          //请求失败
          reject("请求失败：" + res.statusCode)
        }
      },
      fail: function(err) {
        //服务器连接异常
        console.log('=============================================================')
        console.log('==    接口地址：' + url)
        console.log('==    接口参数：' + JSON.stringify(data))
        console.log('==    请求类型：' + method)
        console.log("==    服务器连接异常")
        console.log('=============================================================')
        reject("服务器连接异常，请检查网络再试")
      }
    })
  });
}
//测试地址 
const ApiRootUrl = 'http://192.168.21.40:18080'; 
module.exports = {
  request,
  get,
  post, 
  put,
  del,
  // 登录
  postLogin:ApiRootUrl+'/postLogin',//登录
  // 广播下发
  devicePage:ApiRootUrl+'/cloud/device/page',//设备列表
  broadcast:ApiRootUrl+'/bluetooth/broadcast',//广播播报
  broadcastPageList:ApiRootUrl+'/bluetooth/broadcastPageList',//获取广播下发记录
  getBroadcastDetailByGroupId:ApiRootUrl+'/bluetooth/getBroadcastDetailByGroupId',//获取广播下发记录
  //蓝牙
  compoundPack:ApiRootUrl+'/bluetooth/compoundPack',//获取下发指令内容
  frameParse:ApiRootUrl+'/bluetooth/frameParse',//数据帧解析
}
 