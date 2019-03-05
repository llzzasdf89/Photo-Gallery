var app=getApp();
Page({

  data: {

  },

  onLoad: function (options) {
    var movieId = options.movieId;
    var url = app.Globaldata.BaseUrl+"/v2/movie/subject/"+movieId;
    this.getUrl(url)
  },
  getUrl: function (url) {
    var that = this;
    wx.request({
      method: "get",
      header: {
        "Content-type": "application/xml"
      },
      url: url,
      success: function (res) {
        //向服务器发送请求的方法wx.request是个异步请求，所以在onLoad里面是无法将用变量储存函数调用返回的数据的，只能够通过success这个回调函数才能处理
        that.ProcessData(res.data);
      },
      fail: function (error) {
        console.log(error);
      } //fail一般在发起请求失败时才会调用的函数，一般是断网的情况下会发生的问题.注意是在request这个函数调用失败才会出现，如果只是单纯的向网站发起请求失败，是不会调用fail而是success函数的
    })
  },
  ProcessData:function(data){
    if(!data){
      return 
    }
    var that=this
    var director={
      avatar:"",
      name:"",
      id:""
    }
    if(data.directors[0]!=null){
      if(data.directors[0].avatars!=null){
        director.avatar=data.directors[0].avatars.large
      }
      director.name=data.directors[0].name;
      director.id=data.directors[0].id;
    }//探空，处理数据中的空值，其中探空的属性一般是二级属性，例如说返回的一个对象或者说是一个数组
    var movie={
      movieImg:data.images?data.images.large:"",
      country:data.countries[0],
      titile:data.title,
      originalTitle:data.original_title,
      wishCount:data.wish_count,
      commentCount:data.comments_count,
      year:data.year,
      generes:data.genres.join("、"),
      stars: that.convertToStarsArray(data.rating.stars),
      score:data.rating.average,
      director:director,
      casts:that.convertToCastString(data.casts),
      castsInfo:that.convertToCastInfos(data.casts),
      summary:data.summary
    }
    this.setData({
      movie:movie
    })
  },
  convertToStarsArray: function (stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 0; i <= 5; i++) {
      if (i < num) {
        array.push(1);
      } else array.push(0);
    }
    return array;
  },//处理评分的函数
  convertToCastString:function(casts){
    var castjoin="";
    for (var idx in casts){
      castjoin=castjoin+casts[idx].name+"/";
    }
    return castjoin.substring(0,castjoin.length-2)
  },//处理演员的函数
  convertToCastInfos:function(casts){
    var castsArray=[];
    for(var idx in casts){
      var cast={
        img:casts[idx].avatars?casts[idx].avatars.large:"",
        name:casts[idx].name
      }
      castsArray.push(cast);
    }
    return castsArray;
  }//处理影人的函数
})