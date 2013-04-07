/**
 * Index.js
 */
define(function(require){
  var $ = require('jquery');
  window.$ = $;
  var ajax = require('./models/ajax');
  $('.ajax-form').on('submit',ajax.ajaxForm);

  //日期
  if(location.href.indexOf('notice')!==-1){
    require('./lib/kalendae');
    new Kalendae.Input('date', {
      months:1
     ,format : 'YYYY-MM-DD'
    });    
  }
  if(document.getElementById('charts')){
      require('./lib/highcharts');
      $('#charts').highcharts({
            chart: {
            },
            title: {
                text: '一月提问走势'
            },
            xAxis: {
                categories: ['Apples', 'Oranges', 'Pears', 'Bananas', 'Plums']
            },
            tooltip: {
                formatter: function() {
                    var s;
                        s = ''+this.x  +':信息 '+ this.y;
                    return s;
                }
            },
            labels: {
                items: [{
                    html: '统计你的提问频率',
                    style: {
                        left: '40px',
                        top: '8px',
                        color: 'black'
                    }
                }]
            },
            series: [{
                type: 'column',
                name: 'Jane',
                data: [3, 2, 1, 3, 4]
            }, {
                type: 'spline',
                name: 'Average',
                data: [3, 2.67, 3, 6.33, 3.33],
                marker: {
                  lineWidth: 10,
                  lineColor: Highcharts.getOptions().colors[3],
                  fillColor: 'white'
                }
            }]
        });
  }
  //删除
  var popbox = require('./models/popbox');
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
  validate = require('./models/validate');
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
})