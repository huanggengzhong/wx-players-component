/**
 * @description 大转盘游戏逻辑部分
 * @author pfan
 * 
 * 问题：
 * 移动端真机，不支持requestAnimationFrame
 *
 * * 调用方式：
 * 
 * 例如：import Dial from "./utils/dial.js"
 * 
 *  wxss 文件需要引入 dial.wxss
 * `@import './utils/dial.wxss'`
 * 
 * wxml 文件需要引入 dial.wxml
 * 例如：<import src="utils/dial.wxml" />
 *      <template is = "dial" data="{{...dial}}"></template> 
 * 
 * js 中调用
 * 
 *  let dial = new Dial(this, {
 *    areaNumber: 8,   //抽奖间隔
 *    speed: 16,       //转动速度
 *    awardNumer: 2,    //中奖区域从1开始
 *    mode: 1,    //1是指针旋转，2为转盘旋转
 *    callback: () => {
 *      //运动停止回调  
 *    }
 *  })
 */

export default class Dial {
  constructor (pageContext, opts) {
    this.page = pageContext
    this.deg = 0 
    this.areaNumber = opts.areaNumber  // 奖区数量
    this.speed = opts.speed || 16   // 每帧速度
    this.awardNumer = opts.awardNumer //中奖区域 从1开始
    this.mode = opts.mode || 2
    this.singleAngle = ''   //每片扇形的角度
    this.isStart = false
    this.endCallBack = opts.callback


    this.init()

    this.page.start = this.start.bind(this)
  }

  init () {
    let {areaNumber, singleAngle, mode,speed} = this
    singleAngle = 360 / areaNumber
    this.singleAngle = singleAngle
    this.page.setData({
      dial: {
        singleAngle: singleAngle,
        mode: mode,
        areaNumber: areaNumber,
        speed: speed
      }
    })
  }

  start () {
    let { deg, awardNumer, singleAngle, speed, isStart, mode, areaNumber} = this
    if(isStart)return
    this.isStart = true
    let endAddAngle = (awardNumer - 1) * singleAngle + singleAngle/2 + 360   //中奖角度
    let rangeAngle = (Math.floor(Math.random() * 4) + 4) * 360 // 随机旋转几圈再停止  
     

    let cAngle
    deg = 0
    this.timer = setInterval( () => {
      if( deg < rangeAngle ){
        deg += speed
      }else{
        cAngle = (endAddAngle + rangeAngle - deg) / speed
        cAngle = cAngle > speed ? speed : cAngle < 1 ? 1 : cAngle
        deg += cAngle

        if(deg >= ( endAddAngle + rangeAngle )){
          deg = endAddAngle + rangeAngle
          this.isStart = false
          clearInterval(this.timer)
          this.endCallBack()         
        }
      }
      
      this.page.setData({
        dial: {
          singleAngle: singleAngle,
          deg: deg,
          speed: speed,
          areaNumber: areaNumber,
          mode: mode
        }
      })
    }, 1000/60)      
  }

  reset () {
    let { mode, areaNumber,speed} = this
    this.deg = 0
    this.page.setData({
      dial: {
        singleAngle: this.singleAngle,
        deg: 0,
        mode: mode,
        areaNumber: areaNumber,
        speed: speed
      }
    })    
  }

  switch (mode) {
    this.mode = mode
  }

  sliderSpeedChange(speed) {
    let { mode, areaNumber } = this
    this.speed = speed
    this.setDialData(mode, areaNumber, speed);
  }

  sliderAreaNumChange(areaNumber) {
    this.areaNumber = areaNumber
    let { mode, speed } = this
    this.setDialData(mode, areaNumber, speed);
  }

  setDialData( mode, areaNumber, speed){
    this.page.setData({
      dial: {
        singleAngle: this.singleAngle,
        deg: 0,
        mode: mode,
        areaNumber: areaNumber,
        speed: speed
      }
    })    

  }

}

