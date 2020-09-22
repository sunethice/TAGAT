
(function ($) {
    $.fn.UCGridViewFilter = function (options) { return new $.UCGridViewFilter(this, options) };
    $.UCGridViewFilter = function (e, options) {
        var defaults = {
            _Parent: null
        }
        this.container = $(e);
        this.options = $.extend(defaults, options);
        this.parent = this.options._Parent;
        $(e).append(
            '<div class="GridUcWrp">' +
                '<div id="remove" class="gridViewCheck">' +
                    '<input  id="eleSelect" type="checkbox" class="ccheckbox"/>' +
                '</div>' +
                '<div class="GridEleName _00DropParent">' +
                    '<div id="val" class="_00DrowElePathVal">' +
                        '<div id="eleTitle" style="width: calc(100% - 10px);" class="_00EName">Name</div>' +
                    '</div>' +
                '</div>' +
                '<div id="eleLable" class="GridEleLable">' +
                    '<div id="eleLableVal"></div>' +
                    //'<input id="eleLableVal" type="text"/>'+
                '</div>' +
                '<div id="elePath" class="GridEleLable">Path</div>' +
            '</div>'
        );
        this.container = $('.GridUcWrp', $(e)).last();
        this.initialize();
        return this;
    }

    $.UCGridViewFilter.fn = $.UCGridViewFilter.prototype = { UCGridViewFilter: '0.0.1' };
    $.UCGridViewFilter.fn.extend = $.UCGridViewFilter.extend = $.extend;
    $.UCGridViewFilter.fn.extend({

        initialize: function () {
            this.divEleLableVal = $("#eleLableVal", this.container);
            this.divEleTitle = $("#eleTitle", this.container);
            this.divElePath = $("#elePath", this.container);
            this.divEleSelect = $("#eleSelect", this.container);
            this.assignValues();
            this.bindEvents();
        },

        assignValues: function () {
            this.divEleTitle.text(this.options._data.text);
            //this.divEleLableVal.val(this.options._data.lable);
            this.divEleLableVal.text(this.options._data.lable);
            this.divElePath.text(this.options._data.path);
            if (this.options._data.selected) {
                this.divEleSelect.attr('checked', true);
            }
            else {
                this.divEleSelect.attr('checked', false);
            }
        },

        bindEvents: function () {
            var self = this;
            this.divEleSelect.bind('click', function (event) { self.CheckBox_click(event, self.options._data.eleID); });
            this.divEleLableVal.bind('change', function (event) { self.InputLbl_change(); });
        },

        CheckBox_click: function (event, eleID) {
            this.parent.updateSelectedList(eleID);
        },

        InputLbl_change: function () {

        }
    });
})(jQuery);
