'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    return this.display();
  }
  commitAction(){
    return this.display('commit')
  }
  detailAction(){
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
    console.log(res) 
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
    .find()
  }
}