// pages/music/music.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: Object,
    playlistid: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.cloud.callFunction({
      name: 'music',
      data: {
        playlistId: options.playlistId,
        $url: 'musiclist'
      }
    }).then(res => {
      console.log(res)
      const pl = res.result.playlist
      this.setData( {
        musiclist: pl.tracks,
        listInfo: {
          coverImgUrl: pl.coverImgUrl,
          name: pl.name,
          playCount: pl.playCount,
          description: pl.description
        }
      })
      this._setMusiclist()
    })
  },
  _setMusiclist() {
    wx.setStorageSync('musiclist', this.data.musiclist)
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

  },
  //评论点击事件
  comment() {
    console.log('111')
  },
  //分享点击事件
  share() {
    console.log('222')
    // onShareAppMessage: function() {
 
    //   return {
   
    //     title: '自定义分享标题',
   
    //     desc: '自定义分享描述',
   
    //     path: '/page/index?id=123'
   
    //   }
   
    // }
  },
  //下载点击事件
  download() {
    console.log('333')
  },
  //全选点击事件
  multiple() {
    console.log('444')
  },
  showActionSheet() {
    wx.showActionSheet({
      itemList: ['下一首播放', '下载', '收藏到歌单', '分享'],
      success (res) {
        console.log(res.tapIndex)
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '歌单分享',
      desc: '歌单分享',
      path: '/pages/music/music?id=123'
    }
  },
  playclick(e) {
    const musicid = e.currentTarget.dataset.musicid
    const index = e.currentTarget.dataset.index
    console.log(e)
    this.setData({
      playlistid: musicid
    })
    wx.navigateTo({
      url: `../playsone/playsone?musicid=${musicid}&&index=${index}`,
    })
    console.log(playlistid)
  }
})