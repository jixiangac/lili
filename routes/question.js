/**
 * 问题路由
 */
var jixiang = require('../models/base');
var crypto = require('crypto');
var config = require('../config');
var utils = require('../models/utils');

exports.index = function(req,res){
  if(req.method =='GET'){
    res.render('./index/question',
    {
       title : config.name +'提问机器人'
      ,user : req.session.user
      ,template : 1
    });
  }else if(req.method == 'POST'){
     if(!req.body.q)return res.json({flg:0,msg:'问题不能为空哦>_<'});
     var q = req.body.q;
     jixiang.get({query:{q:new RegExp(q,'gi'),isAnswer:true}},'qa',function(err,doc){
       if(err)doc=[];
       if(doc.length){
        var num = parseInt(Math.random()*doc.length,10);
        return res.json({flg:2,answers:doc[num]});
       }
       return res.json({flg:0,msg:'抱歉这题我还不会>_<'});
     })
  }

}

exports.ask = function(req,res){
  if(req.method == 'GET'){
    var n = 1;
    var result ={};
    jixiang.get({query:{cat:2},get:{realname:1}},'users',function(err,doc){
       if(err)doc=[];
       result.teacher = doc;
       --n || render();
    });
    function render(){
      var renderData = {
         title : config.name+'提问老师'
        ,user : req.session.user
        ,template : 2
        ,result : result
      }
      res.render('./index/question',renderData);
    }
  }else if(req.method == 'POST'){
    
  }
}

exports.noslove = function(req,res){
  if(req.method == 'GET'){
    var result = {};
    var cat = parseInt(req.query.cat,10) || 1;
    var condition = {
       askuser : req.session.user.username
      ,isAnswer : (cat===1)
    };
    jixiang.count(condition,'qa',function(err,count){
       result.count = count;
       var res = utils.pagenav(req.query.page,count,7);
       if(!res)return res.redirect('404');
       res.condition.query = condition;
       jixiang.get(res.condition,'qa',function(err,doc){
         if(err)doc=[];
         if(cat === 1 && doc.length){
            doc.forEach(function(item,index){
              item.replydate = utils.format.call(new Date(item.replydate),'yyyy-MM-dd hh:mm:ss');
            });
         }
         result.q = doc;
         render(res.pageNum);
       });

    });
    function render(){
      var renderData = {
        title : config.name + '未解决'
       ,user : req.session.user
       ,template : 3
       ,result : result
       ,cat : cat 
      }
      if(arguments.length){
       renderData.pages = arguments[0];
       renderData.pagenav = '/stu/'+req.session.user.username+'/question?cat='+cat+'&';
      }
      res.render('./index/question',renderData);
    }
  }else if(req.method == 'POST'){

  }
}

//老师回答问题
exports.toslove = function(req,res){
  var cat = parseInt(req.query.cat ,10) || 1
     ,result = {};
  if(req.method == 'GET'){
     var condition = {};
    if(cat === 1){
      condition.replyuser = req.session.user.realname;
    }else{
      condition.toteacher = req.session.user.realname;
    }
    condition.isAnswer = (cat === 1);
    jixiang.count(condition,'qa',function(err,count){
      result.count = count;
      var res = utils.pagenav(req.query.page,count,7);
       if(!res)return res.redirect('404');
       res.condition.query = condition;
       jixiang.get(res.condition,'qa',function(err,doc){
         if(err)doc=[];
         if(cat===1 && doc.length){
            doc.forEach(function(item,index){
              item.replydate = utils.format.call(new Date(item.replydate),'yyyy-MM-dd hh:mm:ss');
            }); 
         }
         console.log(doc)
         result.q = doc;
         render(res.pageNum);
       })
    });
    function render(){
      var renderData = {
        title : config.name
       ,user : req.session.user
       ,result : result 
       ,cat : cat
      }
      if(arguments.length){
       renderData.pages = arguments[0];
       renderData.pagenav = '/teach/'+req.session.user.username+'/question?cat='+cat+'&';
      }
      res.render('./index/question_teach',renderData);
    }
  }if(req.method == 'POST'){
     var condition = {};
     condition.query = {
        _id : parseInt(req.body.id,10)
     }
     condition.modify = {
        '$set' : {
           a : req.body.answer
          ,isAnswer : true
          ,replyuser : req.session.user.realname
          ,replydate : new Date()*1
        }
     }
     jixiang.update(condition,'qa',function(err){
       if(err)return res.json({flg: 0,msg: err});
       return res.json({flg:1,msg:'回答成功！'})
     });
  }
}