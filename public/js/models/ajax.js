/**
 * @Description     Ajax
 * @Author          jixiangac
 * @Date            2013/03/02
 */

define(function(require,exports,module){
  var popbox = require('./popbox')
     ,validate = require('./validate');

  var ajaxForm = function(){
    for(var i=0,re=$('.require'),len =re.length;i<len;i++){
      if( !validate.require.call(re[i]) ) {
        return false;break;
      }
    }
    var formId = this.id;
    var data = $(this).serialize();
    if(formId == 'toteacher' && data.indexOf('toteacher') < 0){
       new popbox.tinyTips('error','请选择老师');
       return false;
    }
    if(formId == 'keyword-form'){
      window.location.href = $(this).attr('action')+'&'+data;
      return false;
    }
    var tips = new popbox.tinyTips();
    $.ajax({
        url : $(this).attr('action')
       ,type : $(this).attr('method')
       ,data : data
       ,dataType : 'json'
       ,beforsend: function(){
         // var tips = new popbox.tinyTips();
       }
       ,success : function(res){
         if(res.flg === 1){
           $('.tiny-tips').html('<span class="tiny-right"></span>'+res.msg+'<span class="tiny-end"></span>');
           // setTimeout(function(){
           //   if(res.redirect)
           //     window.location.href = res.redirect;
           //   else
           //     window.location.reload();
           // },500);
         }else if(res.flg === 2){
            tips.close();
            if(res.cover && res.cover === 1){//忘记密码
               $('form fieldset').html('<p style="font-size:200%">'+res.msg+'</p>');
            }else{
              $('#answers').html('<div class="grey-tips">'+res.answers.a+'</div>');
            }
            
         }else{
           tips.close();
           new popbox.tinyTips('error',res.msg);
         }
         
       }
    });
    return false;
  }
  exports.ajaxForm = ajaxForm;
});