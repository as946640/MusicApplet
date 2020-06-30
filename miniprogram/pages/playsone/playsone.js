// pages/playsone/playsone.js
let musiclist = []
let nowPlayindex = 0
//获取全局唯一的背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    musiclist = wx.getStorageSync('musiclist')
    nowPlayindex = options.index
    this._loadMusicDetaall(options.musicid)
  },
  _loadMusicDetaall(musicId) {
    backgroundAudioManager.stop()
    let music = musiclist[nowPlayindex]
    console.log(music)
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl'
      }
    }).then( res => {
      console.log(JSON.parse(res.result))
      let result = JSON.parse(res.result)
      backgroundAudioManager.src = result.data[0].url
      backgroundAudioManager.title = music.name
      backgroundAudioManager.coverImgUrl = music.al.picUrl
      backgroundAudioManager.singer = music.ar[0].name
      backgroundAudioManager.epname = music.al.name

      this.setData( {
        isPlaying: true
      })

      wx.hideLoading({})
    })
    wx.setNavigationBarTitle({
      title: music.name
    })
  },
  toggleplay(){
    //正在播放
    if(this.data.isPlaying) {
      backgroundAudioManager.pause()
    }else {
      backgroundAudioManager.play()
    }
    this.setData( {
      isPlaying: !this.data.isPlaying
    })
  },
  //上一首
  onPrev() {
    nowPlayindex --
    if(nowPlayindex <0) {
      nowPlayindex = musiclist.length - 1
    }
    this._loadMusicDetaall(musiclist[nowPlayindex].id)
  },
  //下一首
  onNext() {
    nowPlayindex ++ 
    if(nowPlayindex === musiclist.length) {
      nowPlayindex = 0
    }
    this._loadMusicDetaall(musiclist[nowPlayindex].id)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})