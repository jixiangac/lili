/**
 * Index.js
 */
define("dist/index-debug", [ "./models/ajax-debug", "./models/popbox-debug", "./models/validate-debug", "highcharts-debug", "kalendae-debug" ], function(require) {
    // var $ = require('jquery');
    // window.$ = $;
    var ajax = require("./models/ajax-debug"), popbox = require("./models/popbox-debug"), validate = require("./models/validate-debug");
    $(".ajax-form").on("submit", ajax.ajaxForm);
    //图表
    if (document.getElementById("charts") && document.getElementById("data-charts")) {
        require("highcharts-debug");
        var datalist = JSON.parse($("#data-charts").val());
        var show = {
            categories: [],
            data: []
        };
        for (var key in datalist) {
            show.categories.push(key);
            show.data.push(datalist[key]);
        }
        if ($("#data-charts").attr("data-flg") === "teach") {
            show.title = "被提问";
        } else {
            show.title = "提问";
        }
        $("#charts").highcharts({
            chart: {},
            title: {
                text: show.title + "走势图",
                style: {
                    color: "#900f49",
                    fontSize: "28px",
                    fontFamily: "MicroSoft YaHei"
                }
            },
            xAxis: {
                categories: show.categories
            },
            yAxis: {
                title: {
                    text: show.title + "个数",
                    style: {
                        color: "#ff775c",
                        fontFamily: "MicroSoft YaHei",
                        fontWeight: "normal",
                        fontSize: "14px"
                    }
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    var s;
                    s = "" + this.x + show.title + "个数： " + this.y + "个";
                    return s;
                }
            },
            series: [ {
                type: "column",
                name: "问题个数",
                data: show.data
            } ]
        });
    }
    //日期
    if (location.href.indexOf("notice") !== -1) {
        require("kalendae-debug");
        new Kalendae.Input("date", {
            months: 1,
            format: "YYYY-MM-DD"
        });
    }
    //删除
    $(".btn-del").on("click", function() {
        if (!confirm("确定删除吗？")) return false;
        var url = $(this).attr("href");
        var tips = new popbox.tinyTips();
        $.post(url, {}, function(res) {
            if (res.flg === 1) {
                $(".tiny-tips").html('<span class="tiny-right"></span>' + res.msg + '<span class="tiny-end"></span>');
                setTimeout(function() {
                    if (res.redirect) window.location.href = res.redirect; else window.location.reload();
                }, 2e3);
            } else {
                tips.close();
                new popbox.tinyTips("error", res.msg);
            }
        });
        return false;
    });
    //加载回答框
    $(".teach-reply .btn-reply").on("click", function() {
        var tbody = $(this).parents("tbody"), r_box;
        if (!tbody.find(".answer").length) {
            r_box = '<tr class="answer form-inline">' + '<td class="q">回答：</td>' + '<td class="aleft">' + '<textarea name="reply"></textarea>' + '<a class="btn-reply btn q-reply">提交回答</a>' + '<a class="btn-reply btn cancel">取消</a>' + "</td>" + "</tr>";
            $(r_box).appendTo(tbody);
            tbody.find(".answer").hide().fadeIn("fast");
        } else {
            tbody.find("textarea").focus();
        }
    });
    //提交回答
    $("tbody").delegate(".q-reply", "click", function() {
        var tbody = $(this).parents("tbody");
        if (!tbody.find("textarea").val().length) {
            new popbox.tinyTips("error", "内容总不能为空吧？");
            return;
        }
        var data = {
            id: tbody.attr("data-id"),
            answer: $.trim(tbody.find("textarea").val())
        };
        $.post("/teach/question", data, function(res) {
            if (res.flg === 1) {
                new popbox.tinyTips("right", res.msg);
                setTimeout(function() {
                    tbody.fadeOut();
                }, 1500);
            } else {
                new popbox.tinyTips("error", res.msg);
            }
        });
    });
    //取消回答
    $("tbody").delegate(".cancel", "click", function() {
        var tr = $(this).parents("tr");
        tr.fadeOut("fast", function() {
            tr.remove();
        });
    });
    //选择&搜索
    $("#thecat").on("change", function() {
        var $this = $(this);
        if (!parseInt($this.val(), 10)) {
            //如果是全部跳转
            window.location.href = window.location.pathname;
            return;
        }
        var url = window.location.pathname + "/cat/get?cat=" + $this.val();
        $.get(url, function(res) {
            // console.log(res)
            if (res.success) {
                var list = "";
                var name;
                for (var i = 0, len = res.list.length; i < len; i++) {
                    name = res.list[i].name;
                    list += '<option value="' + name + '">' + name + "</option>";
                }
                var pa = $this.parent();
                pa.find("#getCat").remove();
                if (list) pa.append('<select name="getCat" id="getCat"><option value="0">请选择..</option>' + list + "</select>");
            } else {
                alert("服务器卖萌了！");
            }
        });
    });
    $("#select-cat").delegate("#getCat", "change", function() {
        window.location.href = window.location.pathname + "?cat=" + $("#thecat").val() + "&tag=" + this.value;
    });
});

/**
 * @Description     Ajax
 * @Author          jixiangac
 * @Date            2013/03/02
 */
define("dist/models/ajax-debug", [ "./popbox-debug", "./validate-debug" ], function(require, exports, module) {
    var popbox = require("./popbox-debug"), validate = require("./validate-debug");
    var ajaxForm = function() {
        for (var i = 0, re = $(".require"), len = re.length; i < len; i++) {
            if (!validate.require.call(re[i])) {
                return false;
                break;
            }
        }
        var formId = this.id;
        var data = $(this).serialize();
        if (formId == "toteacher" && data.indexOf("toteacher") < 0) {
            new popbox.tinyTips("error", "请选择老师");
            return false;
        }
        var tips = new popbox.tinyTips();
        $.ajax({
            url: $(this).attr("action"),
            type: $(this).attr("method"),
            data: data,
            dataType: "json",
            beforsend: function() {},
            success: function(res) {
                if (res.flg === 1) {
                    $(".tiny-tips").html('<span class="tiny-right"></span>' + res.msg + '<span class="tiny-end"></span>');
                    setTimeout(function() {
                        if (res.redirect) window.location.href = res.redirect; else window.location.reload();
                    }, 500);
                } else if (res.flg === 2) {
                    tips.close();
                    $("#answers").html('<div class="grey-tips">' + res.answers.a + "</div>");
                } else {
                    tips.close();
                    new popbox.tinyTips("error", res.msg);
                }
            }
        });
        return false;
    };
    exports.ajaxForm = ajaxForm;
});

/**
 *  @Description    Popbox(弹出框)
 *  @Author         jixiangac
 *  @Date           2013/03/02
 */
define("dist/models/popbox-debug", [], function(require, exports, module) {
    //遮罩层
    function overlay(obj, flag) {
        //如果有flag表示不能点击空白关闭
        var self = this;
        this.render();
        if (!flag) {
            this.el.on("click", function() {
                self.close();
                obj.hide();
            });
        }
    }
    overlay.prototype.render = function() {
        this.el = $('<div class="overlay"></div>').appendTo("body");
    };
    overlay.prototype.close = function() {
        var el = this.el;
        el.remove();
    };
    exports.overlay = overlay;
    //默认弹窗类
    exports.init = function(main, flag) {
        //默认右上角有X，
        var close = flag ? "" : '<a class="close-btn close"></a>';
        var box = $('<div class="popbox" style="opacity:0">' + close + '<div class="popbox-bd">' + main + "</div></div>").appendTo("body");
        var _overlay = new overlay(box, true);
        box.css("margin-top", -Math.ceil(box.height() / 2 + 150));
        box.animate({
            marginTop: "+=" + 50,
            opacity: 1
        }, 500);
        box.find(".close").on("click", function() {
            box.animate({
                marginTop: "-=" + 50,
                opacity: 0
            }, 500, function() {
                box.remove();
                _overlay.close();
            });
        });
        return false;
    };
    //小提示
    function tinyTips(flag, tips, time) {
        this.flag = flag || "load";
        this.tips = tips || '<em class="tiny-loading"></em>给力提交中……';
        this.time = time || 2e3;
        this._overlay = new overlay(this, true);
        this.render(flag, tips, time);
    }
    tinyTips.prototype.render = function() {
        this.box = $('<div id="ajax_tips" class="tiny-tips-wrap" style="opacity:0"><div class="tiny-tips"><span class="tiny-' + this.flag + '"></span>' + this.tips + '<span class="tiny-end"></span></div></div>').appendTo("body");
        var el = this.box;
        el.css("margin-top", -Math.ceil(el.height() / 2 + 150));
        el.animate({
            marginTop: "-=" + 50,
            opacity: 1
        }, 500);
        if (this.flag != "load") {
            var that = this;
            setTimeout(function() {
                that.close();
            }, that.time);
        }
    };
    tinyTips.prototype.close = function() {
        var el = this.box, that = this;
        if (this.flag == "load") {
            el.remove();
            that._overlay.close();
            return;
        }
        el.animate({
            marginTop: "-=" + 50,
            opacity: 0
        }, 500, function() {
            el.remove();
            that._overlay.close();
        });
    };
    exports.tinyTips = tinyTips;
});

/**
 * @Description     表单验证类
 * @Author          jixiangac
 * @Email           jixiangac@gmail.com
 * @Date            2013/03/05
 */
define("dist/models/validate-debug", [ "./popbox-debug" ], function(require, exports, module) {
    var popbox = require("./popbox-debug");
    //验证规则
    var pattern = {
        realname: {
            name: "真实姓名",
            rex: "^[一-龥]{2,}$",
            tips: "请输入真实姓名！",
            error: "真实姓名由中文组成！"
        },
        username: {
            name: "用户名",
            rex: "^[\\w]{3,10}",
            tips: "请输入用户名！",
            error: "用户名由字母、数字、下划线组成！"
        },
        email: {
            name: "邮箱",
            rex: "^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$",
            tips: "请输入邮箱",
            error: "邮箱格式出错！"
        },
        password: {
            name: "密码",
            rex: "^[\\w]{6,12}$",
            tips: "请输入6位以上的密码",
            error: "请输入6位以上的密码！"
        },
        repassword: {
            name: "重复密码",
            rex: "^[\\w]{6,12}$",
            tips: "请重复输入密码",
            error: "请输入6位以上的密码！"
        },
        website: {
            name: "网站名称",
            rex: "^[^\\s]+$",
            tips: "请输入网站名称",
            error: "网站名称至少两个字！"
        },
        url: {
            name: "网站地址",
            rex: "^[a-zA-z]+://[^\\s]*$",
            tips: "请输入网站地址",
            error: "网站地址出错！"
        },
        q: {
            name: "问题",
            rex: "^[^\\s]+$",
            tips: "请输入问题！",
            error: "问题不能为空哦！"
        }
    };
    function getLen(s) {
        var l = 0;
        var a = s.split("");
        for (var i = 0, len = a.length; i < len; i++) {
            if (a[i].charCodeAt(0) < 299) {
                l++;
            } else {
                l += 2;
            }
        }
        return l;
    }
    var blurValidate = function() {
        var name = this.name, value = $.trim(this.value);
        if (name === "repassword") {
            if (value !== $.trim($("#password").val())) {
                Tips(this, "error", "两次密码不一致！");
                return false;
            }
        }
        var rex = new RegExp(pattern[name].rex, "gi");
        if (rex.test(value)) {
            if ($(this).attr("data-flag") === "e-login") {
                $(this).next().html("");
                return false;
            }
            Tips(this, "right", "");
            this.style.cssText = "";
        } else {
            Tips(this, "error", pattern[name].error);
        }
    };
    exports.blurValidate = blurValidate;
    //默认提示信息
    function Tips(obj, flag, tips) {
        $(obj).next("span").html('<em class="help-' + flag + '"></em>' + tips);
    }
    exports.defTips = function() {
        Tips(this, "tips", pattern[this.name].tips);
    };
    //验证必填项目
    var require = function() {
        var name = this.name, value = $.trim(this.value);
        if (value.length == 0) {
            new popbox.tinyTips("error", pattern[name].name + "不能为空！");
            return false;
        }
        if (name === "repassword") {
            if (value !== $.trim($("#password").val())) {
                new popbox.tinyTips("error", "两次密码不一致！");
                return false;
            }
        }
        var rex = new RegExp(pattern[name].rex, "gi");
        if (!rex.test(value)) {
            new popbox.tinyTips("error", pattern[name].error);
            return false;
        }
        return true;
    };
    exports.require = require;
});
