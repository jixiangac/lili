/**
 * 问题路由
 */
var jixiang = require('../models/base');
var crypto = require('crypto');
var config = require('../config');

exports.index = function(req,res){
  if(req.method =='GET'){
    res.render('./index/question',
    {
       title : config.name +'提问机器人'
      ,user : req.session.user
    });
  }else if(req.method == 'POST'){
     if(!req.body.q)return res.json({flg:0,msg:'问题不能为空哦>_<'});
     var q = req.body.q;
     jixiang.get({query:{q:new RegExp(q,'gi')}},'qa',function(err,doc){
       if(err)doc=[];
       if(doc.length){
        var num = parseInt(Math.random()*doc.length,10);
        return res.json({flg:2,answers:doc[num]});
       }
       return res.json({flg:0,msg:'抱歉这题我还不会>_<'});
     })
  }

}