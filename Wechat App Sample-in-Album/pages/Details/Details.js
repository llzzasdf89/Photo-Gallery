var Detaildatas = require("../Localdatabase/data.js").Local_database
var App = getApp();
Page(


  {
    onLoad: function(option) {
      var detailId = option.id;
      this.data.CurrentdetailId = detailId;
      var Detaildata = Detaildatas[detailId];
      this.setData(Detaildata)



      //假设这个缓存值的存在是以detailsCollected对象的形式存在的即
      /*detailsCollected={
        1:true;
        2:false
        3:
        .....
      }在这个对象中保存着的属性是数字，即对应各篇文章收藏的状态，数字代表文章号值为：true是已经被收藏，false是还未收藏
      */
      var detailCollected = wx.getStorageSync('detailsCollected'); //首先先获取这个缓存值,

      if (detailCollected) { //判断上述这个缓存值是否存在，如果这个缓存是存在的，才能够读取这个缓存的值 若这个缓存不存在，默认值为false，就不会进入这个判断
        var detailCollected = detailCollected[detailId];
        if (detailCollected) {
          this.setData({
            Collected: detailCollected //通过setData将刚刚获取到的缓存值设置成数据
          })
        } //进入了这个判断条件代表这个缓存值确实存在，但因为其是数组所以通过detailId获取当前的文章号的缓存值，并放入collected这个变量保存，这个detailId是由movies页面传入的
      } else { //相反就是这个缓存不存在的情况
        var detailsCollected = {}; //不存在这个缓存就要想法设法给他设置进入缓存，方法就是先定义个空对象
        detailsCollected[detailId] = false; //将当前所读取的这篇文章的缓存值设为默认false
        wx.setStorageSync("detailsCollected", detailsCollected) //setStorage将这个对象设置进缓存


      }
      if (App.Globaldata.GlobalisPlayingmusic && App.Globaldata.GlobalPageID === detailId) {
        this.setData({
          isPlayingMusic: true
        })
      }
      this.MusicMonitor();

    },
    MusicMonitor: function() {
      var that = this
      wx.onBackgroundAudioPlay(function() {
        that.setData({
          isPlayingMusic: true
        })
        App.Globaldata.GlobalisPlayingmusic = true;
        App.Globaldata.GlobalPageID = that.data.CurrentdetailId;
      }) //监听音乐开始
      wx.onBackgroundAudioPause(function() {
        that.setData({
          isPlayingMusic: false
        })
        App.Globaldata.GlobalisPlayingmusic = false;
        App.Globaldata.GlobalPageID = null;
      }) //监听音乐暂停;
      wx.onBackgroundAudioStop(function() {
        that.setData({
          isPlayingMusic: false
        })
        App.Globaldata.GlobalisPlayingmusic = false;
        App.Globaldata.GlobalPageID = null;
      }) //监听音乐暂停;
    },
    onCollectionTap: function(event) {
      var detailsCollected = wx.getStorageSync("detailsCollected");
      var detailCollected = detailsCollected[this.data.CurrentdetailId];
      detailCollected = !detailCollected;
      detailsCollected[this.data.CurrentdetailId] = detailCollected
      wx.setStorageSync("detailsCollected", detailsCollected)
      this.setData({
        Collected: detailCollected
      })
      wx.showToast({
        title: detailCollected ? "收藏成功" : "取消收藏",
        duration: 1000,
        icon: "success"
      })
    },
    onShare(event) {
      var that=this;
      wx.showActionSheet({
        itemList: ["点击右上角转发"],
        itemColor: "#405f80",
        success:function(res){
          
          that.onShareAppMessage()
        }
      })

    },
    onMusicTap(event) {
      var currentDetailId = this.data.CurrentdetailId;
      var detailData = Detaildatas[currentDetailId]
      var isPlayingMusic = this.data.isPlayingMusic
      if (isPlayingMusic) {
        wx.pauseBackgroundAudio();
        this.setData({
          isPlayingMusic: false,
        })
      } else {
        wx.playBackgroundAudio({
          dataUrl: detailData.Music.dataUrl,
          title: detailData.Music.title,
          coverImgUrl: detailData.Music.coverImg
        })
        this.setData({
          isPlayingMusic: true,
        })
      }
    },
    onShareAppMessage:function(event){
      return {
        title: '影集小样',
        path: '/pages/post/post'
      }}
    

  })