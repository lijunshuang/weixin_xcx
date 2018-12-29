## 微信小程序--心情说说

### 项目功能
- 发布心情
- 可以多图上传
- 首页可以下拉刷新
- 图片预览

### 后台--开发环境
- 需要MongoDB 数据库
- Nodejs 模拟接口

#### 安装依赖

```cmd
npm install
```
####运行项目
打开终端，输入以下命令，数据库开机。

```cmd
sudo mongod
```
开启后台（command+T)再打开一个终端，输入以下命令

```cmd
node app.js
```
打开小程序开发者工具，导入项目 即可运行

![image](https://github.com/lijunshuang/images/blob/master/xiaochengxu.gif?raw=true)




---


### 图片预览功能
> wx.previewImage

在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。

示例代码：

``` javascript
wx.previewImage({
  current: '', // 当前显示图片的http链接
  urls: [] // 需要预览的图片http链接列表
})
```

api需要两个参数，分别通过下面的`data-list`和`data-index`来传到js中

wxml代码：

``` javascript
<view class='picList'>
<!-- {{urlApiitem}} -->
  <image mode="aspectFill"
    wx:for="{{list.serverPics}}"
    wx:for-item="item"
    wx:key="id" 
    bindtap="clickImg"
    data-list="{{list.serverPics}}"
    data-index="{{index}}"
    src="{{urlApi}}/{{item}}">
  </image>
</view>
```

js代码：

``` javascript
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
```
1. 给图片添加一个点击事件(clickImg) 

2. `e.currentTarget.dataset.`自定义属性名称来获取data-的值 如`e.currentTarget.dataset.index`  (获取`data-index`的值)

3. 之后将获取的两个值 放到`wx.previewImage`接口 里面即可










