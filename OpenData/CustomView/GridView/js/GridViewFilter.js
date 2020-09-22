
(function ($) {
    $.fn.GridViewFilter = function (options) { return new $.GridViewFilter(this, options) };
    $.GridViewFilter = function (e, options) {
        var defaults = {
            _Parent: null,
            _SelectFieldList: null,
            _Temp: null
        }
        this.container = $(e);
        this.options = $.extend(defaults, options);
        this.Parent = this.options._Parent;
        this.setup();
        return this;
    }

    $.GridViewFilter.fn = $.GridViewFilter.prototype = { GridViewFilter: '0.0.1' };
    $.GridViewFilter.fn.extend = $.GridViewFilter.extend = $.extend;
    $.GridViewFilter.fn.extend({

        setup: function () {
            var self = this;
            this.container.html(
                '<div class="_22ConditionWrp">' +
                    '<div class="_22FilterRowWrp">' +
                        '<div class="_22infoLbl _00FormLbl">Select Element :</div><div id="drpEle" class="_22FilterEle"></div>' +
                    '</div>' +
                    '<div id="gridEleList" class="GridEleListWrp"></div>' +
                '</div>'
                );
            this.initialization();
            this.assignValue();
            //this.bindEvent();
        },

        initialization: function () {
            this.divGridEleList = $("#gridEleList", this.container);
        },

        bindEvent: function () {
            var self = this;
        },

        assignValue: function () {
            var self = this;
            this.divGridEleList.UCGridViewFilter({ _Parent: self, _data: { "eleID": "TempID", "selected": ($.inArray("TempID", this.options._SelectFieldList) > -1), "text": "Template ID", "lable": "Template ID", "path": "NA" } });
            this.divGridEleList.UCGridViewFilter({ _Parent: self, _data: { "eleID": "TempName", "selected": ($.inArray("TempName", this.options._SelectFieldList) > -1), "text": "Template Name", "lable": "Template Name", "path": "NA" }});
            this.divGridEleList.UCGridViewFilter({ _Parent: self, _data: { "eleID": "TempCreatedDate", "selected": ($.inArray("TempCreatedDate", this.options._SelectFieldList) > -1), "text": "Template Created Date", "lable": "Template Created Date", "path": "NA" }});
            this.divGridEleList.UCGridViewFilter({ _Parent: self, _data: { "eleID": "TempLastEditedDate", "selected": ($.inArray("TempLastEditedDate", this.options._SelectFieldList) > -1), "text": "Template Last Edited Date", "lable": "Template Last Edited Date", "path": "NA" }});

            this.divGridEleList.UCGridViewFilter({ _Parent: self, _data: { "eleID": "DocID", "selected": ($.inArray("DocID", this.options._SelectFieldList) > -1), "text": "Document ID", "lable": "Document ID", "path": "NA" }});
            this.divGridEleList.UCGridViewFilter({ _Parent: self, _data: { "eleID": "DocName", "selected": ($.inArray("DocName", this.options._SelectFieldList) > -1), "text": "Document Title", "lable": "Document Title", "path": "NA" }});
            this.divGridEleList.UCGridViewFilter({ _Parent: self, _data: { "eleID": "DocCreatedDate", "selected": ($.inArray("DocCreatedDate", this.options._SelectFieldList) > -1), "text": "Document Created Date", "lable": "Created On", "path": "NA" }});
            this.divGridEleList.UCGridViewFilter({ _Parent: self, _data: { "eleID": "DocLastEditedDate", "selected": ($.inArray("DocLastEditedDate", this.options._SelectFieldList) > -1), "text": "Document Last Edited Date", "lable": "Modified On", "path": "NA" }});

            this.drawEleObject(this.options._Temp.cLFormList);
        },

        drawEleObject: function (pFormList) {
            var self = this;
            $.each(pFormList, function (inx, _form) {
                $.each(_form.cLSectionList, function (inx, _sec) {
                    $.each(_sec.cLElementList, function (inx, _ele) {
                        obj = {};
                        obj.eleID = _ele.cSElementId;
                        obj.selected = ($.inArray(_ele.cSElementId, self.options._SelectFieldList) > -1);
                        obj.text = _ele.cSElementName;
                        obj.lable = _ele.cSElementLable;
                        obj.path = _form.cSFormName + " | " + _sec.cSSectionName;
                        self.divGridEleList.UCGridViewFilter({ _Parent: self, _data: obj });
                    });
                });
            });
        },

        updateSelectedList: function (eleID) {
            if ($.inArray(eleID, this.options._SelectFieldList) > -1)
                this.options._SelectFieldList.splice(this.options._SelectFieldList.indexOf(eleID), 1);
            else
                this.options._SelectFieldList.push(eleID);
        }
    });
})(jQuery);
