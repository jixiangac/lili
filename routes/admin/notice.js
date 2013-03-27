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