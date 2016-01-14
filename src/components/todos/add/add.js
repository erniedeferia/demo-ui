import ko from 'knockout';
import templateMarkup from 'text!./add.html';
import 'jqueryui';
import API from '../../../app/api';
import crossroads from 'crossroads';
import * as router from '../../../app/router';

class ItemsAdd {
    constructor(params) {
        this.fields = this.getFields();
        this.saveHandler = this.save;

    }

    dispose() {
        // This runs when the component is torn down. Put here any logic necessary to clean up,
        // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    }

    getFields() {
        return [
            {id: "item.title", name: "title", label: "Title", type: "string", control: "input", value: "Dynamic vs Static"},
            {id: "item.summary", name: "summary", label: "Summary", type: "string", control: "textarea", value: ""},
            {id: "item.due_date", name: "due_date", label: "Due Date", type: "date", control: "input", value: ""},
            {id: "item.status", name: "status", label: "Status", type: "select", control: "select", value: "Open",
             values: [{code: 'Open', label:'Open'},
                      {code: 'Close', label: 'Close'}]},
            {id: "item.type", name: "type", label: "Type", type: "select", control: "select", value: "Administrative",
             values: [
                 {code: 'FL', label: 'Administrative'},
                 {code: 'FL', label: 'Management'},
                 {code: 'DV', label: 'Technical'},
                 {code: 'PL', label: 'Other'}
             ]},
            {id: "item.location", name: "location", label: "Location", type: "string", control: "input", value: "MIAMI-DADE"}
        ];
    }

    save() {
        API.create(this.fields());
        crossroads.parse("/");
    }

}

//export default { viewModel: CasesAdd, template: templateMarkup };

export default { viewModel: {
    createViewModel: function(params, componentInfo) {
        var m = new ItemsAdd(params);
        m.route = router.currentRoute;
        return  m;
       }
  }, template: templateMarkup };
