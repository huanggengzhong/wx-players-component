/**
 * @description 刮刮乐游戏逻辑部分
 * @author pfan
 * 
 * 问题：
 * 1.drawImage 与 clearRect 清除展示移动端和模拟器不一致
 * 2.小程序无globalCompositeOperation = 'destination-out'属性
 * 3.小程序无getImageData获取像素点对比擦除范围
 * 4.小程序canvas绘制图片，真机要正常展示需要使用https协议的图片， http或相对路径微信小程序工具可以展示
 * 遗留问题：图片画的问题
 *使用 downloadFile 这种方式来先加载图片再绘制
 *
  * * 调用方式：
 * 
 * 例如：import Scratch from "./utils/scratch.js"
 * 
 * wxml 文件需要引入 scratch.wxml
 * 例如：<import src="utils/scratch.wxml" />
 *      <template is = "scratch" data = "{{scratch, isScroll}}"></template> 
 * 
 * js 中调用
 *   maskColor 和 imageResource 都存在时，优先绘制图片
 *  this.scratch = new Scratch(this, {
 *    canvasWidth: 197,   //画布宽带
 *    canvasHeight: 72,  //画布高度
 *    imageResource: './images/placeholder.png', //画布背景
 *    r: 4, //笔触半径
 *    awardTxt: '中大奖', //底部抽奖文字
 *    awardTxtColor: "#1AAD16", //画布颜色
 *    awardTxtFontSize: "24px", //文字字体大小
 *    maskColor: "red",
 *    callback: () => {
 *      //清除画布回调
 *    }
 *  })
 */


export default class Scratch {
  constructor (pageContext, opts) {
    this.page = pageContext
    this.canvasWidth = opts.canvasWidth
    this.canvasHeight = opts.canvasHeight
    this.imageResource = opts.imageResource
    this.maskColor = opts.maskColor
    // this.canvasId = opts.canvasId
    this.r = opts.r || 4
    this.endCallBack = opts.callback
    this.lastX = 0
    this.lastY = 0
    this.minX = ''
    this.minY = ''
    this.maxX = ''
    this.maxY = ''
    this.isStart = false
    this.init()

    this.page.touchStart = this.touchStart.bind(this)
    this.page.touchMove = this.touchMove.bind(this)
    this.page.touchEnd = this.touchEnd.bind(this)
    this.page.imgOnLoad = this.imgOnLoad.bind(this)
  
  }

  init () {

    var that = this.page;
    this.page.setData({
      scratch: {
        "awardTxt": that.data.awardTxt,
        "awardTxtColor": that.data.awardTxtColor,
        "awardTxtFontSize": that.data.awardTxtFontSize,
        "awardTxtLineHeight": that.data.canvasHeight,
        "width": that.data.canvasWidth,
        "height": that.data.canvasHeight,
        "r": that.data.r,
        "imageResource": that.data.imageResource
      },
      "isScroll": true
    })

    let {canvasWidth, canvasHeight, imageResource, maskColor} = this
    let self = this
    this.ctx = wx.createCanvasContext('scratch')
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight) 
    if(imageResource && imageResource != ''){
      if (imageResource.indexOf("https://")==-1){
          //本地资源
        self.ctx.drawImage(imageResource, 0, 0, canvasWidth, canvasHeight)
        self.ctx.draw()
      }else{
        //网络资源
      wx.downloadFile({
            url: imageResource, 
            success: (res) => {
              self.ctx.drawImage(res.tempFilePath, 0, 0, canvasWidth, canvasHeight)
              self.ctx.draw()
            }
          })   
      }
       
    }else{
      self.ctx.setFillStyle(maskColor)
      self.ctx.fillRect(0, 0, canvasWidth, canvasHeight) 
      self.ctx.draw()   
    }
  }

  drawRect (x, y) {
    let {canvasWidth, canvasHeight, lastX, lastY, minX, minY, maxX, maxY} = this
    var r = this.page.data.r;
    let x1 = x - r > 0 ? x - r : 0
    let y1 = y - r > 0 ? y - r : 0
    if('' != minX){
      this.minX = minX > x1 ? x1 : minX
      this.minY = minY > y1 ? y1 : minY
      this.maxX = maxX > x1 ? maxX : x1
      this.maxY = maxY > y1 ? maxY : y1
    }else{
      this.minX = x1
      this.minY = y1
      this.maxX = x1
      this.maxY = y1
    }
    this.lastX = x1
    this.lastY = y1

    return [x1, y1, 2*r]
  }  

  start () {
    this.isStart = true
    this.page.setData({
      "isScroll": false
    })
  }

  restart () {    
    this.init()
    this.lastX = 0
    this.lastY = 0
    this.minX = ''
    this.minY = ''
    this.maxX = ''
    this.maxY = ''    
    this.isStart = true
   
    this.page.setData({
      "isScroll": false
    })    
  }

  touchStart (e) {
    if(!this.isStart)return
    let pos = this.drawRect(e.touches[0].x, e.touches[0].y)
    this.ctx.clearRect(pos[0] ,pos[1] , pos[2], pos[2]) 
    this.ctx.draw(true)
  }

  touchMove (e) {
    if(!this.isStart)return
    let pos = this.drawRect(e.touches[0].x, e.touches[0].y)
    this.ctx.clearRect(pos[0] ,pos[1] , pos[2], pos[2]) 
    this.ctx.draw(true) 
  }

  touchEnd (e) {
    if(!this.isStart)return
    //自动清楚采用点范围值方式判断
    let {canvasWidth, canvasHeight, minX, minY, maxX, maxY} = this

    if(maxX - minX > .6 * canvasWidth && maxY - minY > .6 * canvasHeight ){
      this.ctx.draw() 
      this.endCallBack && this.endCallBack()
      this.isStart = false
      this.page.setData({
        "isScroll": true
      })      
    }
  } 

  reset () {
    this.init()
  }

  imgOnLoad () {
    
  }   
}

