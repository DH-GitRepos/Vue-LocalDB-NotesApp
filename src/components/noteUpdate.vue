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

// create reactive form propeties
const updatedTitle = ref(props.noteTitle);
const updatedContent = ref(props.noteContent);
const updatedCategory = ref(props.noteCategory);

// HANDLE OPENING DIALOGS

const handleOpenEditDialog = (id) => {
    const dialogRef = `noteCardEdit-${id}`;
    const dialogElementRef = document.getElementById(dialogRef);
    dialogElementRef.showModal();
}

const handleCloseEditDialog = (id) => {
    const dialogRef = `noteCardEdit-${id}`;
    const dialogElementRef = document.getElementById(dialogRef);
    dialogElementRef.close();
}

// HANDLE UPDATE

const handleUpdateNote = (nid) => {
    
    const title = updatedTitle.value;
    const content = updatedContent.value;
    const category = updatedCategory.value;
    const date = new Date();
    const formattedDate = ('0' + date.getDate()).slice(-2) + '-' +
                          ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                          date.getFullYear() + ' @ ' +
                          ('0' + date.getHours()).slice(-2) + ':' +
                          ('0' + date.getMinutes()).slice(-2);

    dbMgr.value.notes.updateNote(nid, title, content, category, formattedDate)
    .then(() => {
            feedback.value = "noteUpdate.handleUpdateNote>(INFO): Note successfully updated";
            console.log(feedback.value);
    })
    .then(() => {
        handleCloseEditDialog(nid); // close dialog
        // send request back to parent component to reload the list 
        emit('reloadRequest');    
    })
    .catch(error => {
        feedback.value = `noteUpdate.handleUpdateNote>(ERROR): Error updating note: ${error}`;
        console.log(feedback.value);
        handleCloseDeleteDialog(nid); // close dialog
    });
}

</script>


<template>

    <div @click="handleOpenEditDialog(`${noteId}`)" 
        class="block w-[80px] h-[30px] cursor-pointer bg-sky-600 hover:bg-sky-300 text-white font-bold text-center py-[5px] rounded-lg shadow-md hover:shadow-none"
        >Edit
    </div>

    <!-- UPDATE ITEM DIALOG -->
    <dialog :id="`noteCardEdit-${noteId}`" closed class="md:text-left text-center w-[85vw] md:w-[60vw] p-5 m-auto border-solid border-[5px] rounded-2xl border-sky-600 bg-white shadow-lg">
        
        <h2 class="font-bold text-lg">Edit Note ({{ noteId }}): {{ noteTitle }}</h2>

        <form>

            <p>Note created: {{ noteDateCreated }}</p>
            <!-- Title -->
            <p class="block pt-[15px]">
                <label for="updatedTitle" class="pb-[5px] text-left font-bold block">Title:</label>
                <input v-model="updatedTitle" class="border-[2px] border-[#000] rounded-md p-1 w-[100%] text-sky-600 font-bold bg-sky-100" required type="text" id="updatedTitle" name="updatedTitle">
            </p>
            <!-- Content -->
            <p class="block pt-[15px]">
                <label for="updatedContent" class="pb-[5px] text-left font-bold block">Content:</label>
                <textarea v-model="updatedContent" class="border-[2px] border-[#000] rounded-md p-1 w-[100%] text-sky-600 font-bold bg-sky-100" id="updatedContent" name="updatedContent"></textarea> 
            </p>
            <!-- Category -->
            <p class="block pt-[15px]">
                <label for="updatedCategory" class="pb-[5px] text-left font-bold block">Category:</label>
                <input v-model="updatedCategory" class="border-[2px] border-[#000] rounded-md p-1 w-[100%] text-sky-600 font-bold bg-sky-100" required type="text" id="updatedCategory" name="updatedCategory">
            </p>
        
        </form>

        <div id="dialogButtons" class="flex flex-col md:flex-row items-center">
            <button :id="`closeButton-${noteId}`" @click="handleCloseEditDialog(noteId)" class="closeButton h-[40px] mt-5 md:mr-[15px] block w-[150px] cursor-pointer bg-sky-600 hover:bg-sky-300 text-white font-bold text-center py-[5px] rounded-lg shadow-md hover:shadow-none">Cancel edit</button>
            <button :id="`confirmUpdate-${noteId}`" @click="handleUpdateNote(noteId)" class="closeButton h-[40px] mt-5 block w-[150px] cursor-pointer bg-sky-600 hover:bg-green-700 text-white font-bold text-center py-[5px] rounded-lg shadow-md hover:shadow-none">Save changes</button>
        </div>
    </dialog>

</template>


<style scoped>

</style>