define(function(require, exports, module) {
    var Core = require("core"), $ = require("$"), Position = require("position");
    var ua = (window.navigator.userAgent || "").toLowerCase(), isIE6 = ua.indexOf("msie 6") !== -1;
    var pop_validator = Core.extend({
        events: {
            "mouseenter .{{attrs.inputClass}}": "mouseenter",
            "mouseleave .{{attrs.inputClass}}": "mouseleave",
            "mouseenter .{{attrs.textareaClass}}": "mouseenter",
            "mouseleave .{{attrs.textareaClass}}": "mouseleave",
            "focus .{{attrs.itemClass}} :input": "focus",
            "blur .{{attrs.itemClass}} :input": "blur",
            "click .{{attrs.itemClass}} .{{attrs.selectTrigger}}": "selectClick",
            "blur .{{attrs.itemClass}} .{{attrs.selectTrigger}}": "selectBlur"
        },
        attrs: {
            explainClass: "ali-tiptext-container",
            itemClass: "ali-form-item",
            itemHoverClass: "ali-form-item-hover",
            itemFocusClass: "ali-form-item-focus",
            itemErrorClass: "ali-form-item-error",
            itemSuccessClass: "ali-form-item-success",
            itemWarnClass: "ali-form-item-warn",
            itemProblemClass: "ali-form-item-problem",
            inputClass: "ali-input",
            textareaClass: "ali-textarea",
            zIndex: 98,
            explainTemplate: "",
            selectTrigger: "ui-select-trigger",
            onItemValidated: function(error, message, element, event){
                if(!error){
                    this.getItem(element).removeClass(this.get('itemErrorClass'));
                }else{
                    this.getItem(element).removeClass(this.get('itemSuccessClass'));
                }
            },
            showMessage: function(message, element, event) {
                this.getItem(element).addClass(this.get("itemErrorClass"));
                this.popMsgShow({
                    el: element,
                    msg: message
                });
            },
            hideMessage: function(message, element, event) {
                var data_explain = element.attr("data-explain") || "";
                if (data_explain != "" && !element.parents('.' + this.get('itemClass')).hasClass(this.get('itemFocusClass'))) {
                    this.popMsgHide({
                        el: element
                    });
                }
                var successMsg = this.query(element).get("successMsg");
                if (typeof successMsg != "undefined" && !element.is(":focus")) {
                    this.getItem(element).addClass(this.get("itemSuccessClass"));
                    this.popMsgShow({
                        el: element,
                        msg: successMsg
                    });
                }
            }
        },
        /**
         * 处理提交表单时的按钮变灰和出现loading文案
         * @private
         */
        setup: function() {
            pop_validator.superclass.setup.call(this);
            var that = this;
            this.on("formValidated", function(err, result, element) {
                if (!err && that.get("autoSubmit")) {
                    that.element.find("[type='submit']").attr("disabled", "disabled");
                    var submitBtn = that.element.find("[type='submit']").parent();
                    if (submitBtn.hasClass("ui-button-lorange") || submitBtn.hasClass("ui-button-lblue")) {
                        submitBtn.removeClass("ui-button-lorange ui-button-lblue").addClass("ui-button-ldisable");
                        submitBtn.next().find(".loading-text")[0] && submitBtn.next().find(".loading-text").removeClass("fn-hide");
                    } else if (submitBtn.hasClass("ui-button-morange") || submitBtn.hasClass("ui-button-mblue")) {
                        submitBtn.removeClass("ui-button-morange ui-button-mblue").addClass("ui-button-mdisable");
                        submitBtn.next().find(".loading-text")[0] && submitBtn.next().find(".loading-text").removeClass("fn-hide");
                    }
                }
            });
        },
        /**
         * 处理后端报错
         * @public
         */
        renderDataError: function() {
            var that = this;
            $("[data-error]").each(function(index, ele) {
                var ele = $(ele);
                var errorMsg = ele.attr("data-error");
                if (errorMsg && $.trim(errorMsg) != "") {
                    that.getItem(ele).addClass(that.get("itemErrorClass")).removeClass(that.get("itemSuccessClass"));
                    that.popMsgShow({
                        el: ele,
                        msg: errorMsg
                    });
                }
            });
        },
        /**
         * 创建一个与input相关联的popWin窗口
         * @private
         * @param {element}  产生错误消息的节点，jQuery对象
         */
        createPopWin: function(el) {
            var relPopWinId = "J-pop-" + el.attr("name");
            //创建一个浮窗
            var relPopWin = $("<div id='" + relPopWinId + "' data-inputName='"
                + el.attr("name") + "' class='" + this.get('explainClass') + " fn-hide' style='z-index:"
                + this.get("zIndex") + "' data-oldZIndex='" + this.get("zIndex")
                + "'><div class='ali-tiptext-arrow ali-tiptext-arrowleft'><em>◆</em><span>◆</span></div><p class='ali-tiptext'></p></div>")
                .appendTo(this.getItem(el));
            //关联浮窗与input
            el.attr("data-pop", relPopWinId);
            return relPopWin;
        },
        /**
         * 显示错误消息
         * @public
         * @param {element}    产生错误消息的节点
         * @param {string}      错误消息
         */
        popMsgShow: function() {
            var el = arguments[0].el;
            var msg = arguments[0].msg || "";
            if (typeof el == "undefined") {
                return false;
            }
            if ($("#" + el.attr("data-pop"))[0]) {
                var popWin = $("#" + el.attr("data-pop"));
            } else {
                var popWin = this.createPopWin(el);
            }
            //设置z-index让当前pop浮在最上
            if (el.parents('.' + this.get('itemClass')).hasClass('.' + this.get('itemFocusClass'))) {
                popWin.css("z-index", this.get("zIndex") + 2);
                el.parents('.' + this.get('itemClass')).css("z-index", this.get("zIndex") + 1);
            } else {
                popWin.css("z-index", popWin.attr("data-oldZIndex"));
                el.parents('.' + this.get('itemClass')).css("z-index", this.get("zIndex"));
            }
            popWin.css({
                width: "auto",
                top: 0,
                left: "300px",
                zoom: 1
            });
            //填充消息
            popWin.find('.ali-tiptext').html(this.get("explainTemplate") + msg);
            //显示pop
            popWin.css("display", "block");
            //对有group的情况做一个hack，比如姓名和身份证
            popWin.parents(".ui-form-group")[0] &&
            popWin.parents(".ui-form-group").removeClass("ui-form-group-warn ui-form-group-problem ui-form-group-success");
            //给pop设宽度
            var popWinWidth = popWin.width();
            var maxWidth;
            if (el.attr("tagname") != "select") {
                //2是input的border，20是3个元素的间距，35是自己的内边距加上边
                maxWidth = popWin.parent().width() - el.innerWidth() - 2 - 20 - 35;
            } else {
                maxWidth = popWin.parent().width() - el.next().innerWidth() - 2 - 20 - 35;
            }
            if (popWinWidth > maxWidth) {
                popWinWidth = maxWidth;
            } else {
                //解决遇到英文或数字时换行的问题
                popWinWidth = popWinWidth + 5;
            }
            popWin.css("width", popWinWidth + "px");
            var positionEle = this.query(el).get("position");
            //计算位置，如果是select和替换后的选框对齐
            if (el.attr("tagname") == "select") {
                Position.pin({
                    element: popWin,
                    x: 0,
                    y: "center"
                }, {
                    element: el.next(),
                    x: "100%+10px",
                    y: "center"
                });
            } else if (positionEle) {
                Position.pin({
                    element: popWin,
                    x: 0,
                    y: "center"
                }, {
                    element: positionEle,
                    x: "100%+10px",
                    y: "center"
                });
            } else {
                Position.pin({
                    element: popWin,
                    x: 0,
                    y: "center"
                }, {
                    element: el,
                    x: "100%+10px",
                    y: "center"
                });
            }
        },
        /**
         * 隐藏pop
         * @param {element}    节点
         */
        popMsgHide: function(el) {
            var el = arguments[0].el;
            var popWin = $("#" + el.attr("data-pop"));
            popWin[0] && popWin.css({
                display: "none",
                top: 0,
                left: "300px"
            }) && popWin.find('.ali-tiptext').html(this.get("explainTemplate"));
            el.parents('.' + this.get('itemClass')).css("z-index", this.get("zIndex") - 1);
        },
        addItem: function(cfg) {
            pop_validator.superclass.addItem.apply(this, [].slice.call(arguments));
            return this;
        },
        /*获取ali-form-item元素*/
        getItem: function(ele) {
            ele = $(ele);
            var item = ele.parents("." + this.get("itemClass"));
            return item;
        },
        mouseenter: function(e) {
            var target = $(e.target);
            this.getItem(e.target).addClass(this.get("itemHoverClass"));
        },
        mouseleave: function(e) {
            var target = $(e.target);
            this.getItem(e.target).removeClass(this.get("itemHoverClass"));
        },
        focus: function(e) {
            var target = $(e.target);
            //如果是单选框则不需要focus样式和气泡提示
            if (target.attr("class") == "ui-radio") return;
            //如果是select的替换dom，则选中它的前一个节点就是select
            if (target.hasClass(this.get("selectTrigger"))) {
                target = target.prev();
            }
            var data_explain = target.attr("data-explain") || "";
            this.getItem(target)
                .removeClass(this.get("itemErrorClass"))
                .removeClass(this.get("itemSuccessClass"))
                .removeClass(this.get("itemWarnClass"))
                .removeClass(this.get("itemProblemClass"))
                .addClass(this.get("itemFocusClass"));

            if (data_explain != "") {
                this.popMsgShow({
                    el: target,
                    msg: data_explain
                });
            } else {
                this.popMsgHide({
                    el: target
                });
            }
        },
        blur: function(e) {
            var target = $(e.target);
            //如果是select的替换dom，则选中它的前一个节点就是select
            if (target.hasClass(this.get("selectTrigger"))) {
                target = target.prev();
            }
            this.getItem(target).removeClass(this.get("itemFocusClass"));
            if (target.val() == "") {
                this.popMsgHide({
                    el: target
                });
            }
        },
        /**
         * 特殊处理下拉框的click事件
         * @private
         **/
        selectClick: function(e) {
            var target = $(e.target).prev();
            this.getItem(target)
                .removeClass(this.get("itemErrorClass"))
                .removeClass(this.get("itemSuccessClass"))
                .removeClass(this.get("itemWarnClass"))
                .removeClass(this.get("itemProblemClass"));
            this.popMsgHide({
                el: target
            });
        },
        /**
         * 特殊处理下拉框的blur事件
         * @private
         **/
        selectBlur: function(e) {
            var target = $(e.target).prev();
            this.getItem(target).removeClass(this.get("itemFocusClass"));
            if (target.val() == "") {
                this.popMsgHide({
                    el: target
                });
            }
        }
    });
    module.exports = pop_validator;
});
