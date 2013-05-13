/**
 * 老师路由
 */
var jixiang = require('../models/base')
   ,crypto = require('crypto')
   ,config = require('../config')
   ,format = require('../models/utils').format;

exports.index = function(req,res){
     console.log(req.session.user)
  if(req.method == 'GET'){
    var n = 3;
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
    //获取被提问数据
    jixiang.get({
      query : {
         toteacher: req.session.user.realname
      },
      get : {
        askdate : 1
      },
      sort : {
        aksdate : -1
      }
    },'qa',function(err,doc){
      if(err)doc = [];
      if(doc.length){
        var list = {};
        var first = new Date(doc[0].askdate);
        var firstDate = format.call(first,'yyyy-MM-dd');
        list[firstDate] = 1;
        doc.forEach(function(item,index){
           var date = new Date(item.askdate);
           if(date.getFullYear() === first.getFullYear() 
                && date.getMonth() === first.getMonth()
                && date.getDate() === first.getDate() ){
             ++list[firstDate];
           }else{
              first = new Date(item.askdate);
              firstDate = format.call(first,'yyyy-MM-dd');
              list[firstDate] = 1;
           }
        });
        result.total = JSON.stringify(list);
      }
      --n || render();
    })
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