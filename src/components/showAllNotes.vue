<script setup>
import { onMounted, ref, watch } from 'vue';
import { dbMgr } from '@/state/dbInterface';
import NoteItem from '@/components/noteItem.vue';

const props = defineProps({
    reloadTrigger: Number
});

// Create and initialise a reactive variable to force re-rendering
let listRenderKey = ref(0);
// Create and initialise a reactive list to contain all notes 
const allNotes = ref([]);

const reloadNotes = async () => {
    try {
        allNotes.value = await dbMgr.value.notes.readAllNotes();
    } catch (error) {
        console.error("showAllNotes>(ERROR): Error reloading notes:", error);
    }
};

// watch for a change in the trigger prop, if it changes, RELOAD!!
watch(() => props.reloadTrigger, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    reloadNotes();
  }
}, { immediate: true });


onMounted(async () => {
    try {
        allNotes.value = await dbMgr.value.notes.readAllNotes();
    } catch (error) {
        console.error("showAllNotes>(ERROR): Error fetching notes:", error);
    }
});


// DRAG AND DROP FUNCTIONALITY:

// Function to handle the drag start event
const dragstartHandler = (event) => {
    console.log("showAllNotes>(INFO): dragStart");

    // Retrieve the ID of the note being dragged, using the currentTarget property
    // to ensure the correct li element is targeted.
    const draggedNoteId = event.currentTarget.dataset.noteId;

    // Set the data to be transferred during the drag operation. The data format
    // is specified as "application/my-app", and the data is the ID of the dragged note.
    event.dataTransfer.setData("application/my-app", draggedNoteId);

    // Set the allowed effect of the drag operation to "move", meaning the dragged
    // item can be moved to a new location.
    event.dataTransfer.effectAllowed = "move";

    // Add a 'dragging' class to the element being dragged. This is used
    // to apply specific styles during the drag operation.
    event.currentTarget.classList.add('dragging');
}


// Function to handle the drag over event
const dragoverHandler = (event) => {
    console.log("showAllNotes>(INFO): dragOver");

    // Prevent the default handling of the event. This is necessary for the drop
    // event to fire, allowing the dragged element to be dropped into a valid drop target.
    event.preventDefault();

    // Set the drop effect of the drag operation to "move".
    event.dataTransfer.dropEffect = "move";
}


// Function to handle the drag end event
const dragendHandler = (event) => {
    // Remove the 'dragging' class from the element that was being dragged.
    event.currentTarget.classList.remove('dragging');
}


// Function to handle the drop event
const dropHandler = (event) => {
    console.log("showAllNotes>(INFO): dropHandler");

    // Prevent the default handling of the event. This is necessary for the drop
    // event to fire, allowing the dragged element to be dropped into a valid drop target.
    event.preventDefault();

    // Retrieve the data (note ID) that was set in the drag start handler.
    // This data is the ID of the dragged note.
    const data = event.dataTransfer.getData("application/my-app");

    console.log(`showAllNotes>(INFO): Dragged item ID: ${data}`);

    // Find the closest list item ('li') element to the drop target, which
    // is the intended drop location for the dragged note.
    const targetElement = event.target.closest('li');

    // Get the note ID of the target element.
    const targetNoteId = targetElement.dataset.noteId;

    // Find the index of the dragged note in the allNotes array.
    const draggedIndex = allNotes.value.findIndex(note => note.id.toString() === data);

    // Find the index of the target note in the allNotes array.
    const targetIndex = allNotes.value.findIndex(note => note.id.toString() === targetNoteId);

    console.log(`showAllNotes>(INFO): Dragged Index: ${draggedIndex}, Target Index: ${targetIndex}`);

    // Create a new copy of the notes array for manipulation.
    const newNotes = [...allNotes.value];

    // Swap the notes in the array to reflect the new order after the drop.
    let temp = newNotes[targetIndex];
    newNotes[targetIndex] = newNotes[draggedIndex];
    newNotes[draggedIndex] = temp;

    // Update the allNotes array with the new order.
    allNotes.value = newNotes;

    // Increment a key value to force the list to re-render with the new order.
    listRenderKey.value++;

    // Update the database to reflect the new order of notes, ensuring
    // that the new positioning is retained on page reload.
    dbMgr.value.notes.updateSwapNoteId(data, targetNoteId);

    // Reload the notes showing the new order.
    reloadNotes();
}

</script>


<template>

    <section class="">

        <ul class="mt-[10px] grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-[10px]">
            <li v-for="note in allNotes" :key="`${note.id}-${listRenderKey}`"
                :id="`noteitem-${note.id}`"
                :data-note-id="note.id"
                draggable="true"
                @dragstart="dragstartHandler"
                @dragend="dragendHandler"
                @drop="dropHandler"
                @dragover="dragoverHandler">
                <NoteItem @reloadRequest="reloadNotes" :noteId="`${note.id}`" :noteTitle="`${note.title}`" :noteCategory="`${note.category}`" :noteContent="`${note.content}`" :noteDateCreated="`${note.dateCreated}`" :noteDateUpdated="`${note.dateUpdated}`" />
            </li>
        </ul>

    </section>

</template>


<style scoped>
.dragging {
    opacity: 0.5;
    border: 2px dashed #000;
    border-radius: 0.75rem/* 12px */;
}

</style>