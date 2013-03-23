/**
 * @Description    工具集
 * @Author         jixiangac
 * @Email          jixiangac@gmail.com
 * @Date           2013/03/08
 */
define(function(require,exports,module){
   //创建类似的placeholder
   exports.createPlaceHolder = function(obj){
      if('placeholder' in document.createElement('input')){ //如果浏览器原生支持placeholder
          return ;
      }
      var el = $(obj)[0];
      var placeholder=el.getAttribute('placeholder'),emptyHintEl=el.__emptyHintEl;
      if(placeholder && !emptyHintEl){
         emptyHintEl = document.createElement('span');
         emptyHintEl.innerHTML = placeholder;
         emptyHintEl.style.cssText = 'position:absolute;text-indent:30px;top:6px;left:1px;';
         emptyHintEl.onclick=function(el){
            return function(){
                try{
                    el.focus();
                }catch(ex){

                }
            }
         }(el);
         if(el.value) emptyHintEl.style.display='none';
         el.parentNode.insertBefore(emptyHintEl,el);
         el.__emptyHintEl=emptyHintEl;

      }
      obj.on('focus',function(){
        if(el.__emptyHintEl){
          emptyHintEl.style.display='none';
        }
      });
      obj.on('blur',function(){
        if(emptyHintEl){
          if(el.value) emptyHintEl.style.display='none';
          else emptyHintEl.style.display='';
        }
      });
   }


});