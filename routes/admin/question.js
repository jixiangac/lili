/**
 * 问题列表
 */
var config = require('../../config')
   ,utils  = require('../../models/utils')
   ,jixiang = require('../../models/base');

exports.index = function(req,res){
   var add = parseInt(req.query.add,10) || 0
      ,info = parseInt(req.query.info,10) || 0;
   var id = parseInt(req.query.id,10) || 0;
  if(req.method == 'GET'){
    var template = 1;
    var result = {};
    if(add !==0){ //添加问题
      template = 2;
      jixiang.get({},'qcat',function(err,doc){
         if(err)doc=[];
         result.cat = doc;
         render();
      });
      return;
    }else if(info !== 0){//查看&修改问题
      template = 3;
      var n = 2;
      jixiang.getOne({_id:id},'qa',function(err,doc){
        if(err)doc=[];
        result.qa = doc;
        --n || render();
      })
      jixiang.get({},'qcat',function(err,doc){
        if(err)doc=[];
        result.cat = doc;
        --n || render();
      });
      return;
    }
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
    }
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
      })
      jixiang.get(condition,'qa',function(err,doc){
        if(err)doc=[];
        result.qa = doc;
        --n || render(pageNum);
      });

    });

    function render(){
      var renderData = {
        title : config.name + '问题管理'
       ,user : req.session.user
       ,template : template
       ,result : result
      }
      if(arguments.length){
       renderData.pages = arguments[0];
       renderData.pagenav = '/admin/question?';
      }
      res.render('./admin/question',renderData);      
    }
  }if(req.method == 'POST'){
    if(!!req.query.del){
      jixiang.delById(id,'qa',function(err){
         if(err)return res.json({flg:0,msg:err});
         return res.json({flg:1,msg:'删除成功！'});
      });
      return;      
    }
    var qdata = {
      q : req.body.question.trim()
     ,catCat : req.body.catCat || ''
     ,catChapter : req.body.catChapter || ''
     ,catTopic : req.body.catTopic || ''
    }
    var msg = '增加成功！',redirect = '/admin/question';
    if(req.body.answer){
      qdata.a = req.body.answer.trim();
      qdata.isAnswer = true;
    }else{
      qdata.isAnswer = false;
    }
    if(req.body.toteacher){
      qdata.toteacher = req.body.toteacher;
      if(typeof req.body.toteacher === 'string'){
         jixiang.getOne({realname:req.body.toteacher},'users',function(err,doc){
             if(err)console.log(err);
             utils.email(doc.email,req.session.user.username+'向您提了一个问题！',qdata.q,'<p>'+qdata.q+'<a href="'+config.base+'teach/'+doc.username+'/question?cat=2">点击去回答这个问题</p>')
         })
      }else if(typeof req.body.toteacher === 'object'){
         req.body.toteacher.forEach(function(item,index){
            jixiang.getOne({realname:item},'users',function(err,doc){
              if(err)console.log(err);
              utils.email(doc.email,req.session.user.username+'向您提了一个问题！',qdata.q,'<p>'+qdata.q+'<a href="'+config.base+'teach/'+doc.username+'/question?cat=2">点击去回答这个问题</p>')
            })
         })
      }
      qdata.askuser = req.session.user.username;
      qdata.askdate = new Date()*1;
      msg = '问题提交成功，请耐心等待老师回复！';
      redirect = '/q/teacher';
    }
    if(add !==0){ //增加问题
      jixiang.save(qdata,'qa',function(err,doc){
        if(err)return res.json({flg:0,msg:err});
        return res.json({flg:1,msg:msg,redirect:redirect});
      });
    }else if(info !==0){
      console.log(qdata)
      if(!id)return;
      jixiang.update({
        query : {
          _id : id
        },
        modify : qdata
      },'qa',function(err){
         if(err)return res.json({flg:0,msg:err});
         return res.json({flg:1,msg:'修改成功'});
      });      
    }
  }
}

exports.cat = function(req,res){
  var cat = parseInt(req.query.cat,10) || 1
     ,add = parseInt(req.query.add,10) || 0
     ,modify = parseInt(req.query.modify,10) || 0
     ,catArray = ['','分类','章节','专题'];
  var id = parseInt(req.query.id,10) || 0;
  if(req.method == 'GET'){
    var template = 1;
    if(add !==0){//增加
      template = 2;
      render();
    }else if(modify !== 0){//修改
      template = 3;
      if(!id)return;
      jixiang.getOne({_id:id},'qcat',function(err,doc){
        if(err)doc=[];
        render(doc);
      });
      return;
    }
    //问题列表
    jixiang.get({
      query :{
        cat : cat
       ,isRobot : null
      }
    },'qcat',function(err,doc){
      if(err)doc=[];
      render(doc);
    });
    function render(){
      var renderData = {
        title : config.name + '问题管理'
       ,user : req.session.user
       ,template : template
       ,cat : cat
       ,catName : catArray[cat]
      }
      if(arguments.length)renderData.doc = arguments[0];
      res.render('./admin/qcat',renderData);       
    }
 
  }else if(req.method =='POST'){
    if(!!req.query.del){
      jixiang.delById(id,'qcat',function(err){
         if(err)return res.json({flg:0,msg:err});
         return res.json({flg:1,msg:'删除成功！'});
      });
      return;      
    }
    var catData = {
       cat : cat
      ,name : req.body.catname.trim()
      ,description : req.body.description.trim()
    }
    if(add !==0){//增加类别
      jixiang.save(catData,'qcat',function(err,doc){
        if(err)return res.json({flg:0,msg:err});
        return res.json({flg:1,msg:'新增成功！',redirect:'/admin/question/cat?cat='+cat});
      });
    }else if(modify !==0){//修改
      if(!id)return;
      jixiang.update({
        query : {
          _id : id
        },
        modify : catData
      },'qcat',function(err){
         if(err)return res.json({flg:0,msg:err});
         return res.json({flg:1,msg:'修改成功'});
      });
    }
  }
}

exports.getCat = function(req,res){
  if(req.method === 'GET'){
    var cat = parseInt(req.query.cat,10) || null;
    jixiang.get({
      query : {
        cat : cat
      }
      ,get : {
        name : 1
      }
    },'qcat',function(err,doc){
       if(err)doc=[];
       return res.json({success: true,list:doc})
    })
  }else if(req.method === 'POST'){
    
  }
}