/**
 * @description 老虎机游戏逻辑部分
 * @author pfan
 * 
  * * 调用方式：
 * 
 * 例如：import Machine from "./utils/machine.js"
 *
 *  wxss 文件需要引入 machine.wxss
 * `@import './utils/machine.wxss'`
 * 
 * wxml 文件需要引入 machine.wxml
 * 例如：<import src="utils/machine.wxml" />
 *      <template is = "machine" data="{{...machine}}"></template> 
 * 
 * js 中调用
 * 
 *   this.machine = new Machine(this, {
 *     height: 40,  //单个数字高度
 *     len: 10,     //单个项目数字个数
 *     transY1: 0,
 *     num1: 3,    //结束数字
 *     transY2: 0,
 *     num2: 0,    //结束数字
 *     transY3: 0,
 *     num3: 0,  //结束数字
 *     transY4: 0,
 *     num4: 1,  //结束数字
 *     speed: 24,  //速度
 *     callback: () => {
 *         //停止时回调        
 *     }      
 *   })
 */



export default class Machine {
  constructor (pageContext, opts) {
    this.page = pageContext
    this.height = opts.height
    this.len = opts.len
    this.transY1 = opts.transY1
   
    this.transY2 = opts.transY2
 
    this.transY3 = opts.transY3
 
    this.transY4 = opts.transY4

 
    this.isStart = false
    this.endCallBack = opts.callback
    this.page.start = this.start.bind(this)
  }

  start () {
    let { isStart, len, height, transY1, transY2, transY3, transY4,  endCallBack } = this
    let num1 = this.page.data.num1
    let num2 = this.page.data.num2
    let num3 = this.page.data.num3
    let num4 = this.page.data.num4
    let speed = this.page.data.speed

    if(isStart)return
    this.isStart = true    
    let totalHeight = height * len 
    let sRange = Math.floor(Math.random()*2 + 2)
    let halfSpeed = speed / 2
    let endDis1 = num1 == 0 ? 10 * height : num1 * height
    let endDis2 = num2 == 0 ? 10 * height : num2 * height
    let endDis3 = num3 == 0 ? 10 * height : num3 * height
    let endDis4 = num4 == 0 ? 10 * height : num4 * height
    let i1 = 1, i2 = 1, i3 = 1, i4 = 1

    this.timer = setInterval(() => {
      if(i1 <= sRange){
        transY1 -= speed
        if(Math.abs(transY1) > totalHeight){
          transY1 = transY1 + totalHeight
          i1++
        }
      }else if(i1 > sRange && i1 < sRange + 2){
        transY1 -= halfSpeed
        if(Math.abs(transY1) > totalHeight){
          transY1 = transY1 + totalHeight
          i1++
        }      
      }else{
        if(transY1 == endDis1)return
        let dropSpeed = (endDis1 + transY1) / halfSpeed
        dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < 1 ? 1 : dropSpeed
        transY1 -= dropSpeed
        transY1 =  Math.abs(transY1) > endDis1 ? transY1 = -endDis1: transY1
      }

      this.timer1 = setTimeout( () => {
        if(i2 <= sRange){
          transY2 -= speed
          if(Math.abs(transY2) > totalHeight){
            transY2 = transY2 + totalHeight
            i2++
          }
        }else if(i2 > sRange && i2 < sRange + 2){
          transY2 -= halfSpeed
          if(Math.abs(transY2) > totalHeight){
            transY2 = transY2 + totalHeight
            i2++
          }      
        }else{
          if(transY2 == endDis2)return
          let dropSpeed = (endDis2 + transY2) / halfSpeed
          dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < 1 ? 1 : dropSpeed
          transY2 -= dropSpeed
          transY2 =  Math.abs(transY2) > endDis2 ? transY2 = -endDis2: transY2
        }
      }, 200)

      this.timer2 = setTimeout( () => {
        if(i3 <= sRange){
          transY3 -= speed
          if(Math.abs(transY3) > totalHeight){
            transY3 = transY3 + totalHeight
            i3++
          }
        }else if(i3 > sRange && i3 < sRange + 2){
          transY3 -= halfSpeed
          if(Math.abs(transY3) > totalHeight){
            transY3 = transY3 + totalHeight
            i3++
          }      
        }else{
          if(transY3 == endDis3)return
          let dropSpeed = (endDis3 + transY3) / halfSpeed
          dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < 1 ? 1 : dropSpeed
          transY3 -= dropSpeed
          transY3 =  Math.abs(transY3) > endDis3 ? transY3 = -endDis3: transY3
        }
      }, 400)     

      this.timer3 = setTimeout( () => {
        if(i4 <= sRange){
          transY4 -= speed
          if(Math.abs(transY4) > totalHeight){
            transY4 = transY4 + totalHeight
            i4++
          }
        }else if(i4 > sRange && i4 < sRange + 2){
          transY4 -= halfSpeed
          if(Math.abs(transY4) > totalHeight){
            transY4 = transY4 + totalHeight
            i4++
          }      
        }else{
          let dropSpeed = (endDis4 + transY4) / halfSpeed
          if(num4 < 3){
            dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .1 ? .1 : dropSpeed
          }else if(num4 < 5 && num4 >= 3) {
            dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .3 ? .3 : dropSpeed
          }else{
            dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .3 ? .3 : dropSpeed
          }
          
          transY4 -= dropSpeed
          transY4 =  Math.abs(transY4) > endDis4 ? transY4 = -endDis4: transY4
          if(Math.abs(transY4) >= endDis4){
            clearInterval(this.timer)
            clearTimeout(this.timer1)
            clearTimeout(this.timer2)
            clearTimeout(this.timer3)
            this.isStart = false
            endCallBack && endCallBack()
            return 
          }          
        }
      }, 600)   


      this.page.setData({
        machine: {
          transY1: transY1,
          transY2: transY2,
          transY3: transY3,
          transY4: transY4
        }
      })

    }, 1000/60)   
  }

  reset () {
    this.transY1 = 0 
    this.transY2 = 0 
    this.transY3 = 0 
    this.transY4 = 0 

    this.page.setData({
      machine: {
        transY1: 0,
        transY2: 0,
        transY3: 0,
        transY4: 0
      }
    })    
  }

}

