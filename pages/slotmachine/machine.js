import Machine from "./utils/machine.js"

Page({
  data: {
    num1:0,
    num2: 0,
    num3: 0,
    num4: 0,
    speed:24
  },

  onLoad () {
    let that = this;
    this.machine = new Machine(this, {
      height: 40,  //单个数字高度
      len: 10,     
      transY1: 0,
      num1: that.data.num1,
      transY2: 0,
      num2: that.data.num2,
      transY3: 0,
      num3: that.data.num3,
      transY4: 0,
      num4: that.data.num4,
      speed: that.data.speed,
      callback: () => {
        wx.showModal({
          title: '提示',
          content: '恭喜您，中奖了',
          showCancel: false,
          success: (res) =>  {
            // this.machine.reset()
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
  
  },

  onStart () {
    this.machine.start()
  },
  numChage(e){
    let value = e.detail.value;
    let num = e.target.dataset.num
     if(num==1){
       this.setData({num1:value})
     }else if(num==2){
       this.setData({ num2: value })
     } else if (num == 3) {
       this.setData({ num3: value })
     } else if (num == 4) {
       this.setData({ num4: value })
     }
  },
  speedChange(e){
    let speed = e.detail.value;
    this.setData({speed});
  }

})