// pages/say/say.js
const app = getApp();
Page({
  //页面数据
  data:{
    picArr: [],
    content:'',
    urlApi:app.globalData.urlApi
  },
  //改变textarea数据
  changeContent(e){
    // console.log(e.detail.value)
    this.setData({
      content: e.detail.value
    })
  },
  //上传图片
  chooseImg(){
    var self = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        self.setData({
          picArr: tempFilePaths
        })
      }
    })
  },
  //图片点击事件
  clickImg(e) {
    const index = e.currentTarget.dataset.index;//获取data-index
    const imgList = e.currentTarget.dataset.list;//获取data-list 
    // console.log(imgList)
    //图片预览
    wx.previewImage({
      current: imgList[index],     //当前图片地址
      urls: imgList,               //所有要预览的图片的地址集合 数组形式
    })
  },
  //发布
  submit(){
    var picArr = this.data.picArr;
    var content = this.data.content;
    var serverPics = [];
    var nickName = app.globalData.userInfo.nickName; //用户信息
    var avatarUrl = app.globalData.userInfo.avatarUrl;

    var self = this;
    for(let i = 0; i < picArr.length; i++){
      wx.uploadFile({
        url: self.data.urlApi + '/up',
        filePath: picArr[i],
        name: 'file',
        formData:{
          user: 'test'
        },
        success({data}){
          //data是字符串，需要JSON.parse 转为JSON
          const dataObj = JSON.parse(data)
          serverPics[i] = dataObj.result; //等数据都返回后 再发post请求
          // 判断图片是否全部返回，全部返回后 再发送请求
          if (picArr.length == serverPics.length){
            //将用户信息，图片一起打包上传到服务器
            wx.request({
              url: self.data.urlApi +'/saysay', // 仅为示例，并非真实的接口地址
              method: "POST",
              data: {
                nickName,
                avatarUrl,
                content,
                serverPics
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success(res) {
                // console.log(res.data)
                //数据加载完成后 提示信息
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 1000
                })
                //上传完成后 返回上一页
                wx.navigateBack()
              }
            })
          }
        }
      })
    }
  }
})