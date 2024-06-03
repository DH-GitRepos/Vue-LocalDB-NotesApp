<script setup>
import { dbMgr } from '@/state/dbInterface';
import { ref } from 'vue';

const emit = defineEmits(['reloadRequest']); // Define the emit function
const feedback = ref("");

const props = defineProps({
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
    }
});

// create reactive form propeties
const updatedTitle = ref(props.noteTitle);
const updatedContent = ref(props.noteContent);
const updatedCategory = ref(props.noteCategory);

// HANDLE OPENING DIALOGS

const handleOpenCreateDialog = () => {
    const dialogElementRef = document.getElementById("noteCardCreate");
    dialogElementRef.showModal();
}

const handleCloseCreateDialog = () => {
    const dialogElementRef = document.getElementById("noteCardCreate");
    dialogElementRef.close();
}

// HANDLE UPDATE

const handleCreateNote = () => {
    
    const title = updatedTitle.value;
    const content = updatedContent.value;
    const category = updatedCategory.value;

    dbMgr.value.notes.createNote(title, content, category)
    .then(() => {
            feedback.value = "noteCreate.handleCreateNote>(INFO): Note successfully created";
            console.log(feedback.value);
    })
    .then(() => {
        handleCloseCreateDialog(); // close dialog

        // send request back to parent component to reload the list 
        emit('reloadRequest');
        
    })
    .catch(error => {
        feedback.value = `noteCreate.handleCreateNote>(ERROR): Error creating note: ${error}`;
        console.log(feedback.value);
        handleCloseCreateDialog(); // close dialog
    });
}

</script>


<template>

    <div @click="handleOpenCreateDialog(`${noteId}`)" 
        class="block w-[180px] h-[50px] py-[15px] cursor-pointer bg-sky-300 hover:bg-white text-white hover:text-sky-600 font-bold text-center rounded-lg shadow-md hover:shadow-none"
        >NEW NOTE
    </div>

    <!-- UPDATE ITEM DIALOG -->
    <dialog id="noteCardCreate" closed class="text-center md:text-left w-[85vw] md:w-[60vw] p-5 m-auto border-solid border-[5px] rounded-2xl border-sky-600 bg-white shadow-lg">
        
        <h2 class="font-bold text-lg">New Note</h2>

        <form>

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
            <button :id="`closeButton-create`" @click="handleCloseCreateDialog()" class="closeButton h-[40px] mt-5 md:mr-[15px] block w-[150px] cursor-pointer bg-sky-600 hover:bg-sky-300 text-white font-bold text-center py-[5px] rounded-lg shadow-md hover:shadow-none">Cancel new note</button>
            <button :id="`confirmUpdate-create`" @click="handleCreateNote()" class="closeButton h-[40px] mt-5 block w-[150px] cursor-pointer bg-sky-600 hover:bg-green-700 text-white font-bold text-center py-[5px] rounded-lg shadow-md hover:shadow-none">Save note</button>
        </div>
    
    </dialog>

</template>


<style scoped>

</style>