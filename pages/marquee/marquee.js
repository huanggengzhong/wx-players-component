import Marquee from "./utils/marquee.js"

Page({
  data: {
    speed:100,
    ret:1, //取值1～8 或者其他大于0的数字，取模之后的值 (ret%8)
  },

  onLoad () {
    let that =this
    this.marquee = new Marquee(this, {
      ret: that.data.ret, 
      speed: that.data.speed,
      callback: () => {
        wx.showModal({
          title: '提示',
          content: '恭喜您，中奖了',
          showCancel: false,
          success: (res) => {
            // this.marquee.reset()
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })        
      }            
    })
  },

  onReady () {
    console.log("onReady")    
  },

  retChange(e){
    let ret = e.detail.value;
    this.setData({ret})
  },

  speedChange(e) {
    let speed = e.detail.value;
    this.setData({ speed })
  }


})