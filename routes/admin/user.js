/**
 *  用户列表
 */
var config = require('../../config')
   ,Utils  = require('../../models/utils')
   ,jixiang = require('../../models/base');
var crypto = require('crypto');
//列表
exports.index = function(req,res){
   var cat = parseInt(req.query.cat,10) || 1;
   if(req.method == 'GET'){
    jixiang.count({cat:cat},'users',function(err,count){
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
      if(pageNum.cur > pageNum.max)return;

     condition.query = {cat:cat};
     jixiang.get(condition,'users',function(err,people){
      if(err){
        people=[];
      }else{
        people.forEach(function(item,index){
           switch(item.sex){
            case '1' : 
              item.sex = '男';
              break;
            case '2' : 
              item.sex = '女';
              break;
            default : 
              item.sex = '其他';
          }
          item.regdate = Utils.format_date(new Date(item.regdate),true);
          item.logindate = Utils.format_date(new Date(item.logindate),true);         
        });
      }
       res.render('./admin/user',
        {
          title : config.name+'用户管理'
         ,user : req.session.user
         ,people : people
         ,pages : pageNum
         ,cat : cat
         ,pagenav : '/admin/user?cat='+cat+'&'
        });
      });      
    });

   }else if(req.method == 'POST'){
      if(!!req.query.del){
        var uid = parseInt(req.query.uid,10) || 0;
        if(!uid)return;        
        jixiang.delById(uid,'users',function(err){
           if(err)return res.json({flg:0,msg:err});
           return res.json({flg:1,msg:'删除成功！'});
        });        
      }

   }
}
//增加用户
exports.adduser = function(req,res){
  var cat = parseInt(req.query.cat,10) || 2;
  if(req.method == 'GET'){
    res.render('./admin/adduser',
      {
        title : config.name+'用户管理'
       ,user : req.session.user
       ,cat : cat
      });
  }
}
//查看&修改用户
exports.infouser = function(req,res){
  var cat = parseInt(req.query.cat,10) || 2
     ,uid = parseInt(req.query.uid,10) || 0;
  if(req.method == 'GET'){
    jixiang.getOne({
      cat:cat
     ,_id:uid
   },'users',function(err,doc){
      if(err){
        return res.redirect('/404');
      }
      doc.regdate = Utils.format_date(new Date(doc.regdate),true);
      doc.logindate = Utils.format_date(new Date(doc.logindate),true);
      res.render('./admin/infouser',{
        title : config.name+'用户管理'
       ,user : req.session.user
       ,cat : cat
       ,people : doc
      });
   });
  }else if(req.method =='POST'){
    if(parseInt(req.query.front,10) && (req.body.oldpassword || req.body.password)){
      if(/^[\w]{6,12}$/.test(req.body.oldpassword) && /^[\w]{6,12}$/.test(req.body.password)){
        return res.json({flg:0,msg:'密码必须要6位以上'});
      } 
      jixiang.getOne({_id:uid},'users',function(err,doc){
         if(err)return res.json({flg:0,msg:err});
         var md5 = crypto.createHash('md5');
         var oldpassword = md5.update(req.body.oldpassword).digest('base64');
         if(doc.password !== oldpassword)
           return res.json({flg:0,msg:'原密码不正确！'});
         setInfo();
      })
    }else{
      setInfo();
    }
    function setInfo(){
      var condition ={};
      if(cat == 3){
        condition.modify = {
          '$set' : {
            rank : req.body.rank
          }
        }
      }else{
        condition.modify = {
          '$set' : {
            sex : req.body.sex
          }
        }
      }
      if(cat == 2){
        condition.modify['$set'].school = req.body.school;
      }
      if(req.body.password){
        //生成口令散列
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');
        condition.modify['$set'].password = password;
      }
      condition.query = {
       _id : uid
      }
      jixiang.update(condition,'users',function(err){
        if(err){
          return res.json({flg:0,msg:'修改失败！'});
        }
        var redirect = '/admin/user?cat='+cat;
        if(parseInt(req.query.front,10)){
           redirect = (parseInt(req.query.front,10)==1) ? '/stu/' : '/teach/';
           redirect += req.session.user.username;
        }
        return res.json({flg:1,msg:'修改成功！',redirect:redirect});
      }); 
    }

  }
}
