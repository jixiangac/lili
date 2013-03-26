/*--------------------------*
 *         公告发布         *
 *--------------------------*/
 var config = require('../../config')
    ,dataFormat = require('../../models/utils').format
    ,jixiang = require('../../models/base')

exports.index = function(req,res){
  res.render('./admin/notice',{
     title : config.name+'公告发布'
    ,user : req.session.user
    ,nowDate : dataFormat.call(new Date(),'yyyy-MM-dd')
  });
}