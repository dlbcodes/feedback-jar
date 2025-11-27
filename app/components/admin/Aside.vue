<script setup lang="ts"></script>

<template>
    <aside class="flex flex-col p-1 gap-y-8 min-h-0 h-full">
        <slot name="top"></slot>

        <!-- Add min-h-0 here -->
        <div class="flex flex-col flex-1 gap-y-5 min-h-0">
            <slot></slot>
        </div>

        <div class="p-2">
            <slot name="bottom"></slot>
        </div>
    </aside>
</template>
