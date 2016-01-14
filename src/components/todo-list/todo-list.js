import ko from 'knockout';
import templateMarkup from 'text!./todo-list.html';
import crossroads from 'crossroads';
import API from '../../app/api';


class TodoList {
    constructor(params) {
        this.items = ko.observableArray([]);
        this.greetings = ko.observable("You don't have any items yet. Would you like to create one?");
        this.init();
    }

    init() {
        var self = this;
        API.list("").then(function(data) {
            for(var i=0; i<data.total_rows;i++) {
                self.items.push(data.rows[i].doc);
            }
        });
    }

    dispose() {

    }

    addItem() {
       this.items.push({title: "Coffee vs Tea"});
       crossroads.parse("todo/new");
    }

    openItem(item) {
        crossroads.parse('todo/show/' + item._id);
        return false;
    }
}

export default { viewModel: TodoList, template: templateMarkup };
