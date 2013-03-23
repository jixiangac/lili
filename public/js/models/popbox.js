/**
 *  @Description    Popbox(弹出框)
 *  @Author         jixiangac
 *  @Date           2013/03/02
 */

define(function(require,exports,module){
  //遮罩层
  function overlay(obj,flag){//如果有flag表示不能点击空白关闭
     var self = this;
     this.render();
     if(!flag){
       this.el.on('click',function(){
         self.close();
         obj.hide();
       });
     }
  }
  overlay.prototype.render = function(){
    this.el = $('<div class="overlay"></div>').appendTo('body');
  }
  overlay.prototype.close = function(){
    var el = this.el;
    el.remove();
  }
  exports.overlay = overlay;
  //默认弹窗类
  exports.init = function(main,flag){//默认右上角有X，
    var close = flag ? '' : '<a class="close-btn close"></a>';
    var box = $('<div class="popbox" style="opacity:0">'+close+'<div class="popbox-bd">'+main+'</div></div>').appendTo('body');
    var _overlay= new overlay(box,true);

    box.css('margin-top',-Math.ceil(box.height()/2+150));
    box.animate({
      'marginTop': '+='+50
     ,'opacity' : 1
    },500);

    box.find('.close').on('click',function(){
      box.animate({
        'marginTop': '-='+50
        ,'opacity' : 0
      },500,function(){
        box.remove();
        _overlay.close();
      });
    });
    return false;
  }
  //小提示
  function tinyTips(flag,tips,time){
     this.flag = flag || 'load';
     this.tips = tips || '<em class="tiny-loading"></em>给力提交中……';
     this.time = time || 2000;
     this._overlay = new overlay(this,true);
     this.render(flag,tips,time);
  }
  tinyTips.prototype.render = function(){
     this.box = $('<div id="ajax_tips" class="tiny-tips-wrap" style="opacity:0"><div class="tiny-tips"><span class="tiny-'+this.flag+'"></span>'+this.tips+'<span class="tiny-end"></span></div></div>').appendTo('body');
     var el = this.box;
     el.css('margin-top',-Math.ceil(el.height()/2+150));
     el.animate({
        'marginTop': '-='+50
       ,'opacity' : 1
      },500);

      if(this.flag != 'load'){
        var that = this;
        setTimeout(function(){
          that.close();
        },that.time);      
      }
  }
  tinyTips.prototype.close = function(){
    var el = this.box,that = this;
    if(this.flag == 'load'){
      el.remove();
      that._overlay.close();
      return;
    }
    el.animate({
      'marginTop' : '-='+50
     ,'opacity' : 0
    },500,function(){
      el.remove();
      that._overlay.close();
    });
  }
  exports.tinyTips = tinyTips;
});