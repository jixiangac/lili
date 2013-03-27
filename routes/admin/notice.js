/*--------------------------*
 *         公告发布         *
 *--------------------------*/
 var config = require('../../config')
    ,dataFormat = require('../../models/utils').format
    ,jixiang = require('../../models/base')

exports.index = function(req,res){
  if(req.method == 'GET'){
      var condition = {};
      condition.query = {
        last_time : {
          '$gte' : new Date()*1
        }
      }
      condition.sort = {
        release_time : 1
      }
      jixiang.get(condition,'notice',function(err,doc){
        if(err)console.log(err);
        console.log(doc)
        if(doc.length){
          doc[0].release_time = dataFormat.call(new Date(doc[0].release_time),'yyyy-MM-dd hh:mm:ss')
        }
       res.render('./admin/notice',{
         title : config.name+'公告发布'
        ,user : req.session.user
        ,nowDate : dataFormat.call(new Date(),'yyyy-MM-dd')
        ,doc : doc[0]
      });

    });

  }else if(req.method == 'POST'){
    var time = new Date(req.body.date+' 00:00:00').getTime()
             + (parseInt(req.body.time,10) ? (parseInt(req.body.h,10)+12)*3600*1000 : req.body.h*60*60*1000 )
             + req.body.m*60*1000
       ,last = parseInt(req.body.lasttime,10)
       ,content = req.body.content;
    var data = {
      release_time : time 
     ,last_time : time + 3600000 * 24 * last
     ,content : content
     ,author : req.session.user.username
    }
    jixiang.save(data,'notice',function(err,doc){
      if(err)return res.json({flg:0,msg:err})
      return res.json({flg:1,msg:'发布成功！'})
    });
  }

}
/*-------------------------*
 *        友情链接         *
 *-------------------------*/
 exports.link = function(req,res){
   var add = parseInt(req.query.add,10) || 0
      ,modify = parseInt(req.query.modify,10) || 0;
   var id = parseInt(req.query.id,10) || 0;
   if(req.method == 'GET'){
     var cat = 1;
     var result = {};
     if(add !== 0){//增加链接
       cat = 2;
       render();
     }else if(modify !==0){//修改链接
       cat = 3;
       jixiang.getOne({_id:id},'links',function(err,doc){
         if(err)consloe.log(err);
         result.linkdetail = doc;
         render();        
       });

     }else{
       jixiang.count({},'links',function(err,count){
          if(err)return res.json({flg:0,msg:err});
          console.log(count)
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
          //取友情链接数据
          jixiang.get(condition,'links',function(err,doc){
            if(err)doc=[];
            result.link = doc;
            render();
          });
       });
     }
     function render(){
       res.render('./admin/link',{
         title : config.name+'友情链接'
        ,user : req.session.user
        ,cat : cat
        ,result : result
       });      
     }
   }else if(req.method == 'POST'){
     var website = {
        name : req.body.website
       ,url : req.body.url
       ,description : req.body.description 
     }
     if(add !==0){//增加
       jixiang.save(website,'links',function(err,doc){
         if(err)return res.json({flg:0,msg:err});
         return res.json({flg:1,msg:'增加成功！',redirect:'/admin/link'});
       });  
     }else if(modify !==0){//修改
       if(id===0)return;
       var condition = {
         query : {
           _id : id
         }
        ,modify : website
       }
       jixiang.update(condition,'links',function(err){
         if(err)return res.json({flg:0,msg:err});
         return res.json({flg:1,msg:'修改成功'});
       });
     }else{//删除
        var del = parseInt(req.query.del,10) || 0;
        if(del===0)return;
        jixiang.delById(id,'links',function(err){
           if(err)return json({flg:0,msg:err});
           return json({flg:1,msg:'删除成功！'});
        });
     }

   }
 } 