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
       var newQ = {
          q : q
         ,isRobot : true
         ,isAnswer : false
         ,askuser : req.session.user.username
       }
       jixiang.save(newQ,'qa',function(err,doc){});
       return res.json({flg:0,msg:'抱歉这题我还不会>_<,但是我帮你记录下来了哦！'});
     })
  }

}

exports.ask = function(req,res){
   var info = parseInt(req.query.info,10) || 0;
   var id = parseInt(req.query.id,10) || 0;
  if(req.method == 'GET'){
    var template = 2;
    var n = 2;
    var result ={};
    if(info !== 0){//修改问题
      template = 5;
      n = 3;
      jixiang.getOne({_id:id},'qa',function(err,doc){
        if(err)doc=[];
        result.qa = doc;
        --n || render();
      });

      jixiang.get({query:{cat:2},get:{realname:1}},'users',function(err,doc){
         if(err)doc=[];
         result.teacher = doc;
         --n || render();
      });

      jixiang.get({},'qcat',function(err,doc){
        if(err)doc=[];
        result.cat = doc;
        --n || render();
      });
      return;
    }
    jixiang.get({query:{cat:2},get:{realname:1}},'users',function(err,doc){
       if(err)doc=[];
       result.teacher = doc;
       --n || render();
    });
    
    jixiang.get({},'qcat',function(err,doc){
       if(err)doc = [];
       result.cat = doc;
       --n || render();
    })
    function render(){
      var renderData = {
         title : config.name+'提问老师'
        ,user : req.session.user
        ,template : template
        ,result : result
      }
      console.log(renderData.result.qa)
      res.render('./index/question',renderData);
    }
  }else if(req.method == 'POST'){
    
  }
}

exports.noslove = function(req,res){
  if(req.method == 'GET'){

    var result = {};
    var qcat = parseInt(req.query.qcat,10) || 1;//问题类别
    result.catCat = parseInt(req.query.cat,10) || null;//题目分类

    var tag = req.query.tag || '';//分类&章节&专题名称

    var condition = {
       askuser : req.session.user.username
      ,isAnswer : (qcat===1)
      ,isRobot : null
    };

    if(result.catCat){
      switch(result.catCat){
        case 1 : 
          condition.catCat = tag;
          break;
        case 2 :
          condition.catChapter = tag;
          break;
        case 3 :
          condition.catTopic = tag;
          break;
      }
    }
    result.search = tag;
    if(req.query.keyword){
      condition.q = new RegExp(req.query.keyword,'gi');
      result.query = req.query.keyword;
    }
    //机器人题目
    if(qcat >= 3 )condition.isRobot = true;
    if(qcat === 4)condition.isAnswer = true; 

    jixiang.count(condition,'qa',function(err,count){
       result.count = count;
       var res = utils.pagenav(req.query.page,count,7);
       if(!res)return res.redirect('404');
       res.condition.query = condition;
       var n = 2;
        jixiang.get({
          query : {
            cat:result.catCat
          }
         ,get : {
            name: 1
         }
        },'qcat',function(err,doc){
          if(err)doc=[];
          result.catTag = doc;
          --n || render(res.pageNum);
        });

       jixiang.get(res.condition,'qa',function(err,doc){
         if(err)doc=[];
         if(qcat === 1 && doc.length){
            doc.forEach(function(item,index){
              item.replydate = utils.format.call(new Date(item.replydate),'yyyy-MM-dd hh:mm:ss');
            });
         }
         result.q = doc;
         --n || render(res.pageNum);
       });

    });
    var qcatname = ['已解决','未解决','机器人','机器人已解决'];
    function render(){
      var renderData = {
        title : config.name + qcatname[qcat-1]
       ,user : req.session.user
       ,template : 3
       ,result : result
       ,qcat : qcat 
      }
      if(arguments.length){
       renderData.pages = arguments[0];
       renderData.pagenav = '/stu/'+req.session.user.username+'/question?qcat='+qcat+'&';
      }
      res.render('./index/question',renderData);
    }
  }else if(req.method == 'POST'){

  }
}

//老师回答问题
exports.toslove = function(req,res){
  var qcat = parseInt(req.query.qcat ,10) || 1
     ,result = {};
  if(req.method == 'GET'){
     var condition = {};
    if(qcat === 1){
      condition.replyuser = req.session.user.realname;
    }else{
      condition.toteacher = req.session.user.realname;
    }

    condition.isAnswer = (qcat === 1);

    result.catCat = parseInt(req.query.cat,10) || null;//题目分类
    if(result.catCat){
      switch(result.catCat){
        case 1 : 
          condition.catCat = tag;
          break;
        case 2 :
          condition.catChapter = tag;
          break;
        case 3 :
          condition.catTopic = tag;
          break;
      }
    }

    var tag = req.query.tag || '';//分类&章节&专题名称
    result.search = tag;

    if(req.query.keyword){
      condition.q = new RegExp(req.query.keyword,'gi');
      result.query = req.query.keyword;
    }    
    jixiang.count(condition,'qa',function(err,count){
      result.count = count;
      var res = utils.pagenav(req.query.page,count,7);
       if(!res)return res.redirect('404');
       res.condition.query = condition;

       var n = 2;
        jixiang.get({
          query : {
            cat:result.catCat
          }
         ,get : {
            name: 1
         }
        },'qcat',function(err,doc){
          if(err)doc=[];
          result.catTag = doc;
          --n || render(res.pageNum);
        });

       jixiang.get(res.condition,'qa',function(err,doc){
         if(err)doc=[];
         if(qcat===1 && doc.length){
            doc.forEach(function(item,index){
              item.replydate = utils.format.call(new Date(item.replydate),'yyyy-MM-dd hh:mm:ss');
            }); 
         }
         result.q = doc;
         --n || render(res.pageNum);
       })
    });
    function render(){
      var renderData = {
        title : config.name
       ,user : req.session.user
       ,result : result 
       ,qcat : qcat
      }
      if(arguments.length){
       renderData.pages = arguments[0];
       renderData.pagenav = '/teach/'+req.session.user.username+'/question?qcat='+qcat+'&';
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
     jixiang.getOne({_id:condition.query._id},'qa',function(err,doc){
       if(err)console.log(err);
       jixiang.getOne({username:doc.askuser},'users',function(err,user){
          if(err)console.log(err);
          var html = '<p><b>你的问题是：'+doc.q+'</b></p>'+
                     '<p><b>'+req.session.user.realname+'的回答是：</b>'+req.body.answer +'</p>'+
                     '<p>'+
                       '<a href="'+config.base+'stu/'+user.username+'/question?cat=1">点击这里查看</a>'+
                     '</p>';
          utils.email(user.email,req.session.user.realname+'回答了你的问题，快来看看吧！',req.body.answer,html);
       })
     });
     jixiang.update(condition,'qa',function(err){
       if(err)return res.json({flg: 0,msg: err});
       return res.json({flg:1,msg:'回答成功！'})
     });
  }
}

//问题中心
exports.center = function(req,res){
  if(req.method === 'GET'){
    var result = {};
    var tag = req.query.tag || '';
    result.catCat = parseInt(req.query.cat,10) || null;
    var query = {};
    if(result.catCat){
      switch(result.catCat){
        case 1 : 
          query.catCat = tag;
          break;
        case 2 :
          query.catChapter = tag;
          break;
        case 3 :
          query.catTopic = tag;
          break;
      }
    }
    result.search = tag;
    if(req.query.keyword){
      query.q = new RegExp(req.query.keyword,'gi');
      result.query = req.query.keyword;
    }
    query.isRobot = null;
    query.isAnswer = true;
    jixiang.count(query,'qa',function(err,count){
      if(err)return res.json({flg:0,msg:err});
      // 分页
      var pages = parseInt(req.query.page,10) || 1;
      var condition = {
         skip : (pages-1)*7
        ,limit : 7
      }
      var pageNum = {
         max : Math.ceil(count/7) ? Math.ceil(count/7) : 1
        ,cur : pages
        ,next : pages+1
        ,prev : pages-1
      }
      condition.query = query;
      if(pageNum.cur > pageNum.max)return;

      var n = 2;
      jixiang.get({
        query : {
          cat:result.catCat
        }
       ,get : {
          name: 1
       }
      },'qcat',function(err,doc){
        if(err)doc=[];
        result.catTag = doc;
        --n || render(pageNum);
      });
      jixiang.get(condition,'qa',function(err,doc){
        if(err)doc=[];
        result.qa = doc;
        --n || render(pageNum);
      });

    });
    
    function render(){
      var renderData = {
        title : config.name + '问题中心'
       ,user : req.session.user
       ,template : 4
       ,result : result
      }
      if(arguments.length){
       renderData.pages = arguments[0];
       renderData.pagenav = '/q/center?';
      }
      res.render('./index/question',renderData);      
    }

  }else if(req.method === 'POST'){

  }
}