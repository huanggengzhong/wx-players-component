/**
 * @description 摇一摇组件逻辑部分
 * @author pfan
 * * 调用方式：
 * 
 * 例如：import Shake from "./utils/shake.js"
 * 
 * wxss 文件需要引入 shake.wxss
 * `@import './utils/shake.wxss'`
 * 
 * wxml 文件需要引入 shake.wxml
 * 例如：<import src="utils/shake.wxml" />
 *      <template is = "shake" data="{{anim}}"></template> 
 * 
 * js 中调用
 * 
 *  this.shake = new Shake(this, {
 *    shakeThreshold: 70, //阈值
 *    callback: () => {
 *          
 *    }            
 *  })

 */



export default class Shake {
  constructor (pageContext, opts) {
    this.page = pageContext
    this.shakeThreshold = opts.shakeThreshold || 80
    this.lastX = 0
    this.lastY = 0
    this.lastZ = 0
    this.lastUpdate = 0
    this.isStart = true
    this.endCallBack = opts.callback
    // this.page.start = this.start.bind(this)
    this.page.audioCtx = wx.createAudioContext('shakeAudio')
    this.start()
    
  }

  start () {
    let { isStart, shakeThreshold, lastX, lastY, lastZ, lastUpdate } = this
    wx.onAccelerometerChange((res) => {
      console.log("res is value :", res)
      let curTime = new Date().getTime()
      if ((curTime - lastUpdate) > 100) {
        let curX = res.x
        let curY = res.y
        let curZ = res.z
        let speed = Math.abs(curX + curY + curZ - lastX - lastY - lastZ) / (curTime - lastUpdate) * 10000
        if(speed > shakeThreshold && this.isStart){
          this.page.audioCtx.play()   
          this.update()
        }
        lastUpdate = curTime
        lastX = curX
        lastY = curY
        lastZ = curZ
      }
    })
  }

  update () {
    this.page.setData({
      anim: true
    })
    this.isStart = false
    setTimeout(() => {
      this.page.setData({
        anim: false
      })
      this.endCallBack && this.endCallBack()
    }, 2000)

  }

  reset () {
  
  }

}
