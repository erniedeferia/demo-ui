import ko from 'knockout';
import templateMarkup from 'text!./smartform.html';

class Smartform {
    constructor(params) {
        this.message = ko.observable('Hello from the smartform component!');
        this.fields = ko.observableArray(params.fields);
        this.action = params.actionHanlder;
    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }
}


export default { viewModel: {
    createViewModel: function(params, componentInfo) {
        return new Smartform(params);
       }
  }, template: templateMarkup };
