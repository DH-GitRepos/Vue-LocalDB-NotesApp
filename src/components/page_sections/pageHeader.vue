<script setup>
import { dbMgr } from '@/state/dbInterface';
</script>


<template>

    <section class="w-[100%] py-[5px] bg-sky-600 text-white flex flex-row items-center shadow-md">

        <article class="w-[100%] md:w-[50%] lg:w-[50%] pl-[10px]">
            <h1>LOCALNotes App</h1>    
        </article>

        <article class="hidden md:w-[50%] md:block pr-[10px] bg-light text-right ">
            <h2>Using database {{ dbMgr.dbname }}</h2>
        </article>

    </section>

</template>


<style scoped>

</style>