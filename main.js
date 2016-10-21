/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global $, window, document */


(function () {
    var oldAEL = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function () {
        var wrapfn, fn;
        console.log("event listned to");

        if (typeof arguments[1] === "function") {
            //wrap it up
            fn = arguments[1]
            wrapfn = function (e) {
                fn.apply(this, arguments);
            }

            arguments[1] = wrapfn;
        }

        oldAEL.apply(this, arguments);
    }
    
    

})()

$(function () {
    //"use strict";

    function retriveHash() {
        return window.location.hash;
    }

    //modal system
    var modal = (function modal() {
        var modal = $("div.modal"),
            modal_links = $("a.modal-link"),
            modal_close = $("a.modal-close"),
            modal_toggle,
            modal_active = $("div.modal").hasClass("active"),
            modal_hide, modal_active_target = "",
            modals, modal_map = {},
            hash;

        modal_toggle = function (target) {
            var elTarget, elActiveTarget;
            console.log("target is " + target);

            //look up target
            if (modal_map.hasOwnProperty(target)) {
                elTarget = modal_map[target];
            } else {
                //no valid modal state exist, stop doing anything else
                throw new Error("cannot switch to modal " + target + " because it doesn't exist");
            }

            //look up active target
            if (modal_map.hasOwnProperty(modal_active_target)) {
                elActiveTarget = modal_map[modal_active_target];
            } else {
                //no valid modal state exist, stop doing anything else
                throw new Error("cannot switch because activeTarget (" + modal_active_target + ") is corrupt.");
            }
            if (!modal_active) {
                //activate modal
                modal.addClass("active");
                modal_active = true;
            }

            //we are already active, so this means we are just switching what is active.
            if (modal_active_target !== target) {
                //switch
                if (!modal.hasClass(target)) {
                    //remove old class
                    modal.removeClass(modal_active_target);
                    modal.addClass(target);
                    modal_active_target = target;
                }

                if (elActiveTarget.hasClass("active")) {
                    elActiveTarget.removeClass("active");
                }

                elTarget.addClass("active");
            }

            modal.scrollTop(0);
        };


        modal_hide = function () {
            if (modal_active) {
                //hide
                modal.removeClass("active");
                modal_active = false;
            }
        };

        function click_maker(elm, happen) {
            $(elm).click(function (e) {
                happen(e);
                e.preventDefault();
                return false;
            });
        }


        console.log("links")
        modal_links.each(function (i, e) {
            var target = $(e).data('modal');
            click_maker(e, function () {
                modal_toggle(target);
            });
            console.log("hiii " + target);
        });


        console.log("close");
        modal_close.each(function (i, e) {
            click_maker(e, function () {
                modal_hide();
            });
        });

        modals = $("div.modal>article");
        modals.each(function (i, e) {
            var elm, id;
            elm = $(e);
            id = elm.attr("modal-name");
            if (id != null && !modal_map.hasOwnProperty(id)) {
                //add it to the map
                modal_map[id] = elm;
                if (elm.hasClass("active")) {
                    modal_active_target = elm;
                }
            }
        });

        //retrive state from modal
        for (var i in modal_map) {
            if (modal_map.hasOwnProperty(i)) {
                if (modal.hasClass(i)) {
                    modal_active_target = i;
                    console.log("modal active target is " + modal_active_target);
                    break;
                }
            }
        }

        //from hash, see if any of the modals are active
        hash = retriveHash();
        hash = (hash == "") ? "" : hash.slice(1);
        console.log("hash " + hash);
        if (modal_map.hasOwnProperty(hash)) {
            console.log("modal state is " + hash);
            modal_toggle(hash);
        }

        console.log("done");
        return {
            hide: function () {
                modal_hide();
                return modal_active;
            },

            state: function () {
                return modal_active;
            },

            target: function () {
                return modal_target;
            },

            handleHistory: function () {

            },

            swap: function (target) {
                modal_toggle(target);
                return modal_active_target;
            }
        }
    })();


    var flashes = (function flasher() {})();

    window.bye = function () {
        return modal.hide();
    }


    return false;
});
