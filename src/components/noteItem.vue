<script setup>
import DeleteNote from '@/components/noteDelete.vue';
import UpdateNote from '@/components/noteUpdate.vue';

const emit = defineEmits(['reloadRequest']); // Define the emit function

const reloadEscalate = async () => {
    emit('reloadRequest'); 
};

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

</script>


<template>
    <article :id="`note-${noteId}`" class="bg-white py-[10px] px-[15px] mb-[10px] rounded-xl shadow-md">
    
        <!-- MAIN CARD DISPLAY -->
        <section :id="`noteCard-${noteId}`">

            <h3 class="text-rg font-bold">{{ noteTitle }} ({{ noteId }})</h3>
            <p class="text-sm">{{ noteContent }}</p>
            <p class="text-xs mt-[15px]">Category: {{ noteCategory }}</p>
            <p class="text-xs mt-[5px]">Created: {{ noteDateCreated }}</p>
            <p class="text-xs mt-[5px]">Updated: {{ noteDateUpdated }}</p>
            
            <aside class="text-sm mt-[10px] flex flex-row items-start">
                <div>
                    <UpdateNote @reloadRequest="reloadEscalate" :noteId="`${noteId}`" :noteTitle="`${noteTitle}`" :noteCategory="`${noteCategory}`" :noteContent="`${noteContent}`" :noteDateCreated="`${noteDateCreated}`" :noteDateUpdated="`${noteDateUpdated}`" />
                </div>
                <div>
                    <DeleteNote @reloadRequest="reloadEscalate" :noteId="`${noteId}`" :noteTitle="`${noteTitle}`" :noteCategory="`${noteCategory}`" :noteContent="`${noteContent}`" :noteDateCreated="`${noteDateCreated}`" :noteDateUpdated="`${noteDateUpdated}`" />
                </div>
            </aside>

        </section>        
    
    </article>
</template>


<style scoped>

</style>