
(function ($) {
    $.fn.MapSelectElement = function (options) { return new $.MapSelectElement(this, options) };
    $.MapSelectElement = function (e, options) {
        var defaults = {
            _Parent: null
        }
        this.container = $(e);
        this.options = $.extend(defaults, options);
        this.Parent = this.options._Parent;
        this.GridMeta = this.options._Parent.options._gridmeta;
        this.hashAllEleLbel = new Hashtable();
        this.hashAllEventEle = new Hashtable();
        this.AllDateEle = new Hashtable();
        var self = this;
        setTimeout(function(){self.setup()}, 1);
        return this;
    }

    $.MapSelectElement.fn = $.MapSelectElement.prototype = { MapSelectElement: '0.0.1' };
    $.MapSelectElement.fn.extend = $.MapSelectElement.extend = $.extend;
    $.MapSelectElement.fn.extend({

        setup: function () {
            var self = this;
            this.container.html(
                '<div  id="SelectEventWrp" class="_22SelectEventWrp">' +
                    '<div id="EventHdr" class="_22EventHdr _00GridHdr">' +
                            '<div class="_22DateEleHdr">Date Time Element</div>' +
                            '<div class="_22DisplayEleHdr">Display Value</div>' +
                    '</div>' +
                    '<div id="EventContent" class="_22EventContent"></div>' +
                '</div>'
                );
            this.initialization();
            this.assignValue();
            this.drowMapEle();
        },

        initialization: function () {
            var self = this;
            this.divSelectEventWrp = $('#SelectEventWrp', this.container);
            this.divHdrContent = $('#EventHdr', this.container);
            this.divEventContent = $('#EventContent', this.container);
        },
        
        assignValue: function () {
            var self = this;
            if (this.Parent.options._viewobj != null) {
                _DisplayAllSetting = this.Parent.options._viewobj.DisplayAllSetting;
                $.each(_DisplayAllSetting, function (inx, _obj) {
                    self.hashAllEventEle.put(_obj.id, _obj);
                });
            }
        },

        drowMapEle: function () {
            var self = this;
            _hasMapEle = false;
            $.each(this.GridMeta, function (inx, _val) {
                var obj = {};
                //if (_val.elobj != undefined && _val.elobj != null) {
                    switch (_val.cSElementType) {
                        case '12':
                            self.DrowAllMapEle(_val.cSElementId);
                            _hasMapEle = true;
                            break;
                        default:
                            break
                    }
                    obj.id = _val.cSElementId;
                    obj.label = _val.cSElementLable;
                    obj.type = _val.cSElementType;
                    self.hashAllEleLbel.put(obj.id, obj)
                //}
//                else {
//                    if (_val.coltitle == "Document Title") {
//                        self.defaultID = _val.id;
//                    }
//                }
            });

            var obj = {};
            obj.id = 'docid';
            obj.label = "Document ID";
            self.hashAllEleLbel.put(obj.id, obj)
            obj.id = 'docname';
            obj.label = "Document Title";
            self.hashAllEleLbel.put(obj.id, obj)
            if (_hasMapEle) {
                this.generateValue();
            }
            else {
                this.divEventContent.html('<div class="_22NoMsgContent"><div id="NoMsg" class="_22NoMsg"></div></div>')
                //__DisMessage(3, $('#NoMsg', self.divfuncWrpNew));
                return;
            }
        },

        destroyed: function () {
            // $(_connection).unbind('NewObjAdd');
        },



        DrowAllMapEle: function (_eleID) {
            var self = this;
            this.divEventContent.append(
                '<div id="ele' + _eleID + '" class="_22UCEventWrp">' +
                '<div class="_22DateEle"></div>' +
                '<div class="_22DisplayEle"></div>' +
                '<div class="_22EventColor"></div>' +
                '</div>');

            _selectVal = this.hashAllEventEle.get(_eleID)
            var _divEvent = $('#ele' + _eleID, this.divEventContent).last();
            var _elePath = $('._22DateEle', _divEvent).DrowElementPath({ _temp: this.Parent.options._data, _default: _eleID })
            var _eleDisply = $('._22DisplayEle', _divEvent).TempElementDrop({ _temp: this.Parent.options._data, _default: _selectVal != undefined ? _selectVal.DisplayObjs : ['docname'], _multiSelect: true , _sys:true });
            _color = _selectVal != undefined ? _selectVal.DisColor : __randomColor();
            $('._22EventColor', _divEvent).attr('color', _color)
            var DisColor = $('._22EventColor', _divEvent).minicolors({
                control: $(this).attr('data-control') || 'hue',
                defaultValue: _color,
                format: $(this).attr('data-format') || 'hex',
                keywords: $(this).attr('data-keywords') || '',
                inline: false,
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: 'bottom right',
                change: function (hex, opacity) {
                    var log;
                    $(this).attr('color', hex);
                    //$(this).trigger('change',hex);
                    //try {
                    //    log = hex ? hex : 'transparent';
                    //    if (opacity) log += ', ' + opacity;
                    //    console.log(log);
                    //} catch (e) { }
                },
                theme: 'default'
            });
            _obj = {};
            _obj.DivWrp = _divEvent;
            _obj.DateElePath = _elePath;
            _obj.DisplayElePath = _eleDisply;
            this.AllDateEle.put(_eleID, _obj);
            if (this.Parent.options._viewobj == null) {
  
                this.Parent.hashDisplayEle.put(_eleID, _eleID)
            }
        },

        generateValue: function () {
            var self = this;
            self.hashAllEventEle = new Hashtable();
            //alert(JSON.stringify(this.AllDateEle.values()));
            $.each(this.AllDateEle.values(), function (inx, val) {
                var obj = {};
                obj.id = val.DateElePath.SetPath.cSElementId;
                obj.Label = val.DateElePath.SetPath.cSElementLable;
                obj.PathObj = val.DateElePath.SetPath;
                obj.DisColor = $('._22EventColor', '#ele' + val.DateElePath.SetPath.cSElementId).attr('color');
                obj.DisplayObjs = val.DisplayElePath.val();
                if (obj.DisplayObjs != undefined && obj.DisplayObjs != null && obj.DisplayObjs.length == 0)
                    obj.DisplayObjs.push('docname')

                self.hashAllEventEle.put(obj.id, obj);
            });
            
            //alert('generateSuccess' + JSON.stringify(self.hashAllEventEle.values()))
            
            //this.Parent.drowFuncElement();
            $(self).trigger('generateSuccess');
        },
    });
})(jQuery);
