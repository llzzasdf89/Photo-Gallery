var app = getApp();
Page({
  data: {
    inTheater: {},
    comingSoon: {},
    top250: {},
    containerShow:true,
    searchPannelShow:false,
    xxShow:false,
    searchResult:{}
  },
  onLoad: function() {
    var inTheaterUrl = app.Globaldata.BaseUrl + "/v2/movie/in_theaters" + "?0start=0&count=3";
    var comingsoonUrl = app.Globaldata.BaseUrl + "/v2/movie/coming_soon" + "?0start=0&count=3";
    var top25url = app.Globaldata.BaseUrl + "/v2/movie/top250" + "?0start=0&count=3";
    this.getUrl(inTheaterUrl, "inTheater", "正在热映");
    this.getUrl(comingsoonUrl, "comingSoon", "即将上映");
    this.getUrl(top25url, "top250", "top250电影");
  },
  onReady:function(){
    this.setNavigation();
  },
  getUrl: function(url, key, catalogue) {
    var that = this;
    wx.request({
      method: "get",
      header: {
        "Content-type": "application/xml"
      },
      url: url,
      success: function(res) {
        //向服务器发送请求的方法wx.request是个异步请求，所以在onLoad里面是无法将用变量储存函数调用返回的数据的，只能够通过success这个回调函数才能处理
        that.ProcessData(res.data, key, catalogue);
      },
      fail: function(error) {
        console.log(error);
      } //fail一般在发起请求失败时才会调用的函数，一般是断网的情况下会发生的问题.注意是在request这个函数调用失败才会出现，如果只是单纯的向网站发起请求失败，是不会调用fail而是success函数的
    })
  },
  ProcessData: function(moviesdata, key, catalogue) {
    var that = this;
    var movies = []; //定义一个数组以存放即将被绑定的数据
    for (var index in moviesdata.subjects) { //for in循环找到服务器中的数据并将所需数据截取后以对象的形式存放进数组movies
      var subject = moviesdata.subjects[index];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "..."
      }
      var temp = {
        stars: that.converToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[key] = {
      movies: movies,
      catalogue: catalogue//catalogue使用于“更多” 旁边的电影页面的文字的数据绑定，如“正在热映”
    };
    this.setData(readyData);
  },
  setNavigation: function() {
    wx.setNavigationBarTitle({
        title: '电影资讯'
      }),
      wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: "#000",

      })
  },
  converToStarsArray: function(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 0; i <= 5; i++) {
      if (i < num) {
        array.push(1);
      } else array.push(0);
    }
    return array;
  },
  onMovieDetail:function(event){
    var catelogue = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: '/pages/movies/moviesDetail/moviesDetail?catelogue=' + catelogue
    })
  },
  onBindfocus:function(){
    this.setData({
      containerShow:false,
      searchPannelShow: true,
      xxShow:true,
      searchResult: {}
    })

  },
  onCancelimgtap:function(){
    this.setData({
      containerShow: true,
      searchPannelShow: false,
      xxShow:false
    })
  },
  onBindChange:function(event){
    var userInput = event.detail.value;
    var searchUrl = app.Globaldata.BaseUrl+"/v2/movie/search?q="+userInput;
    this.getUrl(searchUrl,"searchResult","");

    
  },
  onGoMovieDetail:function(event){
    var movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: '/pages/movieDetailPage/movieDetailPage?movieId=' + movieId
    })
  },
  onShareAppMessage: function (event) {
    return {
      title: '电影资讯',
      path: '/pages/movies/movie'
    }
  }
})