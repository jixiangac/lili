/**
 * 登入Routes
 */
var crypto = require('crypto')
   ,Utils = require('../models/utils')
   ,config = require('../config')
   ,jixiang = require('../models/base');

var index = function(req,res){
  if(req.method == 'GET'){
    var n = 2;
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
    //友情链接
    jixiang.get({},'links',function(err,doc){
      if(err)doc=[];
      result.links = doc;
      --n || render();
    });

    function render(){
      res.render('./index/index',
        {
           title: config.name
          ,user : req.session.user
          ,result : result
        });      
    }
  }else if(req.method == 'POST'){
    //生成口令散列
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    jixiang.getOne({username:req.body.username},'users',function(err,user){
      if(!user){
        return res.json({flg:0,msg:'用户名或者密码错误！'});
      }
      if(user.password != password){
        return res.json({flg:0,msg:'用户名或者密码错误！'});
      }
      var condition = {};
      condition.query = {
        _id : user._id
      }
      condition.modify={
        '$set' : {
          'logindate' : Date.now()
        }
      };
      jixiang.update(condition,'users',function(err){
        console.log("had logined!");
      });
      req.session.user = user;
      res.json({flg:1,msg:'登入成功!',redirect:'/'});
    });
  }
}

exports.index = index;