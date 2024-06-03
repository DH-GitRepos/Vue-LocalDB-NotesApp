import Note from '@/entity/note.js';

/*
This is the NotesGateway class:
- Provides CRUD methods for accessing the 'NOTES' object store.
- Extends DBManager and accessed through the DBManager as below:
- Methods called via DBManagerRef.notes.value.method(...);
*/
export class NotesGateway {
    
    constructor(params) {
        this.db = (params && params.db) || null;
    }


    toString(){
        return "This is the notes gateway.";
    }


    createNote(newTitle, newContent, newCategory) {
        return new Promise((resolve, reject) => {
            // Open a transaction on IndexedDB's 'NOTES' object store in readwrite mode.
            const transaction = this.db.transaction(['NOTES'], 'readwrite');

            // Access 'NOTES' object store.
            const store = transaction.objectStore('NOTES');

            const date = new Date();
            const formattedDate = ('0' + date.getDate()).slice(-2) + '-' +
                                ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                                date.getFullYear() + ' @ ' +
                                ('0' + date.getHours()).slice(-2) + ':' +
                                ('0' + date.getMinutes()).slice(-2);

            // Create a new note object.
            const newNote = {
                title: newTitle,
                content: newContent,
                category: newCategory,
                dateCreated: formattedDate,
                dateUpdated: formattedDate
            };

            // Make a request to add the new note.
            const requestAdd = store.add(newNote);

            requestAdd.onsuccess = () => {
                console.log(`NotesGateway.createNote()>(INFO): New note created`);
                resolve();
            };

            requestAdd.onerror = (event) => {
                console.error(`NotesGateway.createNote()>(ERROR): Error creating new note: `, event.target.error);
                reject(event.target.error);
            };
        });
    }

    readNote(id) {

    }

    
    readAllNotes() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['NOTES'], 'readonly');
            const store = transaction.objectStore('NOTES');
            const request = store.openCursor();
            const allNotes = [];
    
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const note = new Note({id: cursor.value.ID, title: cursor.value.title, content: cursor.value.content, category: cursor.value.category, dateCreated: cursor.value.dateCreated, dateUpdated: cursor.value.dateUpdated});
                    allNotes.push(note);
                    cursor.continue();
                } else {
                    // No more entries
                    resolve(allNotes);
                }
            };
    
            request.onerror = () => {
                reject(request.error);
            };
        });
    }


    updateNote(id, title, content, category, date) {
        return new Promise((resolve, reject) => {
            // Open a transaction on IndexedDB's 'NOTES' object store in readwrite mode.
            const transaction = this.db.transaction(['NOTES'], 'readwrite');
    
            // Access 'NOTES' object store.
            const store = transaction.objectStore('NOTES');
    
            // Make a request to delete the specified note by ID.
            const requestGet = store.get(parseInt(id));
    
            requestGet.onsuccess = () => {
                const data = requestGet.result;
                // Update the properties of the note.
                data.title = title;
                data.content = content;
                data.category = category;
                data.dateUpdated = date;
    
                // Put the updated note back into the store.
                const requestUpdate = store.put(data);
    
                requestUpdate.onsuccess = () => {
                    console.log(`NotesGateway.updateNote()>(INFO): Note with ID ${id} has been updated`);
                    resolve();
                };
    
                requestUpdate.onerror = (event) => {
                    console.error(`NotesGateway.updateNote()>(ERROR): Error updating note with ID ${id}: `, event.target.error);
                    reject(event.target.error);
                };
            };
    
            requestGet.onerror = (event) => {
                console.error(`NotesGateway.updateNote()>(ERROR): Error retrieving note with ID ${id}: `, event.target.error);
                reject(event.target.error);
            };
        });
    }


    updateSwapNoteId(id1, id2) {
        return new Promise((resolve, reject) => {
            // Open a transaction on IndexedDB's 'NOTES' object store in readwrite mode.
            const transaction = this.db.transaction(['NOTES'], 'readwrite');

            // Access 'NOTES' object store.
            const store = transaction.objectStore('NOTES');
    
            // Make a request to retrieve the specified notes by ID.
            const request1 = store.get(parseInt(id1));
            const request2 = store.get(parseInt(id2));
    
            let note1, note2;
    
            request1.onsuccess = () => {
                note1 = request1.result;
                if (note2) { // Check if the other note has already been fetched
                    swapAndPut();
                }
            };
    
            request2.onsuccess = () => {
                note2 = request2.result;
                if (note1) { // Check if the other note has already been fetched
                    swapAndPut();
                }
            };
    
            const swapAndPut = () => {
                if (!note1 || !note2) {
                    reject("NotesGateway.updateSwapNoteId.swapAndPut()>(ERROR): One or both notes not found");
                    return;
                }
    
                // Swap IDs
                const tempId = note1.ID;
                note1.ID = note2.ID;
                note2.ID = tempId;
    
                // Update in the store
                const update1 = store.put(note1);
                const update2 = store.put(note2);
    
                update1.onerror = update2.onerror = (event) => {
                    reject(event.target.error);
                };
    
                update2.onsuccess = () => {
                    resolve(`NotesGateway.updateSwapNoteId.swapAndPut()>(INFO): Swapped IDs of notes ${id1} and ${id2}`);
                };
            };
    
            request1.onerror = request2.onerror = () => {
                reject(request1.error || request2.error);
            };
        });
    }


    deleteNote(noteId) {
        return new Promise((resolve, reject) => {
            // Open a transaction on IndexedDB's 'NOTES' object store in readwrite mode.
            const transaction = this.db.transaction(['NOTES'], 'readwrite');
    
            // Access 'NOTES' object store.
            const store = transaction.objectStore('NOTES');
    
            // Make a request to delete the specified note by ID.
            const request = store.delete(parseInt(noteId));
    
            request.onsuccess = () => {
                console.log(`NotesGateway.notesGateway.deleteNote()>(INFO): Note with ID ${noteId} has been deleted`);
                resolve();
            };
    
            request.onerror = (event) => {
                console.error(`NotesGateway.notesGateway.deleteNote()>(ERROR): Error in deleting note with ID ${noteId}: `, event.target.error);
                reject(event.target.error);
            };
        });
    }

}