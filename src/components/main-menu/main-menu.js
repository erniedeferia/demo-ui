import ko from 'knockout';
import template from 'text!./main-menu.html';
import * as misc from '../../app/misc';

class MainMenuViewModel {
    constructor(params) {
        // This viewmodel doesn't do anything except pass through the 'route' parameter to the view.
        // You could remove this viewmodel entirely, and define 'main-menu' as a template-only component.
        // But in most apps, you'll want some viewmodel logic to determine what navigation options appear.
        if( typeof params !== 'undefined' && typeof params.route !== 'undefined' )
            this.route = params.route;

        //
        // We instantiate this for its side effect only which applies to the
        // already rendered menu DOM element; specifically the search control
        // and mobile menu.
        //
        this.menu_misc  = new misc.Misc();
    }


    search() {
        console.log("search delegate...");
    }
}

export default { viewModel: MainMenuViewModel, template: template };
