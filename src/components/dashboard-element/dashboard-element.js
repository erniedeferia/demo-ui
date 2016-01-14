import ko from 'knockout';
import templateMarkup from 'text!./dashboard-element.html';


class DashboardElement {

    constructor(params) {
        this.header = ko.observable(params.label);
        this.name = ko.observable(params.name);
        this.class = params.class;
        this.init();
    }

    init() {

        chart_data = [
            {
                value: 300,
                color:"lightgray",
                highlight: "green",
                label: "Active"
            },
            {
                value: 50,
                color: "darkgray",
                highlight: "blue",
                label: "Closed"
            },
            {
                value: 100,
                color: "black",
                highlight: "gray",
                label: "Delayed"
            }
        ];


        var ctx = $("#de-" + this.name() + "  #de-chart").get(0).getContext("2d");

        // Set the class based on the dashboard-element class
        $("#de-" + this.name() + " .dashboard-box").removeClass('dashboard-box').addClass(this.class);

    }

    dispose() {
    }
}

export default { viewModel: DashboardElement, template: templateMarkup };
