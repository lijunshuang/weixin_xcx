//index.js
//获取应用实例
const app = getApp();
Page({
  data:{
    // picArr: [],
    result: [],//从服务器请求的数据
    urlApi: app.globalData.urlApi,//获取url地址，从app.js获取
    userInfo: {},//用户信息
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {
    //默认请求数据
    var self = this;
    wx.request({
      url: self.data.urlApi + '/lists',
      success({ data }) {
        var result = data.result;
        var newResult = [];
        for (let i = 0; i < result.length; i++) {
          var dtime = new Date(result[i].time).toJSON();
          var date = new Date(+new Date(dtime) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
          newResult[i] = {
            ...result[i],
            time: date
          }
        }
        self.setData({
          result: newResult
        })
      }
    })
    // 文档摘过来的 判断用户是否授权获取信息-------------------------
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 文档摘过来的-------------------------
  //发布说说
  toSay(){
    // console.log(app.globalData.userInfo)
    wx.navigateTo({
      url: '/pages/say/say',
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    //默认请求数据
    var self = this;
    wx.request({
      url: self.data.urlApi + '/lists',
      success({data}) {
        var result = data.result;
        var newResult = [];
        for(let i = 0; i<result.length;i++){
          var dtime = new Date(result[i].time).toJSON();
          var date = new Date(+new Date(dtime) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
          newResult[i] = {
            ...result[i],
            time: date
          }
        }
        self.setData({
          result: newResult
        })
      }
    })
  },
  //图片点击事件
  clickImg(e){
    const index = e.currentTarget.dataset.index;//获取data-index
    const imgList = e.currentTarget.dataset.list;//获取data-list 
    //由于 imgList 数组中的图片没有远程地址，所以map一下加一下 地址
    const imgArr = imgList.map(item=>this.data.urlApi+'/'+item);
    //图片预览
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
    })
  }
  //用户授权登录
  // bindGetUserInfo(e) {
  //   // console.log(e.detail.userInfo)
  // }
})

