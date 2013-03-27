/**
 * 问题列表
 */
var config = require('../../config')
   ,Utils  = require('../../models/utils')
   ,jixiang = require('../../models/base');

exports.index = function(req,res){
   var add = parseInt(req.query.add,10) || 0
      ,info = parseInt(req.query.info,10) || 0;

  if(req.method == 'GET'){
    var template = 1;
    var result = {};
    if(add !==0){ //添加问题
      template = 2;
    }else if(info !== 0){//查看&修改问题
      template = 3;
    }
    res.render('./admin/question',{
      title : config.name + '问题管理'
     ,user : req.session.user
     ,template : template
    });
  }if(req.method == 'POST'){

  }
}

exports.cat = function(req,res){
  var cat = parseInt(req.query.cat,10) || 1
     ,add = parseInt(req.query.add,10) || 0
     ,modify = parseInt(req.query.modify,10) || 0
     ,catArray = ['','分类','章节','专题'];

  if(req.method == 'GET'){
    var template = 1;
    if(add !==0){//增加
      template = 2;
      render();
    }else if(modify !== 0){//修改
      template = 3;
      var id = parseInt(req.query.id,10) || 0;
      if(!id)return;
      jixiang.getOne({_id:id},'qcat',function(err,doc){
        if(err)doc=[];
        console.log(doc)
        render(doc);
      });
      return;
    }
    //问题列表
    jixiang.get({
      query :{
        cat : cat
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
      var id = parseInt(req.query.id,10) || 0;
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
    }else{
      var del = parseInt(req.query.del,10) || 0;
      if(del===0)return;
      jixiang.delById(id,'qcat',function(err){
         if(err)return res.json({flg:0,msg:err});
         return res.json({flg:1,msg:'删除成功！'});
      });
    }
  }
}