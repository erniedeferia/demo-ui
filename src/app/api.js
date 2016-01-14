import * as db from './localdb';

class API {
    constructor(params) {
        console.log("Initialized API");
        this.domain = params.domain || "localhost";
        this.port =   params.port || "8080";
        this.scheme = params.scheme || "http";
        this.prefix = params.prefix || "api";
        this.base_url = `${this.scheme}://${this.domain}:${this.port}/${this.prefix}`;
        console.log(this.base_url);
    }


    //
    // Creates a valid document for storage given a collection of
    // key-value pairs.
    //
    static toDocument( pairs ) {
        var obj = {};
        for(var i=0; i<pairs.length; i++ ) {
            var p = pairs[i];
            console.log("...adding property: %o", p);
            if( p.name === 'id' )
                obj["_id"] = p.value;
            else
                obj[p.name] = p.value;
        }
        var id = Math.random().toString(36).slice(2);
        console.log("storing document: %o", obj);
        obj["_id"] = id;
        return obj;
    }
    //
    // Calls the remote API to create and store a new document
    //
    static create(document) {
        var d = this.toDocument(document);
        db.db.put(d);
    }

    //
    // Calls remote API to update an existing document
    //
    static update(document) {

    }

    //
    // Delete the identified document from the collection with
    // name 'collection'
    //
    static delete(collection, id) {

    }

    //
    // Retrieves the identified document from the collection with
    // name 'collection'. Returns null if the document is not found.
    //
    static get(collection, id) {
        return db.db.get(id);
    }

    //
    // Retrieves the documents in collection 'collection' that
    // match the optional filter.
    //
    static list(collection, filter={}) {
        return db.db.allDocs({include_docs: true});
    }

    //
    // Returns objects that match the query from all searchable
    // collections.
    //
    static search(query) {

    }
}


//
// The singleton. This is a bunch of static methods anyways.
//
var apiInstance = new API({
    domain: "localhost",
    prefix: "api",
    scheme: "http",
    port:   "8081"
});

export default API;
