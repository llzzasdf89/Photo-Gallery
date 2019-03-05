Page({
  navigation: function() {
    wx.switchTab({
      url: "../post/post",
    })
    wx.setNavigationBarTitle({
      title: '影集小样'
    })
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#000",
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  }
})