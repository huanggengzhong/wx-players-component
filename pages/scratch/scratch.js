import Scratch from "./utils/scratch.js"

Page({
  data: {
    isStart: true,
    txt: "开始刮奖",
    imageResource: "./images/placeholder.png",
    awardTxt:"", //中间提示文字
    canvasWidth:240, //图片宽度
    canvasHeight:100, //图片高度
    r: 5, //笔触半径
    awardTxtArray: ["未中奖", "一等奖", "未中奖", "二等奖", "未中奖", "三等奖","未中奖"],
    awardTxtColor:"red",
    awardTxtFontSize:"20px",
  }, 

  onLoad () {
    let that = this;
  
    this.scratch = new Scratch(this, {
      canvasWidth: that.data.canvasWidth,
      canvasHeight: that.data.canvasHeight,
      imageResource: that.data.imageResource,
      maskColor: "red",
      r: that.data.r,
      awardTxt: that.data.awardTxt, //中奖提示
      awardTxtColor: that.data.awardTxtColor,
      awardTxtFontSize: that.data.awardTxtFontSize,
      callback: () => {
        var content = that.data.awardTxt;
        content = content == '未中奖' ? "很遗憾您未中奖！" : "恭喜您，获得" + content
    
        wx.showModal({
          title: '提示',
          content: content,
          showCancel: false,
          success: (res) => {
            // this.scratch.reset()
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

  onStart () {
    this.setAwardTxt()
    this.scratch.restart()
    let { isStart } = this.data
    if(isStart){
      this.setData({
        txt: "重新开始",
        isStart: false
      })
    } 
    
  },
  setAwardTxt(){
    //获取中奖数组下标
    let index = Math.floor(Math.random() * 7);
    let awardTxt = this.data.awardTxtArray[index]
    this.setData({
      awardTxt: awardTxt
    })
  },

  awardTxtFontSizeChange(e){
    let awardTxtFontSize = e.detail.value+"px"
      this.setData({ awardTxtFontSize});
  },

 canvasWidthChage(e){
   let canvasWidth = e.detail.value
   this.setData({ canvasWidth });
  },
 canvasHeightChange(e){
   let canvasHeight = e.detail.value
   this.setData({ canvasHeight });
 },
 canvasRChange(e){
   let r = e.detail.value
   this.setData({ r });

 }
  

})