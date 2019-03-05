var post = require("../Localdatabase/data.js").Local_database;
Page({
  onLoad:function(){
  },
  onReady:function(){
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#000",

    }),
      wx.setNavigationBarTitle({
        title: '影集小样'
      })
  },
  data: {
    post
  },
  GoDetail: function(event) {

    var post_id = event.currentTarget.dataset.detailnum
    wx.navigateTo({
      url: "../Details/Details?id=" + post_id
    })
  },
  onNavigation: function(event) {

    var postid = event.target.dataset.detailnum;
    wx.navigateTo({
      url: "../Details/Details?id=" + postid
    })
   
  },
  onShareAppMessage: function (event) {
    return {
      title: '影集小样',
      path: '/pages/post/post'
    }
  }
})