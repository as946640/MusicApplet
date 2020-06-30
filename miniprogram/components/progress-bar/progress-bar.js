// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currensec = -1
let duration = 0
let isMoving = false

Component({
  /**
   * 组件的属性列表
   */
  properties: {
  
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totaTime: '00:00'
    },
    movableDis:0,
    progress:0
  },
  //生命周期函数
  lifetimes: {
    //组件渲染完成的时候
    ready() {
      this._getMoveableDis()
      this._bindBGMEvent()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      console.log(event)
      if(event.detail.source == "touch") {
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        this.data.movableDis = event.detail.x
        isMoving = true
      }
    },
    ouchEnd() {
      const currentTimeFmt = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime'] : `${currentTimeFmt.min}:${currentTimeFmt.sec}`
      })
      backgroundAudioManager.seek(duration * this.data.progress / 100)
      isMoving = false
    },
    _getMoveableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable_area').boundingClientRect()
      query.select('.movable_view').boundingClientRect()
      query.exec( rect => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },
    _bindBGMEvent() {
      //播放的时候
      backgroundAudioManager.onPlay(() => {
        
      })
      //停止播放
      backgroundAudioManager.onStop(() => {
  
      }) 
      //暂停播放的时候
      backgroundAudioManager.onPause( () => {
  
      })
      //音频加载当中
      backgroundAudioManager.onWaiting(() => {
  
      })
      //能过可以播放的时候
      backgroundAudioManager.onCanplay((sec) => {
        if(typeof backgroundAudioManager.duration != undefined) {
          this._setTime(sec)
        }else {
          setTimeout(() => {
            this._setTime(sec)
          }, 1000);
        }
        isMoving = true
      })
      //音乐播放的进度
      backgroundAudioManager.onTimeUpdate(() => {
        if(isMoving) {
          const currentTime = backgroundAudioManager.currentTime
          const duration = backgroundAudioManager.duration
          const sec = currentTime.toString().split('.')[0]
          if(sec != currensec) {
            const currentTimeFmt = this._dateFormat(currentTime)
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
            })
            currensec = sec
          }
        }
      })
      //播放完成以后
      backgroundAudioManager.onEnded(() => {
        this.triggerEvent('misicEnd')
      })
      //播放出现错误的时候
      backgroundAudioManager.onError(() => {})
    },
    _setTime() {
      duration = backgroundAudioManager.duration
      console.log(duration)
      const durationFmt = this._dateFormat(duration)
      console.log (durationFmt)
      this.setData({
        ['showTime.totaTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
    },
    //格式化时间
    _dateFormat(sec) {
      const min =Math.floor( sec / 60)
      sec = Math.floor(sec %  60)
      return {
        'min' : this._parse0(min),
        'sec' : this._parse0(sec)
      }
    },
    //补零方法
    _parse0(sec) {
      return sec < 10 ? '0' + sec: sec
    }
  },
  

})
