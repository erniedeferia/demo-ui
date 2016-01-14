//import '../bower_modules/pouchdb/dist/pouchdb-require';

import * as pouchdb from 'pouchdb';


class LocalDB {
    constructor(params) {
        console.log("creating local db...");
        this.db = new pouchdb("ui-demo");
        window.PouchDB = this.db;

        console.log('created local db!');
    }
}

var localDBInstance = new LocalDB({});

export default localDBInstance;
