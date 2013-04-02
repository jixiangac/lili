/**
 * 学生路由
 */
var jixiang = require('../models/base')
   ,crypto = require('crypto')
   ,config = require('../config')
   ,format = require('../models/utils').format

var index = function(req,res){
  if(req.method == 'GET'){
    jixiang.getOne({_id:req.session.user._id},'users',function(err,doc){
      if(err){
        console.log(err);
      }
      doc.regdate = format.call(new Date(doc.regdate),'yyyy-MM-dd hh:mm:ss');
      doc.logindate = format.call(new Date(doc.logindate),'yyyy-MM-dd hh:mm:ss');
      res.render('./index/user',
      {
        title : config.name+'个人中心'
       ,user :　req.session.user
       ,people : doc
       ,template : 1  
      });     
    });

  }else if(req.method == 'POST'){

  }

}
exports.index = index;