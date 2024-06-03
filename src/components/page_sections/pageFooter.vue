<script setup>
import CreateNote from '@/components/noteCreate.vue';

const emit = defineEmits(['reloadRequest']); // Define the emit function

const requestReloadFromParent = async () => {
    emit('reloadRequest');
};

</script>


<template>

    <section class="w-[100%] py-[5px] bg-sky-600 text-white flex flex-row items-center">

        <article id="headerAddressBar" class="w-[100%] py-[10px] bg-primary flex justify-center items-center">
            <CreateNote @reloadRequest="requestReloadFromParent" />
        </article>


    </section>

</template>


<style scoped>

</style>