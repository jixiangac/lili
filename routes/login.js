/**
 * 登入Routes
 */
var crypto = require('crypto')
   ,utils = require('../models/utils')
   ,config = require('../config')
   ,jixiang = require('../models/base');

var index = function(req,res){
  if(req.method == 'GET'){
    var n = 3;
    var result = {};
    if(!req.session.user){//没登入跳入登入页面
       render();
       return;
    }
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
    //提问数据
    jixiang.get({
      query:{
        askuser:req.session.user.username
      },
      get : {
        askdate : 1
      },
      sort : {
        askdate : -1
      }
    },'qa',function(err,doc){
      if(err)doc=[];
      var list = new Object();
      // var df = new Object();
      if(doc.length){
        var start = doc[0].askdate;
        var num = 0;
        for(var i=0;i<doc.length;i++){
          if(doc[i].askdate <= start && doc[i].askdate >(start-36000) ){
             ++num;
          }else{
            list[start] = num;
            num = 1;
            if(i === doc.length-1){
               list[doc[i].askdate] = num;
            }else{
              start = doc[i].askdate;
            }
          }
        }
        for(var key in list){
           var s= utils.format.call(new Date(parseInt(key,10)),'yyyy-MM-dd hh:mm:ss');
           console.log(s)
        }
        console.log(list)
      }
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
    var cat = parseInt(req.body.cat,10) || 1;
    jixiang.getOne({username:req.body.username,cat : cat},'users',function(err,user){
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
      var redirect = '/';
      if(cat === 2){
         redirect = '/teach'; 
      }else if(cat === 3){
         redirect = '/admin'
      }
      res.json({flg:1,msg:'登入成功!',redirect:redirect});
    });
  }
}

exports.index = index;