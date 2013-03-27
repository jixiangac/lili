/**
 * Index.js
 */
define(function(require){
  var $ = require('jquery');
  window.$ = $;
  var ajax = require('./models/ajax');
  $('.ajax-form').on('submit',ajax.ajaxForm);
  require('./lib/kalendae');
      new Kalendae.Input('date', {
      months:1
     ,direction:'future'
     ,format : 'YYYY-MM-DD'
    });
  //删除
  $('.btn-del').on('click',function(){
    var url = $(this).attr('href');
    $.get(url,function(res){
      if(res.flg ===1){
        window.location.reload();
      }else{

      }
    });
    return false;
  });
})