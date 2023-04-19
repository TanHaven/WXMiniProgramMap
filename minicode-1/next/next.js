Page({
  onLoad() {
    
  },

  enable() {
    wx.enableAlertBeforeUnload({
      message: 'Are you sure you want to leave?',
      success(res) {
        console.log('success:', res)
      },
      fail(res) {
        console.log('fail:', res)
      },
      complete(res) {
        console.log('complete:', res)
      }
    })
  },

  disable() {
    wx.disableAlertBeforeUnload({
      success(res) {
        console.log('success:', res)
      },
      fail(res) {
        console.log('fail:', res)
      },
      complete(res) {
        console.log('complete:', res)
      }
    })
  }
})