import 'jquery';
import 'bootstrap';
import ko from 'knockout';
import 'knockout-projections';
import * as router from './router';
import 'moment';
import 'jqueryui';
import * as api from './api';



var viewModelMenuLoader = {
    loadViewModel: function(name, viewModelConfig, callback) {
        if (viewModelConfig.menu) {
            var viewModelConstructor = function(params)
            {
                params["menu"] = viewModelConfig.menu;
                params["route"] = router.currentRoute;
                return new viewModelConfig.model(params);
            };

            ko.components.defaultLoader.loadViewModel(name,
                                                      viewModelConstructor,
                                                      callback);
        } else {
            callback(null);
        }
    }
};


ko.components.loaders.unshift(viewModelMenuLoader);

// Define binding handlers...
ko.bindingHandlers.enterkey = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        var callback = valueAccessor();
        $(element).keypress(function (event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === 13) {
                callback.call(viewModel);
                return false;
            }
            return true;
        });
    }
};


ko.bindingHandlers.masked = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        var mask = allBindingsAccessor().mask || {};
        $(element).mask(mask);
        ko.utils.registerEventHandler(element, 'blur', function() {
            var observable = valueAccessor();
            observable($(element).val());
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).val(value);
    }
};


ko.bindingHandlers.datepicker = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || {};
        $(element).datepicker(options);
        /*
        //handle the field changing
        ko.utils.registerEventHandler(element, "change", function () {
            var observable = valueAccessor();
            observable($(element).datepicker("getDate"));
        });

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).datepicker("destroy");
        });
         */
    },
    //update the control when the view model changes
    update: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).datepicker("setDate", value);
    }
};


// Register components here
// Components can be packaged as AMD modules, such as the following:
ko.components.register('main-menu',
                       { require: 'components/main-menu/main-menu' });
ko.components.register('dashboard',
                       { require: 'components/dashboard/dashboard' });

// ... or for template-only components, you can just point to a .html file directly:
ko.components.register('help',
                       { template:
                         { require: 'text!components/help/help.html' }
});


ko.components.register('dashboard-element',
                       { require: 'components/dashboard-element/dashboard-element' });


ko.components.register('todo-list',
                       { require: 'components/todo-list/todo-list' });

ko.components.register('todos-add',
                       { require: 'components/todos/add/add', synchronous: true });

ko.components.register('smartform',
                       { require: 'components/core/smartform/smartform' });

ko.components.register('todos-index',
                         { require: 'components/todos/index' });

ko.components.register('todo-menu',
                       { require: 'components/todo-menu/todo-menu' });

// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

// Start the application
ko.applyBindings({ route: router.currentRoute });
