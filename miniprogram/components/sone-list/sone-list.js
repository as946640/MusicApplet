// components/sone-list/sone-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotomusic (e) {
     let i = e.currentTarget.dataset.index
      wx.navigateTo({
        url: `../../pages/music/music?playlistId=${this.data.playlist[i].id}`
      })
    }
  }
})
