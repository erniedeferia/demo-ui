import ko from 'knockout';
import template from 'text!./index.html';
import * as router from '../../app/router';
import * as navModel from '../main-menu/main-menu';
import API from '../../app/api';

class Index {
    constructor(params) {
        this.id = router.currentRoute().id;
        this.route = router.currentRoute;
        this.item = ko.observable("");
        this.itemSummary = ko.computed( function() {
            return this.item()["summary"];
        }, this);
        this.init(this.id);
    }

    init(id) {
        var self = this;
        API.get("",id).then( function(data) {
            self.item(data);
        });
    }

}

export default {viewModel: Index, template: template};
