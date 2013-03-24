/**
 *  后台首页
 */
var config = require('../../config')
   ,jixiang = require('../../models/base');

var index = function(req,res){
   if(req.method == 'GET'){
     res.render('./admin/index',
      {
        title : config.name+'管理后台'
       ,user : req.session.user
      });
   }else if(req.method == 'POST'){

   }
}
exports.index = index;