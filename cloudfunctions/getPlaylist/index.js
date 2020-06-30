// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//定义常量
const URL = 'http://musicapi.xiecheng.live/personalized'
const db = cloud.database()
const playlistCollection = db.collection('playlist')

const rq = require('request-promise')
// 云函数入口函数
exports.main = async (event, context) => {
  const list = await playlistCollection.get()
  const playlist = await rq(URL).then(res => {
    return JSON.parse(res).result
  })
  //去重数据操作
  const newData = []
  for(let i =0, len1 = playlist.length; i < len1; i++) {
    let flag = true
    for(let j = 0, len2 = list.data.length; j < len2; j++) {
      if(playlist[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    if(flag) {
      newData.push(playlist[i])
    }
  }
  //插入数据
  for (let i = 0; i < newData.length; i++ ) {
    await playlistCollection.add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then(res => {
      console.log('插入成功')
    }).catch(err => {
      console.log('插入失败')
    })
  }
  return newData.length
}