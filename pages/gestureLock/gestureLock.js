import Lock from "./utils/lock.js"

Page({
  data: {

  },

  onLoad () {
    this.lock = new Lock(this, {
      canvasWidth: 300,
      canvasHeight: 300,
      canvasId: 'canvasLock',
      drawColor: '#3985ff'           
    })
  },

  onReady () {
    
  }
  
})


