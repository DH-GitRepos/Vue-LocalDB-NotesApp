import { NotesGateway } from '@/dataGateway/notesGateway.js';
import { CategoryGateway } from '@/dataGateway/categoryGateway.js';
import categorySampleData from '../sample_data/categories.json';
import notesSampleData from '../sample_data/notes.json';

/*
This is the DBManager class:
- Provides methods for setting up the database (initialising and populating test data),
- opening and closing connections, and provides access to object stores through
- imported gateway classes (per object store), which provide the CRUD functionality
- for interracting with the datadase.
*/
export class DBManager {
    constructor(params) {
        this.dbname = (params && params.dbname) || "";
        this.dbref = null;
        this.notes = null; // reference to notesGateway
        this.category = null; // reference to categoryGateway
    }


    toString(){
        return "Successfully accessed DBManager.";
    }


    initialise() {
        return new Promise((resolve, reject) => {
            const dbn = this.dbname;
            console.log(`DBManager.initialise()>(INFO): Initialising: DBNAME '${dbn}' USED.`);
    
            if (this.checkSupport()) {
                if (dbn !== "") {
                    this.doesDatabaseExist(dbn)
                        .then(async (exists) => {
                            if (exists) {
                                console.log('DBManager.initialise()>(INFO): Database exists.');
                                return this.openDB(dbn);
                            } else {
                                console.log('DBManager.initialise()>(INFO): Database does not exist, creating...');
                                await this.deleteDatabase(dbn);
                                await this.createNewDB(dbn);
                                await this.openDB(dbn);
                                await this.createSampleCategories();
                                return this.createSampleNotes();
                            }
                        })
                        .then((db) => {
                            console.log("DBManager.initialise()>(INFO): Database is open and ready for use", db);
                            resolve(db); // Resolve the promise here
                        })
                        .catch((error) => {
                            console.error("DBManager.initialise()>(ERROR): An error occurred: ", error);
                            reject(error); // Reject the promise here
                        });
                } else {
                    console.log("DBManager.initialise()>(ERROR): No database name supplied.");
                    reject(new Error("No database name supplied.")); // Reject the promise here
                }
            } else {
                console.log("DBManager.initialise()>(ERROR): This browser doesn't support IndexedDB.");
                reject(new Error("This browser doesn't support IndexedDB.")); // Reject the promise here
            }
        });
    }


    checkSupport(){
        // Check for support
        if (!('indexedDB' in window)) {
            console.log("DBManager.checkSupport()>(ERROR): This browser doesn't support IndexedDB.");
            return false;
        } else {
            console.log("DBManager.checkSupport()>(INFO): This browser supports IndexedDB.");
            return true;
        }
    }


    doesDatabaseExist(dbName) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);
            let existed = true;
    
            request.onupgradeneeded = (event) => {
                existed = false;
                // Don't close or delete here; just flag the non-existence
            };
    
            request.onsuccess = (event) => {
                // Close after confirming existence, but consider if we need the connection open
                // event.target.result.close();
                resolve(existed);
            };
    
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }


    openDB(dbName) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName);
    
            request.onsuccess = (event) => {
                this.dbref = event.target.result;

                console.log("DBManager.openDB()>(INFO): Initialising gateways");
                this.notes = new NotesGateway({db: this.dbref});
                this.category = new CategoryGateway({db: this.dbref});

                resolve(this.dbref);
            };
    
            request.onerror = (event) => {
                reject(event.target.error);
            };
    
            request.onupgradeneeded = (event) => {
                this.dbref = event.target.result;
            };
        });
    }


    closeDB() {
        if (this.dbref) {
            // Close the database connection
            this.dbref.close();
            console.log("DBManager.closeDB()>(INFO): Database connection closed");
        }
    
        // Clear the gateway and DB references
        this.notes = null;
        this.category = null;
        this.dbref = null;

        this.initialised = false;
    
        console.log("DBManager.closeDB()>(INFO): References cleared");
    }


    createNewDB(dbName) {
        console.log(`DBManager.createNewDB()>(INFO): STARTED, CREATING ${dbName}`);
    
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);
    
            console.log(`DBManager.createNewDB()>(INFO): OPENED ${dbName}`);
    
            request.onupgradeneeded = (event) => {
                console.log("DBManager.createNewDB()>(INFO): Upgrading or creating new database");
                this.dbref = event.target.result;
    
                // Create object stores and indexes here...
                if (!this.dbref.objectStoreNames.contains('NOTES')) {
                    console.log("DBManager.createNewDB()>(INFO): Creating 'NOTES' object store");
                    let notesStore = event.target.result.createObjectStore('NOTES', { keyPath: 'ID', autoIncrement: true });
                    // Create indexes for the 'NOTES' object store
                    notesStore.createIndex('TITLE', 'TITLE', { unique: false });
                    notesStore.createIndex('CONTENT', 'CONTENT', { unique: false });
                    notesStore.createIndex('CATEGORY', 'CATEGORY', { unique: false });
                    notesStore.createIndex('CREATED_DATE', 'CREATED_DATE', { unique: false });
                    notesStore.createIndex('UPDATED_DATE', 'UPDATED_DATE', { unique: false });
                }
        
                if (!this.dbref.objectStoreNames.contains('CATEGORIES')) {
                    console.log("DBManager.createNewDB()>(INFO): Creating 'CATEGORIES' object store");
                    let categoriesStore = event.target.result.createObjectStore('CATEGORIES', { keyPath: 'ID', autoIncrement: true });
                    // Create indexes for the 'CATEGORIES' object store
                    categoriesStore.createIndex('TITLE', 'TITLE', { unique: false });
                    categoriesStore.createIndex('DESCRIPTION', 'DESCRIPTION', { unique: false });
                }

            };
    
            request.onsuccess = (event) => {
                console.log("DBManager.createNewDB()>(INFO): Database created successfully");
                event.target.result.close();
                resolve("DBManager.createNewDB()>(INFO): Database created successfully.");
            };
    
            request.onerror = (event) => {
                console.error("DBManager.createNewDB()>(ERROR): Error in creating database", event.target.error);
                reject(event.target.error);
            };
        });
    }


    deleteDatabase(dbName) {
        return new Promise((resolve, reject) => {
            const deleteRequest = indexedDB.deleteDatabase(dbName);
    
            deleteRequest.onsuccess = () => {
                console.log(`DBManager.deleteDatabase()>(INFO): Database ${dbName} deleted successfully.`);
                resolve();
            };
    
            deleteRequest.onerror = (event) => {
                console.error(`DBManager.deleteDatabase()>(ERROR): Error deleting database ${dbName}:`, event.target.error);
                reject(event.target.error);
            };
        });
    }


    createSampleCategories() {
        console.log("DBManager.createSampleCategories()>(INFO): Creating sample categories...");
        this.insertCategoriesFromJSON(this.dbref, categorySampleData)
            .then(() => console.log("DBManager.createSampleCategories()>(INFO): Categories successfully added"))
            .catch(error => console.error("DBManager.createSampleCategories()>(ERROR): Failed to add categories:", error));
    }


    insertCategoriesFromJSON(db, jsonData) {
        console.log("DBManager.insertCategoriesFromJSON()>(INFO): Processing sample JSON categories");
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['CATEGORIES'], 'readwrite');
            const store = transaction.objectStore('CATEGORIES');
    
            // Handling transaction completion
            transaction.oncomplete = () => {
                console.log("DBManager.insertCategoriesFromJSON()>(INFO): All categories inserted");
                resolve();
            };
    
            // Handling transaction error
            transaction.onerror = (event) => {
                console.log("DBManager.insertCategoriesFromJSON()>(ERROR): Error handling transaction");
                reject(event.target.error);
            };
    
            // Iterate through JSON data and add each item
            jsonData.categories.forEach(category => {
                store.add(category);
            });
        });
    }


    createSampleNotes() {
        console.log("DBManager.createSampleNotes()>(INFO): Creating sample notes...");
        this.insertNotesFromJSON(this.dbref, notesSampleData)
            .then(() => console.log("DBManager.createSampleNotes()>(INFO): Notes successfully added"))
            .catch(error => console.error("DBManager.createSampleNotes()>(ERROR): Failed to add notes:", error));
    }


    insertNotesFromJSON(db, jsonData) {
        console.log("DBManager.insertNotesFromJSON()>(INFO): Processing sample JSON categories");
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['NOTES'], 'readwrite');
            const store = transaction.objectStore('NOTES');
    
            // Handling transaction completion
            transaction.oncomplete = () => {
                console.log("DBManager.insertNotesFromJSON()>(INFO): All notes inserted");
                resolve();
            };
    
            // Handling transaction error
            transaction.onerror = (event) => {
                console.log("DBManager.insertNotesFromJSON()>(ERROR): Error handling transaction");
                reject(event.target.error);
            };
    
            // Iterate through JSON data and add each item
            jsonData.notes.forEach(note => {
                store.add(note);
            });
        });
    }

}