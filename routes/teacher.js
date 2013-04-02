/**
 * 老师路由
 */
var jixiang = require('../models/base')
   ,crypto = require('crypto')
   ,config = require('../config')
   ,format = require('../models/utils').format;

exports.index = function(req,res){
  if(req.method == 'GET'){
    var n = 1;
    var result = {};
    //公告
    jixiang.get({
      sort:{release_time:-1}
     ,query:{
        release_time :{
          '$lte' : new Date()*1
        },
        last_time : {
          '$gte' : new Date()*1
        }
      }
    },'notice',function(err,doc){
      if(err)doc=[];
      if(doc.length)result.notice = doc[0].content;
      --n || render();
    });
    function render(){
      res.render('./index/teach',
        {
           title: config.name
          ,user : req.session.user
          ,result : result
          ,template : 1
        });      
    }
  }else if(req.method == 'POST'){

  }
}
//老师信息
exports.info = function(req,res){
 jixiang.getOne({_id:req.session.user._id},'users',function(err,doc){
    if(err){
      console.log(err);
    }
    doc.regdate = format.call(new Date(doc.regdate),'yyyy-MM-dd hh:mm:ss');
    doc.logindate = format.call(new Date(doc.logindate),'yyyy-MM-dd hh:mm:ss');
    res.render('./index/teach',
    {
      title : config.name+'个人中心'
     ,user :　req.session.user
     ,people : doc
     ,template : 2  
    });     
  });
}