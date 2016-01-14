import ko from 'knockout';
import crossroads from 'crossroads';
import hasher from 'hasher';


class Router {
    constructor(config) {
        this.currentRoute = ko.observable({});

        // Configure Crossroads route handlers
        ko.utils.arrayForEach(config.routes, (route) => {
            crossroads.addRoute(route.url, (requestParams) => {
                this.currentRoute(ko.utils.extend(requestParams, route.params));
            });
        });

        // Activate Crossroads
        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
        hasher.initialized.add(hash => crossroads.parse(hash));
        hasher.changed.add(hash => crossroads.parse(hash));
        hasher.init();
    }
}

// Create and export router instance
// IMPORTANT: The "page:" value identifies the name of the ko component as
// defined and registered in startup.js
var routerInstance = new Router({
    routes: [
        { url: '',                params: { page: 'dashboard' } },
        { url: 'help',            params: { page: 'help' } },
        { url: 'todo/new',       params: { page: 'todos-add' } },
        { url: 'todo/show/{id}', params: { page: 'todos-index'} }

    ]
});

export default routerInstance;
