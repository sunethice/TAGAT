(function ($) {
    $.fn.cdropdown1 = function (options) { return new $.cdropdown1(this, options) };
    $.cdropdown1 = function (e, options) {
 
        var defaults = {
            _arr: null,
            _default: null
        }
 
        this.options = $.extend(defaults, options);
        this.container = $(e);
        this.setup();
        return this;
    }

    $.cdropdown1.fn = $.cdropdown1.prototype = { cdropdown1: '0.0.1' };
    $.cdropdown1.fn.extend = $.cdropdown1.extend = $.extend;
    $.cdropdown1.fn.extend({

        setup: function () {
            this.container.html(
                '<div id="DropVal" class="SetDropVal">' +
                    '<div id="val"></div>' +
                '</div>' +
                '<div class="SetDropData SetDataEditDropData" style="display:none;">' +
                '</div>'
                );
            this.initialization();
            this.drowElement();
            this.bindEvent();
        },

        initialization: function () {
            var self = this;
            this.divVal = $('#val', this.container);
            this.divDataWrp = $('.SetDropData', this.container);
        },

        bindEvent: function () {
            var self = this;
            this.dropHeight = parseInt(this.divDataWrp.css('height'));
            $('#DropVal', this.container).unbind('click');
            $('#DropVal', this.container).bind('click', function (event) { self.divVal_click(event) });
            this.container.bind('mousedown', function (event) { event.stopPropagation(); })
        },

        disable : function()
        {
            $('#DropVal', this.container).unbind('click');
        },

        enable : function()
        {
            var self = this;
            $('#DropVal', this.container).bind('click', function (event) { self.divVal_click(event) });
        },

        divVal_click: function (event) {
            var self = this;
            if (!$(this.divDataWrp).is(':visible')) {
                event.stopPropagation();
                //this.divDataWrp.css('height', 0);
                $('.SetDropData').each(function (inx, val) {
                    if ($(this).is(':visible')) {
                        $(this).hide();
                        tm = $(this).attr('time');
                        $(document).unbind('click.' + tm);
                    }
                });
                // hide othe open drop downs
                this.divDataWrp.show();
                //this.divDataWrp.animate({ 'height': this.dropHeight }, 200);
                $(this.divDataWrp).slideDown(400, function () {
                });
                $(document).unbind('click.' + this.nwTime);
                this.nwTime = __nowTime()
                $(document).bind('click.' + this.nwTime, function (event) { self.hideDrop(event) });
                this.divDataWrp.attr('time', this.nwTime);
            }
            else {
                $(this.divDataWrp).slideUp(200, function () {
                });
                this.divDataWrp.hide();
                $(document).unbind('click.' + this.nwTime);
            }
        },


        hideDrop: function () {
            $(this.divDataWrp).slideUp("fast", function () {
            });
            //this.divDataWrp.hide();
            $(document).unbind('click.' + this.nwTime);
        },


        drowElement: function () {
            var self = this;
            $.each(this.options._arr, function (inx, val) {
                self.divDataWrp.append('<div id="drop' + inx + '" class="DropR SetDataEditDropRow"></div>');
                _div = $('#drop' + inx, self.divDataWrp).last();
                _div.addClass(val.cls != undefined && val.cls != null ? val.cls : "SetDropRow");
                _div.html(val.txt);
                _div.attr('val', val.val);
                if (inx == self.options._default) {
                    $(self.divVal).addClass(val.cls != undefined && val.cls != null ? val.cls : "SetDropRow");
                    $(self.divVal).html(val.txt);
                    $(self.divVal).attr('val', val.val);
                }
            });
            $('.DropR', this.container).bind('click', function (event) { self.row_click(event) });
        },

        row_click: function (event) {
            event.stopPropagation();
            _val = $(event.currentTarget).attr('val');
            _data = $(event.currentTarget).html();
            _currentVal = $(this.divVal).attr('val')
            if (_currentVal != _val) {
                $(this.divVal).html(_data);
                $(this.divVal).addClass($(event.currentTarget).attr('class'))
                $(this.divVal).attr('val', _val);
                $(this).trigger('click', [_val]);
            }
            this.divVal_click();
        },

        val: function (_val) {
            var self = this;
            if (_val != undefined && _val != null) {
                $.each(this.options._arr, function (inx, val) {
                    if (val.val == _val) {
                        $(self.divVal).html(val.txt);
                        $(self.divVal).addClass(val.cls != undefined && val.cls != null ? val.cls : "SetDropRow")
                        $(self.divVal).attr('val', val.val);
                    }
                });
            }
            else {
                _val = $(this.divVal).attr('val');
                return _val;
            }
        },

        text: function () {
            txt = $(this.divVal).text()
            return txt;
        }
    });
})(jQuery);



(function ($) {
    $.fn.MapViewFilter = function (options) { return new $.MapViewFilter(this, options) };
    $.MapViewFilter = function (e, options) {
        var defaults = {
            _Parent: null
        }
        this.container = $(e);
        this.options = $.extend(defaults, options);
        this.Parent = this.options._Parent;
        this.GridMeta = this.options._Parent.options._gridmeta;
        this.setup();
        return this;
    }

    $.MapViewFilter.fn = $.MapViewFilter.prototype = { MapViewFilter: '0.0.1' };
    $.MapViewFilter.fn.extend = $.MapViewFilter.extend = $.extend;
    $.MapViewFilter.fn.extend({

        setup: function () {
            var self = this;
            this.container.html(
                '<div class="_22ConditionWrp">' +
                '<div class="_22FilterRowWrp">' +
                    '<div class="_22infoLbl _00FormLbl">Select Element :</div><div id="drpEle" class="_22FilterEle"></div>' +
                '</div>' +
                '<div class="_22FilterRowWrp">' +
                    '<div class="_22infoLbl _00FormLbl">Operator :</div><div id="drpCon" class="_22FillOparator"></div>' +
                '</div>' +
                '<div id="drop" class="_22FillOparator"></div>'+
                '<div class="_22FilterRowWrp">' +
                    '<div class="_22infoLbl _00FormLbl">Value :</div><div id="ValueEle" class="_22FilterEle"><input id="valueEletxt" type="text" class="_00FormTxt _24TxtBox"/></div>' +
                '</div>' +
                '<div id="addFilter" class="_00btn _22AddFilter _00btnBlue">Add</div>' +
                '<div id="filtermsg" class="_22Filtermsg"></div>' +
                '<div id="ConditionWrp" class="_22FilterWrp _00DarkForm"></div>' +
                '</div>'
                );
            this.initialization();
            this.assignValue();
            this.bindEvent();
        },

        initialization: function () {
            var self = this;
            this.Operator = [
                { 'val': '-1', "txt": '-Select-', 'symbol': "==" },
                { 'val': 'eq', "txt": '== Equals', 'symbol': "==" },
                { 'val': 'ne', "txt": '!= Not Equals', 'symbol': "!=" },
                { 'val': 'gt', "txt": ' &gt Greater Than', 'symbol': ">" },
                { 'val': 'lt', "txt": '&lt Less Than', 'symbol': "<" }]//,
                //{ 'val': '8', "txt": '~ Contains', 'symbol': "~" }];


//            this.arr = [{'val':'0', 'txt':'aaa'},
//            {'val':'1', 'txt':'bb'},
//            {'val':'2', 'txt':'cc'}];
            
           this.cmbOparator = $('#drpCon', this.container).cdropdown1({ _arr: this.Operator,_default:'-1' });


            this.btnAddFilter = $('#addFilter', this.container);
            this.txtValue = $('#txtvalue', this.container);
            this.divValueEle = $('#ValueEle', this.container);
            this.divConditionWrp = $('#ConditionWrp', this.container);
            this.msg = $('#filtermsg', this.container);

            ignor = [__cLable, __cFileUpload, __cImageTag, __cMap, __cDataGrid, __cCustomEle, __cPicture, __cEmbedEle, __cWysiwyg, __cPam, __cSubmit, __cNote];
            this.cmbEle = $('#drpEle', this.container).TempElementDrop({ _temp: this.Parent.options._data, _ignor: ignor });
           
//            alert('xx')
//             alert($('#drop', this.container).attr('id'))
//               this.add = $('#drop', this.container).dropdown({ _arr: this.arr, _default: "0" });
//                alert('xx2')
        },

        bindEvent: function () {
            var self = this;
            $(this.btnAddFilter).bind('click', function (event) { self.ConditionAdd_click(event) });
            $(this.Parent).bind('conditionAdd', function (event, condition) { self.conditionAdd_trigger(event, condition) });
            $(this.cmbEle).bind('change', function (event, _obj) { self.cmbEle_change(event, _obj) });
        },

        assignValue: function () {
            var self = this;
            if (this.Parent.options._viewobj != null) {
                _savedFilterdCon = this.Parent.options._viewobj.lcondtions;
                $.each(_savedFilterdCon, function (inx, _feilCon) {
                    self.drowConditions(_feilCon);
                });
            }
        },

        cmbEle_change: function (event, _elePath) {
            var self = this;
            if (_elePath != null)
                this.SelectVal = $(this.divValueEle).DrowElement({ _Ele: _elePath.SelectEle });
            else {
                this.SelectVal = $(this.divValueEle).DrowElement({});
                //$(this.divValueEle).html('<input id="valueEletxt" type="text" class="_00FormTxt _24TxtBox"/>');
            }
        },

        ConditionAdd_click: function () {
            if (!this.validation())
                return;
            _meta = this.cmbEle.val();
            _op = this.cmbOparator.val();
            _data = this.SelectVal.val();
            _default = false

            //if (this.Parent.jsMapData.lcondtions.length > 0) {
            //    this.Parent.jsMapData.singleCondition('0', _meta, _op, _data.val, _data.disval);
            //}
            //else {
                this.Parent.jsMapData.singleCondition('0', _meta, _op, _data.val, _data.disval);
            //}
            
        },

        conditionAdd_trigger: function (event, con) {
            this.drowConditions(con);
            this.Parent.jsMapData.newDataSearch();
        },

        drowConditions: function (_con) {
            var self = this;
            if (_con.ConditionType != '0')
                return;
            this.divConditionWrp.append(
                '<div class="_22ucConwrp _00UChover">' +
                    '<div class="_22ucName"></div>' +
                    '<div class="_22ucOprator"></div>' +
                    '<div class="_22ucValue"></div>' +
                    '<div class="_22ucRemove _00Del"></div>' +
                '</div>'
            );
            _div = $('._22ucConwrp', this.divConditionWrp).last();
            $('._22ucName', _div).html(_con.cDisplayLabel);
            _oprator = this.getOparator(_con.cOperator)
            $('._22ucOprator', _div).html(_oprator != null ? _oprator.symbol : "");
            $('._22ucValue', _div).html(_con.cDisplayValue);
            $('._22ucRemove', _div).attr('val', _con.conditionId);
            $('._22ucRemove', _div).bind('click', function (event) { self.removeCondition(event) });
        },

        getOparator: function (_opVal) {
            _obj = null
            $.each(this.Operator, function (inx, val) {
                if (val.val == _opVal) {
                    _obj = val
                    return false;
                }
            });
            return _obj;
        },

        removeCondition: function (event) {
            _conid = $(event.currentTarget).attr('val');
            var _conIndex = null
            $.each(this.Parent.jsMapData.lcondtions, function (inx, val) {
                if (val.conditionId == _conid) {
                    _conIndex = inx;
                    return false
                }
            });
            if (_conIndex != null) {
                this.Parent.jsMapData.lcondtions.splice(_conIndex, 1);
                if (_conIndex > 0)
                    this.Parent.jsMapData.lcondtions.splice(_conIndex - 1, 1);
                $(event.currentTarget).parent().remove();
                
                //this.Parent.jsMapData.newDataSearch();
            }
        },

        validation: function () {
            if (this.cmbEle.val() == undefined) {
                __DisMessage(0, this.msg);
                return false;
            }
            else if (this.cmbOparator.val() == '-1') {
                __DisMessage(1, this.msg);
                return false;
            }
            else {
                return true;
            }
        },
    });
})(jQuery);
