<script setup>
import { dbMgr } from '@/state/dbInterface';
import { ref } from 'vue';

const emit = defineEmits(['reloadRequest']); // Define the emit function
const feedback = ref("");

const props = defineProps({
    noteId: {
        type: String,
        required: false
    },
    noteTitle: {
        type: String,
        required: false
    },
    noteCategory: {
        type: String,
        required: false
    },
    noteContent: {
        type: String,
        required: false
    },
    noteDateCreated: {
        type: String,
        required: false
    },
    noteDateUpdated: {
        type: String,
        required: false
    }
});

// HANDLE OPENING DIALOGS

const handleOpenDeleteDialog = (id) => {
    const dialogRef = `noteCardDelete-${id}`;
    const dialogElementRef = document.getElementById(dialogRef);
    dialogElementRef.showModal(id);
}

const handleCloseDeleteDialog = (id) => {
    const dialogRef = `noteCardDelete-${id}`;
    const dialogElementRef = document.getElementById(dialogRef);
    dialogElementRef.close();
} 

// HANDLE DELETE

const handleDeleteNote = (nid) => {

    dbMgr.value.notes.deleteNote(nid)
    .then(() => {
            feedback.value = "noteDelete.handleDeleteNote>(INFO): Note successfully deleted";
            console.log(feedback.value);
        })
    .then(() => {
        handleCloseDeleteDialog(nid); // close dialog
        // send request back to parent component to reload the list 
        emit('reloadRequest');    
    })
    .catch(error => {
        feedback.value = `noteDelete.handleDeleteNote>(ERROR): Error deleting note: ${error}`;
        console.log(feedback.value);
        handleCloseDeleteDialog(nid); // close dialog
    });
}

</script>


<template>

    <div @click="handleOpenDeleteDialog(`${noteId}`)" 
            class="block w-[80px] h-[30px] cursor-pointer bg-sky-600 hover:bg-sky-300 text-white font-bold text-center py-[5px] rounded-lg shadow-md hover:shadow-none ml-[10px]"
            >Delete</div>

    <!-- DELETE ITEM DIALOG -->
    <dialog :id="`noteCardDelete-${noteId}`" closed class="text-center md:text-left w-[85vw] md:w-[60vw] p-5 m-auto border-solid border-[5px] rounded-2xl border-sky-600 bg-white shadow-lg">

        <h2 class="font-bold text-lg mb-[15px]">Delete Note: {{ noteTitle }} ({{ noteId }})</h2>
        <p class="text-sm">Do you wish to continue?</p>
        
        <div id="dialogButtons" class="flex flex-col md:flex-row items-center">
            <button :id="`closeButton-${noteId}`" @click="handleCloseDeleteDialog(noteId)" class="closeButton h-[40px] mt-5 md:mr-[15px] block w-[150px] cursor-pointer bg-sky-600 hover:bg-sky-300 text-white font-bold text-center py-[5px] rounded-lg shadow-md hover:shadow-none">Cancel delete</button>
            <button :id="`confirmDelete-${noteId}`" @click="handleDeleteNote(noteId)" class="closeButton h-[40px] mt-5 block w-[150px] cursor-pointer bg-sky-600 hover:bg-red-700 text-white font-bold text-center py-[5px] rounded-lg shadow-md hover:shadow-none">Confirm delete</button>
        </div>
    
    </dialog>

</template>


<style scoped>

</style>