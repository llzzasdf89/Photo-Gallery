var app=getApp();
Page({
  data:{
    requestUrl:"",
    totalCount:0,
    isEmpty:true
  },
onLoad:function(options){
  var catalogue = options.catelogue;
  var inTheaterUrl = app.Globaldata.BaseUrl + "/v2/movie/in_theaters" ;
  var comingsoonUrl = app.Globaldata.BaseUrl + "/v2/movie/coming_soon" ;
  var top25url = app.Globaldata.BaseUrl + "/v2/movie/top250" ;
  var dataUrl;
  this.setData({
    navigationTitle:catalogue
  })
  switch(catalogue){
    case "正在热映": dataUrl=app.Globaldata.BaseUrl + "/v2/movie/in_theaters";
    break;
    case "即将上映": dataUrl =app.Globaldata.BaseUrl + "/v2/movie/coming_soon";
    break;
    case "top250电影": dataUrl = app.Globaldata.BaseUrl + "/v2/movie/top250";
    break;
  }
  this.getUrl(dataUrl);
  this.data.requestUrl = dataUrl;


},
onReady:function(options){
  wx.setNavigationBarTitle({
    title: this.data.navigationTitle
  })
}
,
getUrl:function(url){
  var that=this;
  wx.request({
    url: url,
    header:{"Content-type":"application/xml"},
    method:"get",
    success:function(res){
      that.ProcessData(res.data);
    }
  })
  },
  ProcessData: function (moviesdata) {
    var that=this;
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
      var totalMovies={};
      //如果要绑定新加载数据，那么需要将旧的数据与其捆绑在一起
      if(!this.data.isEmpty){
        totalMovies=this.data.movies.concat(movies);
      }
      else{
        totalMovies=movies;
        this.data.isEmpty=false;
      };//小程序没有dom节点，不像jquery能够用appendTo将每次获取的数据给附加到之前的数据之后，只能通过数据绑定的方式，将之前的数据数组与每次刷新时请求的新的数据数组连接在一起后再一道绑定到data中
  //每次请求并处理完数据以后都再向页面多索取20条数据，以备用户下拉菜单时调用
    this.setData({
      movies: totalMovies
    });
    wx.hideNavigationBarLoading();//每次数据处理完说明导航栏的加载结束了
    wx.stopPullDownRefresh();//每次数据处理完就说明处理过数据，也就是重新加载也结束了
    this.data.totalCount += 20;
  },
  converToStarsArray: function (stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 0; i <= 5; i++) {
      if (i < num) {
        array.push(1);
      } else array.push(0);
    }
    return array;
  },
  onMovieDetail: function (event) {
    var catelogue = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: '/pages/movies/moviesDetail/moviesDetail?catelogue=' + catelogue
    })
  },
  onScrollLower:function(){
    var nextUrl = this.data.requestUrl+"?start="+this.data.totalCount+"&count=20";
    this.getUrl(nextUrl);
    wx.showNavigationBarLoading()
  },
  onPullDownRefersh:function(){
    var refreshUrl=this.data.requestUrl+"?start=0&count=20";
    this.data.movies={};
    this.data.isEmpty=false;//每次刷新的时候要保证isEmpty的状态清空，否则会走入下拉获取更多的数据列表的分支
    this.data.totalCount=0;
    this.getUrl(refreshUrl);
    wx.showNavigationBarLoading();
  },
  onGoMovieDetail:function(event){
    var movieId=event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '/pages/movieDetailPage/movieDetailPage?movieId='+movieId,
    })
  }
})
