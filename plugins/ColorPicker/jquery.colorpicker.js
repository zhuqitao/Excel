/**
 * jQuery插件：颜色拾取器
 * 
 * @author  Karson
 * @name    jquery.colorpicker.js
 * @since   2011-5-18 17:30:50
 * @edit by Xinying
 * @Any problems about the change just mail to 773875068@qq.com. Thanks.
 */
(function ($) {
    var ColorHex = new Array('00', '33', '66', '99', 'CC', 'FF');
    var SpColorHex = new Array('FF0000', '00FF00', '0000FF', 'FFFF00', '00FFFF', 'FF00FF');
    $.fn.colorpicker = function (options) {
        var opts = jQuery.extend({}, jQuery.fn.colorpicker.defaults, options);
        initColor();
        return this.each(function () {
            var obj = $(this);
            obj.bind(opts.event, function () {
                //定位
                var ttop = $(this).offset().top;     //控件的定位点高
                var thei = $(this).height();  //控件本身的高
                var tleft = $(this).offset().left;    //控件的定位点宽
                $("#colorpanel").css({
                    top: ttop + thei + 5,
                    left: tleft
                }).show();
                var target = opts.target ? $(opts.target) : obj;
                if (target.data("color") == null) {
                    target.data("color", target.css("color"));
                }

                $("#_creset").bind("click", function () {
                    target.css("color", target.data("color"));
                    $("#colorpanel").hide();
                    opts.reset(obj);
                });

                $("#CT tr td").unbind("click").mouseover(function () {
                    var color = $(this).css("background-color");
                    $("#DisColor").css("background", color);
                    $("#HexColor").val($(this).attr("rel"));
                }).click(function () {
                    var aaa = $(this).css("background");
                    var color = opts.ishex ? $(this).attr("rel") : aaa;
                    if (opts.fillcolor) target.val(color);
                    target.css("color", aaa);
                    $("#colorpanel").hide();
                    $("#_creset").unbind("click");
                    opts.success(obj, color);
                });

            });
        });

        function initColor() {
            $("body").append('<div id="colorpanel" style="position: absolute; display: none;"></div>');
            var colorTable = '';
            var colorValue = '';
            for (i = 0; i < 2; i++) {
                for (j = 0; j < 6; j++) {
                    colorTable = colorTable + '<tr height=12>'
                    colorTable = colorTable + '<td width=11 rel="#000000" style="background-color:#000000">'
                    colorValue = i == 0 ? ColorHex[j] + ColorHex[j] + ColorHex[j] : SpColorHex[j];
                    colorTable = colorTable + '<td width=11 rel="#' + colorValue + '" style="background-color:#' + colorValue + '">'
                    colorTable = colorTable + '<td width=11 rel="#000000" style="background-color:#000000">'
                    for (k = 0; k < 3; k++) {
                        for (l = 0; l < 6; l++) {
                            colorValue = ColorHex[k + i * 3] + ColorHex[l] + ColorHex[j];
                            colorTable = colorTable + '<td width=11 rel="#' + colorValue + '" style="background-color:#' + colorValue + '">'
                        }
                    }
                }
            }
            colorTable = '<table width=253 border="0" cellspacing="0" cellpadding="0" style="border:1px solid #000;">'
            + '<tr height=30><td colspan=21 bgcolor=#cccccc>'
            + '<table cellpadding="0" cellspacing="1" border="0" style="border-collapse: collapse">'
            + '<tr><td width="3"><td><input type="text" id="DisColor" size="6" disabled style="border:solid 1px #000000;background-color:#ffff00"></td>'
            + '<td width="3"><td><input type="text" id="HexColor" size="7" style="border:inset 1px;font-family:Arial;" value="#000000"><a href="javascript:void(0);" id="_cclose">关闭</a> | <a href="javascript:void(0);" id="_creset">清除</a></td></tr></table></td></table>'
            + '<table id="CT" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse" bordercolor="000000"  style="cursor:pointer;">'
            + colorTable + '</table>';
            $("#colorpanel").html(colorTable);
            //#region 判断使用的jquery版本，如果是1.8版本之后的使用on方法，如果是之前的使用live方法
            var jqversion = $().jquery;
            if (jqversion.match(".") == ",") {
                var jqversionArray = jqversion.split('.');
                if (jqversionArray != null && jqversionArray.length > 1) {
                    //#region 如果是1.8版本之后的使用on方法，如果是之前的使用live方法
                    if (parseInt(jqversionArray[0] > 1)) {
                        $("#colorpanel").on('click', '#_cclose', function () {
                            $("#colorpanel").hide();
                            return false;
                        }).css({
                            "font-size": "12px",
                            "padding-left": "20px"
                        });
                    }
                    else {
                        if (parseInt(jqversionArray[1]) >= 8) {
                            $("#colorpanel").on('click', '#_cclose', function () {
                                $("#colorpanel").hide();
                                return false;
                            }).css({
                                "font-size": "12px",
                                "padding-left": "20px"
                            });
                        }
                        else {
                            $("#_cclose").live('click', function () {
                                $("#colorpanel").hide();
                                return false;
                            }).css({
                                "font-size": "12px",
                                "padding-left": "20px"
                            });
                        }
                    }
                    //#endregion
                }
                else {
                    $("#_cclose").live('click', function () {
                        $("#colorpanel").hide();
                        return false;
                    }).css({
                        "font-size": "12px",
                        "padding-left": "20px"
                    });
                }
            }
            //#endregion
        }
    };
    jQuery.fn.colorpicker.defaults = {
        ishex: true, //是否使用16进制颜色值
        fillcolor: false,  //是否将颜色值填充至对象的val中
        target: null, //目标对象
        event: 'click', //颜色框显示的事件
        success: function () { }, //回调函数
        reset: function () { }
    };
})(jQuery);