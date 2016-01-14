import * as Modernizr from './modernizr';
import * as classie from './classie';

class Misc {

    constructor(params) {

        new classie.Classie();
        this.Modernizr = window.Modernizr;
        this.searchvisible = 0;
        this.transEndEventName = {
                'WebkitTransition': 'webkitTransitionEnd',
                'MozTransition': 'transitionend',
                'OTransition': 'oTransitionEnd',
                'msTransition': 'MSTransitionEnd',
                'transition': 'transitionend'

        };
        this.overlay = document.querySelector( 'div.overlay' );
        this.support = { transitions : window.Modernizr.csstransitions };
        this.initTransitions();
    }


    searchClick(item, event) {
        var e = event.target;
        var val = $('#search-icon');
        if(val.hasClass('ion-ios-search-strong')){
            val.addClass('ion-ios-close-empty');
            val.removeClass('ion-ios-search-strong');
        }
        else{
            val.removeClass('ion-ios-close-empty');
            val.addClass('ion-ios-search-strong');
        }


        if (this.menu_misc.searchvisible ===0) {
            //Search is currently hidden. Slide down and show it.
            $("#search-form").slideDown(200);
            $("#s").focus(); //Set focus on the search input field.
            this.menu_misc.searchvisible = 1; //Set search visible flag to visible.
        }

        else {
            //Search is currently showing. Slide it back up and hide it.
            $("#search-form").slideUp(200);
            this.menu_misc.searchvisible = 0;
        }

    }


    toggleOverlay(item, event) {

        var self = this.menu_misc;

        if( window.classie.has( self.overlay, 'open' ) ) {
            window.classie.remove( self.overlay, 'open' );
            window.classie.add( self.overlay, 'close' );
            var onEndTransitionFn = function( ev ) {
                console.log("inside onEndTransitsionFn");
                if( self.support.transitions ) {
                    if( ev.propertyName !== 'visibility' ) return;
                    event.target.removeEventListener( self.transEndEventName, onEndTransitionFn );
                }
                window.classie.remove( self.overlay, 'close' );
            };
            if( self.support.transitions ) {
                self.overlay.addEventListener( self.transEndEventName, onEndTransitionFn );
            }
            else {
                onEndTransitionFn();
            }
        }
        else if( !window.classie.has( self.overlay, 'close' ) ) {
            window.classie.add( self.overlay, 'open' );
        }
    }


    initTransitions() {
        this.transEndEventName = this.transEndEventName[ this.Modernizr.prefixed( 'transition' ) ];
    }

};

export default {Misc};
