/**
 * Index.js
 */
define(function(require){
  var $ = require('jquery');
  window.$ = $;

  var ajax = require('./models/ajax')
     ,popbox = require('./models/popbox')
     ,validate = require('./models/validate')


  $('.ajax-form').on('submit',ajax.ajaxForm);

  //日期
  if(location.href.indexOf('notice')!==-1){
    require('kalendae');
    new Kalendae.Input('date', {
      months:1
     ,format : 'YYYY-MM-DD'
    });    
  }

  if(document.getElementById('charts') && document.getElementById('data-charts')){
      require('highcharts');
      var datalist = JSON.parse( $('#data-charts').val() );
      var show = {
         categories : []
        ,data : []
      };
      for(var key in datalist){
         show.categories.push(key);
         show.data.push(datalist[key]);
      }
      if($('#data-charts').attr('data-flg') === 'teach'){
        show.title = '被提问';
      }else{
        show.title = '提问';
      }
      $('#charts').highcharts({
            chart: {
            },
            title: {
                text: show.title+'走势图',
                style : {
                  color: '#900f49',
                  fontSize :'28px',
                  fontFamily :'MicroSoft YaHei'
                }
            },
            xAxis: {
                categories: show.categories
            },
            yAxis: {
               title : {
                 text : show.title+'个数',
                 style : {
                  color: '#ff775c',
                  fontFamily :'MicroSoft YaHei',
                  fontWeight: 'normal',
                  fontSize: '14px'
                 }
               }
            },
            legend: {
              enabled : false
            },
            credits:{
              enabled : false
            },
            tooltip: {
                formatter: function() {
                    var s;
                        s = ''+this.x  +show.title+'个数： '+ this.y+'个';
                    return s;
                }
            },
            series: [{
                type: 'column',
                name: '问题个数',
                data: show.data
            }]
        });
  }
  //删除
  $('.btn-del').on('click',function(){
    if(!confirm('确定删除吗？'))return false;
    var url = $(this).attr('href');
    var tips = new popbox.tinyTips();
    $.post(url,{},function(res){
       if(res.flg === 1){
         $('.tiny-tips').html('<span class="tiny-right"></span>'+res.msg+'<span class="tiny-end"></span>');
         setTimeout(function(){
           if(res.redirect)
             window.location.href = res.redirect;
           else
             window.location.reload();
         },2000);
       }else{
         tips.close();
         new popbox.tinyTips('error',res.msg);
       }
    });
    return false;
  });
  //加载回答框
  $('.teach-reply .btn-reply').on('click',function(){
     var tbody = $(this).parents('tbody'),r_box;
     if(!tbody.find('.answer').length){
      r_box = '<tr class="answer form-inline">'+
                 '<td class="q">回答：</td>'+
                 '<td class="aleft">'+
                   '<textarea name="reply"></textarea>'+
                   '<a class="btn-reply btn q-reply">提交回答</a>'+
                   '<a class="btn-reply btn cancel">取消</a>'+
                 '</td>'+
              '</tr>';
       $(r_box).appendTo(tbody);
       tbody.find('.answer').hide().fadeIn('fast');
     }else{
       tbody.find('textarea').focus();
     } 
  });
  //提交回答
  $('tbody').delegate('.q-reply','click',function(){
      var tbody = $(this).parents('tbody');
      if(!tbody.find('textarea').val().length){
         new popbox.tinyTips('error','内容总不能为空吧？');
         return;
      }
      var data = {
        id :tbody.attr('data-id')
       ,answer : $.trim( tbody.find('textarea').val() )
      }
      $.post('/teach/question',data,function(res){
          if(res.flg === 1){
            new popbox.tinyTips('right',res.msg);
            setTimeout(function(){
              tbody.fadeOut();
            },1500);
            
          }else{
            new popbox.tinyTips('error',res.msg);
          }
      });
      
  })
  //取消回答
  $('tbody').delegate('.cancel','click',function(){
     var tr = $(this).parents('tr');
     tr.fadeOut('fast',function(){tr.remove();})
  });
  //选择&搜索
  $('#thecat').on('change',function(){
    var $this = $(this);
    if(!parseInt($this.val(),10)){//如果是全部跳转
      window.location.href = window.location.pathname;
      return;
    }
    var url = window.location.pathname+'/cat/get?cat='+$this.val();
    $.get(url,function(res){
       // console.log(res)
       if(res.success){
          var list = '';
          var name;
          for(var i=0,len=res.list.length;i<len;i++){
             name = res.list[i].name;
             list += '<option value="'+name+'">'+name+'</option>';
          }
          var pa = $this.parent();
          pa.find('#getCat').remove();
          if(list)
            pa.append('<select name="getCat" id="getCat"><option value="0">请选择..</option>'+list+'</select>')
       }else{
         alert('服务器卖萌了！')
       }
    })
  });
  $('#select-cat').delegate('#getCat','change',function(){
     window.location.href = window.location.pathname + '?cat='+$('#thecat').val()+'&tag='+this.value;
  })
})