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
    if(req.session.user.cat === 2){
      return res.redirect('/teach');
    }else if(req.session.user.cat === 3){
      return res.redirect('/admin');
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
      if(doc.length){
        var list = {};
        var first = new Date(doc[0].askdate);
        var firstDate = utils.format.call(first,'yyyy-MM-dd');
        list[firstDate] = 0;
        doc.forEach(function(item,index){
           var date = new Date(item.askdate);
           if(date.getFullYear() === first.getFullYear() 
                && date.getMonth() === first.getMonth()
                && date.getDate() === first.getDate() ){
               list[firstDate]++;
             console.log('after')
             console.log(list[firstDate])
           }else{
              first = new Date(item.askdate);
              firstDate = utils.format.call(first,'yyyy-MM-dd');
              list[firstDate] = 1;
           }
        });
        result.total = JSON.stringify(list);
      }
      --n || render();
    });
    function render(){
      var renderData = {
          title : config.name
         ,user : req.session.user
         ,result : result
      }
      res.render('./index/index',renderData);      
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

//测试
exports.test = function(req,res){
   // var jixiang1 = new jixiang();
  if(req.method == 'GET'){
    res.render('./index/test',{
      title : '测试'
     ,user : req.session.user
    });
  }else if(req.method == 'POST'){
    
  }
}