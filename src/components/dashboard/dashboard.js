import ko from 'knockout';
import dashboardTemplate from 'text!./dashboard.html';
import * as router from '../../app/router';

class Dashboard {
    constructor(route) {
        this.message = ko.observable('Welcome to your Dashboard');

        this.route = router.currentRoute;
    }

    doSomething() {
        this.message('You invoked doSomething() on the viewmodel.');
    }
}

export default { viewModel: Dashboard, template: dashboardTemplate };
