'use strict';

import Base from './base.js';
import crypto from 'crypto'

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  hash (str, type) {
    let hashObj = crypto.createHash(type)
    hashObj.update(str)
    return hashObj.digest('hex')
  }
  makeStr () {
    let sStr = 'abcdefghijklmnopqistuvwxyz0123456789ABCDEFGHIGKLMNOPQISTUVWXYZ'
    let rStr = ''
    for (let i = 0; i < 16; i++) {
      rStr += sStr[this.selectFrom(0,61)]
    }
    return rStr
  }
  selectFrom (lower, upper) {
    let choices = upper - lower + 1
    return Math.floor(Math.random() * choices + lower)
  }
  getData (openid, code) {
    const token = 'gh_68f0a1ffc303'
    const timeStamp = Math.floor(new Date().getTime()).toString()
    const str = this.makeStr()
    const secret = this.hash(this.hash(timeStamp, 'sha1') + this.hash(str, 'md5') + 'redrock', 'sha1')
    const data = {
        "timestamp": timeStamp,
        "string": str,
        "secret": secret,
        "token": token,
    }
    if (code) {
      data.code = code
    } else if (openid) {
      data.openid = openid
    }
    return data
  }
  async getJsSdk () {
    const URL = 'http://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/Api/Api/apiJsTicket'
    const DATA = this.getData()
    try {
      let RES_INF = await this.requestPost(URL, DATA)
      RES_INF.timeStamp = DATA.timestamp
      RES_INF.str = DATA.string
      RES_INF.appid = "wx81a4a4b77ec98ff4"
      RES_INF.signature = this.hash(`jsapi_ticket=${RES_INF.data}&noncestr=${RES_INF.str}&timestamp=${RES_INF.timeStamp}&url=${'http://' + 'hongyan.cqupt.edu.cn' + this.http.req.url}`, 'sha1')
      return RES_INF
    } catch (e) { 
      return false
    }
  }
  async indexAction(){
    let data = await this.getJsSdk()
    console.log(data)
    this.assign('conf', data)
    return this.display();
  }
  async commitAction(){
    return this.display('commit')
  }
  async detailAction(){
    return this.display('detail')
  }
  async hahaAction(){
    let info = this.post('info')
    if(!info)
      return this.json({
        status: 400,
        message: "参数不足"
      })
    let res = await this.check(JSON.parse(info))
    if(res.length)
      return this
      .json({
        status: 300,
        message: "已经报过名了"
      })
    let row = await this
    .model('ifo')
    .add(JSON.parse(info))
    return this.json({
      status: 200,
      message: '成功'
    })
  }
  async check(info){
    return await this
    .model('ifo')
    .where({
      stunum: info.stunum
    })
    .select()
  }
}