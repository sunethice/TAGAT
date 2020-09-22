/**
 * 
 * Find more about the Spinning Wheel function at
 * http://cubiq.org/spinning-wheel-on-webkit-for-iphone-ipod-touch/11
 *
 * Copyright (c) 2009 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 * 
 * Version 1.4 - Last updated: 2009.07.09
 * 
 */


(function ($) {
    $.fn.SpinningWheel = function (options) { return new $.SpinningWheel(this, options) };
    $.SpinningWheel = function (e, options) {
        var defaults = {
            _Ele: null,
            _Base: null,
            _DEle: null
        }
        this.options = $.extend(defaults, options);
        this.container = $(e);
        this.cellHeight = 145;
        this.friction = 0.003;
        this.slotData = [];
        this.datectr = [];
        this.element = [];
        return this;
    }

    $.SpinningWheel.fn = $.SpinningWheel.prototype = { SpinningWheel: '0.0.1' };
    $.SpinningWheel.fn.extend = $.SpinningWheel.extend = $.extend;
    $.SpinningWheel.fn.extend({


        /**
        *
        * Event handler
        *
        */

        handleEvent: function (e) {
            if (e.type == 'touchstart') {
                if (e.currentTarget.id == 'sw-frame') {
                    this.lockScreen(e);
                    this.scrollStart(e);
                }
                else {
                    this.tapDown(e);
                }
            } else if (e.type == 'touchmove') {

                if (e.currentTarget.id == 'sw-frame') {
                    this.lockScreen(e);
                    this.scrollMove(e);
                }
                else
                    this.tapCancel(e);
            } else if (e.type == 'touchend') {
                if (e.currentTarget.id == 'sw-frame') {
                    this.scrollEnd(e);
//                    var event = new Event('build');
//                    document.dispatchEvent(event);

                    $(this).trigger('build');
                }
                else
                    this.tapUp(e);
            } else if (e.type == 'webkitTransitionEnd') {
                if (e.target.id == 'sw-wrapper') {
                    this.destroy();
                } else {
                    this.backWithinBoundaries(e);
                }
            } else if (e.type == 'orientationchange') {
                this.onOrientationChange(e);
            } else if (e.type == 'scroll') {
                this.onScroll(e);
            }
        },


        /**
        *
        * Global events
        *
        */

        onOrientationChange: function (e) {
            window.scrollTo(0, 0);
            this.swWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';

            this.calculateSlotsWidth();
        },

        onScroll: function (e) {
            this.swWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';

        },

        lockScreen: function (e) {
            e.preventDefault();
            e.stopPropagation();
        },


        /**
        *
        * Initialization
        *
        */

        reset: function () {
            this.slotEl = [];

            this.activeSlot = null;

            this.swWrapper = undefined;
            this.swSlotWrapper = undefined;
            this.swSlots = undefined;
            this.swFrame = undefined;
        },

        calculateSlotsWidth: function () {
            var div = this.swSlots.getElementsByTagName('div');
            for (var i = 0; i < div.length; i += 1) {
                this.slotEl[i].slotWidth = div[i].offsetWidth;
            }
        },

        create: function (ele) {
            var i, l, out, ul, div;

            this.reset(); // Initialize object variables

            // Create the Spinning Wheel main wrapper
            div = document.createElement('div');
            div.id = 'sw-wrapper';
            div.style.top = '0px'; //window.innerHeight + window.pageYOffset + 'px';		// Place the SW down the actual viewing screen
            div.style.webkitTransitionProperty = '-webkit-transform';
            //div.innerHTML = '<div id="sw-header" class="aa-div-hide"><div id="sw-cancel"></' + 'div><div id="sw-done"></' + 'div></' + 'div><div id="sw-slots-wrapper"><div id="sw-slots"></' + 'div></' + 'div><div id="sw-frame"></' + 'div>';
            div.innerHTML = '<div id="sw-slots-wrapper"><div id="sw-slots"></' + 'div></' + 'div><div id="sw-frame"></' + 'div>';


            //document.body.appendChild(div);
            var divx = document.getElementById(ele);

            $(divx).html(div);

            this.swWrapper = div; 												// The SW wrapper
            this.swSlotWrapper = $('#sw-slots-wrapper', divx)[0]; 	// Slots visible area
            this.swSlots = $('#sw-slots', divx)[0]; 					// Pseudo table element (inner wrapper)
            this.swFrame = $('#sw-frame', divx)[0]; 					// The scrolling controller

            // Create HTML slot elements
            for (l = 0; l < this.slotData.length; l += 1) {
                // Create the slot
                ul = document.createElement('ul');
                out = '';
                for (i in this.slotData[l].values) {
                    out += '<li name="' + l + '_' + this.slotData[l].values[i] + '">' + this.slotData[l].values[i] + '<' + '/li>';
                }
                ul.innerHTML = out;

                div = document.createElement('div'); 	// Create slot container
                div.className = this.slotData[l].style; 	// Add styles to the container
                div.appendChild(ul);

                // Append the slot to the wrapper
                this.swSlots.appendChild(div);

                ul.slotPosition = l; 		// Save the slot position inside the wrapper
                ul.slotYPosition = 0;
                ul.slotWidth = 0;
                ul.slotMaxScroll = this.swSlotWrapper.clientHeight - ul.clientHeight - 86;


                ul.style.webkitTransitionTimingFunction = 'cubic-bezier(0, 0, 0.2, 1)'; 	// Add default transition

                this.slotEl.push(ul); 		// Save the slot for later use
                _propmonths = { '1': 'Jan', '2': 'Feb', '3': 'Mar', '4': 'Apr', '5': 'May', '6': 'Jun',
                '7': 'Jul', '8': 'Aug', '9': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
                };
                // Place the slot to its default position (if other than 0)
                if (this.slotData[l].defaultValue) {
                
                    this.scrollToValue(l, this.slotData[l].defaultValue);
                    _default = this.slotData[l].defaultValue;
//                    if(this.slotData[l].values[1] == "Jan")
//                    {
//                        $('[name="' + l + '_' + _propmonths[_default] + '"]',this.container).addClass('selectedSlot');
//                    }
//                    else
//                    {
//                        $('[name="' + l + '_' + (_default< 10 ? "0" + _default : _default) + '"]',this.container).addClass('selectedSlot');
//                        //was $('[name="' + l + '_' + _default + '"]').addClass('selectedSlot');
//                    //alert('[name="' + l + '_' + this.slotData[l].defaultValue + '"]')
//                    }
                }
            }

            this.calculateSlotsWidth();

            // Global events
            document.addEventListener('touchstart', this, false); 		// Prevent page scrolling
            document.addEventListener('touchmove', this, false); 		// Prevent page scrolling
            //window.addEventListener('orientationchange', this, true); 	// Optimize SW on orientation change
            //window.addEventListener('scroll', this, true); 			// Reposition SW on page scroll

            // Cancel/Done buttons events
            //		document.getElementById('date-cancel').addEventListener('touchstart', this, false);
            //		document.getElementById('date-done').addEventListener('touchstart', this, false);

            // Add scrolling to the slots
            this.swFrame.addEventListener('touchstart', this, false);
        },

        open: function (ele) {
            this.create(ele);
            

            /*this.swWrapper.style.webkitTransitionTimingFunction = 'ease-out';
            this.swWrapper.style.webkitTransitionDuration = '400ms';
            this.swWrapper.style.webkitTransform = 'translate3d(0, -548px, 0)';*/
            //'translate3d(0, -788px, 0)';
        },


        /**
        *
        * Unload
        *
        */

        destroy: function () {


            //this.swWrapper.removeEventListener('webkitTransitionEnd', this, false);

            this.swFrame.removeEventListener('touchstart', this, false);

            document.getElementById('date-cancel').removeEventListener('touchstart', this, false);
            document.getElementById('date-done').removeEventListener('touchstart', this, false);

            document.removeEventListener('touchstart', this, false);
            document.removeEventListener('touchmove', this, false);
            window.removeEventListener('orientationchange', this, true);
            window.removeEventListener('scroll', this, true);


            this.slotData = [];
            this.cancelAction = function () {
                return false;
            };

            this.cancelDone = function () {
                return true;
            };


            this.reset();



            //document.body.removeChild(document.getElementById('sw-wrapper'));

        },

        close: function () {
            /*this.swWrapper.style.webkitTransitionTimingFunction = 'ease-in';
            this.swWrapper.style.webkitTransitionDuration = '400ms';
            this.swWrapper.style.webkitTransform = 'translate3d(0, 0, 0)';
		
            this.swWrapper.addEventListener('webkitTransitionEnd', this, false);*/

            this.destroy();

        },


        /**
        *
        * Generic methods
        *
        */

        addSlot: function (values, style, defaultValue) {


            if (!style) {
                style = '';
            }

            style = style.split(' ');

            for (var i = 0; i < style.length; i += 1) {
                style[i] = 'sw-' + style[i];
            }

            style = style.join(' ');

            var obj = { 'values': values, 'style': style, 'defaultValue': defaultValue };
            this.slotData.push(obj);
        },

        getSelectedValues: function () {
            var index, count,
		    i, l,
			keys = [], values = [];
            for (i in this.slotEl) {
                // Remove any residual animation
                this.slotEl[i].removeEventListener('webkitTransitionEnd', this, false);
                this.slotEl[i].style.webkitTransitionDuration = '0';

                if (this.slotEl[i].slotYPosition > 0) {
                    this.setPosition(i, 0);
                } else if (this.slotEl[i].slotYPosition < this.slotEl[i].slotMaxScroll) {
                    this.setPosition(i, this.slotEl[i].slotMaxScroll);
                }

                index = -Math.round(this.slotEl[i].slotYPosition / this.cellHeight);

                count = 0;
                for (l in this.slotData[i].values) {
                    if (count == index) {
                        keys.push(l);
                        values.push(this.slotData[i].values[l]);
                        break;
                    }

                    count += 1;
                }
            }

            return { 'keys': keys, 'values': values };
        },


        /**
        *
        * Rolling slots
        *
        */

        setPosition: function (slot, pos) {

            this.slotEl[slot].slotYPosition = pos;
            this.slotEl[slot].style.webkitTransform = 'translate3d(0, ' + pos + 'px, 0)';

        },

        scrollStart: function (e) {
            // Find the clicked slot
            $('.selectedSlot', this.container).removeClass('selectedSlot')
            offleft = $(this.swWrapper).parent().offset().left;
            //alert(e.targetTouches[0].clientX + '- ' + this.swSlots.offsetLeft)
            var xPos = e.targetTouches[0].clientX - this.swSlots.offsetLeft - offleft; // Clicked position minus left offset (should be 11px)

            // Find tapped slot
            var slot = 0;
            for (var i = 0; i < this.slotEl.length; i += 1) {
                slot += this.slotEl[i].slotWidth;

                if (xPos < slot) {
                    this.activeSlot = i;
                    break;
                }
            }

            // If slot is readonly do nothing
            if (this.slotData[this.activeSlot].style.match('readonly')) {
                this.swFrame.removeEventListener('touchmove', this, false);
                this.swFrame.removeEventListener('touchend', this, false);
                return false;
            }

            this.slotEl[this.activeSlot].removeEventListener('webkitTransitionEnd', this, false); // Remove transition event (if any)
            this.slotEl[this.activeSlot].style.webkitTransitionDuration = '0'; 	// Remove any residual transition

            // Stop and hold slot position
            var theTransform = window.getComputedStyle(this.slotEl[this.activeSlot]).webkitTransform;
            theTransform = new WebKitCSSMatrix(theTransform).m42;
            if (theTransform != this.slotEl[this.activeSlot].slotYPosition) {
                this.setPosition(this.activeSlot, theTransform);
            }

            this.startY = e.targetTouches[0].clientY;
            this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition;
            this.scrollStartTime = e.timeStamp;

            this.swFrame.addEventListener('touchmove', this, false);
            this.swFrame.addEventListener('touchend', this, false);

            return true;
        },

        scrollMove: function (e) {
            var topDelta = e.targetTouches[0].clientY - this.startY;

            if (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
                topDelta /= 2;
            }

            this.setPosition(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition + topDelta);
            this.startY = e.targetTouches[0].clientY;

            // Prevent slingshot effect
            if (e.timeStamp - this.scrollStartTime > 80) {
                this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition;
                this.scrollStartTime = e.timeStamp;
            }

        },

        scrollEnd: function (e) {
            var self = this;
            this.swFrame.removeEventListener('touchmove', this, false);
            this.swFrame.removeEventListener('touchend', this, false);

            // If we are outside of the boundaries, let's go back to the sheepfold
            if (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
                this.scrollTo(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition > 0 ? 0 : this.slotEl[this.activeSlot].slotMaxScroll);
                this.sprinSet();
                return false;
            }

            // Lame formula to calculate a fake deceleration
            var scrollDistance = this.slotEl[this.activeSlot].slotYPosition - this.scrollStartY;

            // The drag session was too short
            if (scrollDistance < this.cellHeight / 1.5 && scrollDistance > -this.cellHeight / 1.5) {
                if (this.slotEl[this.activeSlot].slotYPosition % this.cellHeight) {
                    this.scrollTo(this.activeSlot, Math.round(this.slotEl[this.activeSlot].slotYPosition / this.cellHeight) * this.cellHeight, '200ms');
                }

                this.sprinSet();
                return false;
            }

            var scrollDuration = e.timeStamp - this.scrollStartTime;

            var newDuration = (2 * scrollDistance / scrollDuration) / this.friction;
            var newScrollDistance = (this.friction / 2) * (newDuration * newDuration);

            if (newDuration < 0) {
                newDuration = -newDuration;
                newScrollDistance = -newScrollDistance;
            }

            var newPosition = this.slotEl[this.activeSlot].slotYPosition + newScrollDistance;

            if (newPosition > 0) {
                // Prevent the slot to be dragged outside the visible area (top margin)
                newPosition /= 2;
                newDuration /= 3;

                if (newPosition > this.swSlotWrapper.clientHeight / 4) {
                    newPosition = this.swSlotWrapper.clientHeight / 4;
                }
            } else if (newPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
                // Prevent the slot to be dragged outside the visible area (bottom margin)
                newPosition = (newPosition - this.slotEl[this.activeSlot].slotMaxScroll) / 2 + this.slotEl[this.activeSlot].slotMaxScroll;
                newDuration /= 3;

                if (newPosition < this.slotEl[this.activeSlot].slotMaxScroll - this.swSlotWrapper.clientHeight / 4) {
                    newPosition = this.slotEl[this.activeSlot].slotMaxScroll - this.swSlotWrapper.clientHeight / 4;
                }
            } else {
                newPosition = Math.round(newPosition / this.cellHeight) * this.cellHeight;
            }

            this.scrollTo(this.activeSlot, Math.round(newPosition), Math.round(newDuration) + 'ms');
            this.sprinSet();

            return true;
        },

        scrollTo: function (slotNum, dest, runtime) {
            this.slotEl[slotNum].style.webkitTransitionDuration = runtime ? runtime : '100ms';
            this.setPosition(slotNum, dest ? dest : 0);

            // If we are outside of the boundaries go back to the sheepfold
            if (this.slotEl[slotNum].slotYPosition > 0 || this.slotEl[slotNum].slotYPosition < this.slotEl[slotNum].slotMaxScroll) {
                this.slotEl[slotNum].addEventListener('webkitTransitionEnd', this, false);
            }


        },

        scrollToValue: function (slot, value) {
            var yPos, count, i;

            this.slotEl[slot].removeEventListener('webkitTransitionEnd', this, false);
            this.slotEl[slot].style.webkitTransitionDuration = '0';

            count = 0;
            for (i in this.slotData[slot].values) {
                if (i == value) {
                    yPos = count * this.cellHeight;
                    this.setPosition(slot, yPos);
                    break;
                }

                count -= 1;
            }

        },

        backWithinBoundaries: function (e) {
            e.target.removeEventListener('webkitTransitionEnd', this, false);

            this.scrollTo(e.target.slotPosition, e.target.slotYPosition > 0 ? 0 : e.target.slotMaxScroll, '150ms');
            return false;
        },


        /**
        *
        * Buttons
        *
        */

        tapDown: function (e) {
            e.currentTarget.addEventListener('touchmove', this, false);
            e.currentTarget.addEventListener('touchend', this, false);
            //e.currentTarget.className = 'sw-pressed';
        },

        tapCancel: function (e) {
            e.currentTarget.removeEventListener('touchmove', this, false);
            e.currentTarget.removeEventListener('touchend', this, false);
            //e.currentTarget.className = '';
        },

        tapUp: function (e) {
            this.tapCancel(e);

            if (e.currentTarget.id == 'date-cancel') {

                $(e.currentTarget).trigger("click");

                //this.cancelAction();

            } else {

                //this.doneAction();

                $(e.currentTarget).trigger("click", [this.getSelectedValues()]);
                /*
                var results = this.getSelectedValues();   
                // document.getElementById('result').innerHTML = 'values: ' + results.values.join(' ') + '<br />keys: ' + results.keys.join('/ '); 
                this.datectr.val(results.keys.join('/').toString());
                this.element.OnChanged('event') */
            }
            /*this.close();*/
        },

        setCancelAction: function (action) {
            this.cancelAction = action;
        },

        setDoneAction: function (action) {

            this.doneAction = action;
        },

        cancelAction: function () {
            return false;
        },

        cancelDone: function () {
            return true;
        },

        sprinSet: function () {
            var self = this;
//            setTimeout(function () {
//                val = self.getSelectedValues();
//                for (i = 0; i < val.values.length; i++) {
//                    $('[name="' + i + '_' + val.values[i] + '"]',self.container).addClass('selectedSlot');
//
//                }
////                var event = new Event('build');
////                document.dispatchEvent(event);
//                $(self).trigger('build')
//            }, 500);
            
            $(self).trigger('build')
        }

    });
})(jQuery);
