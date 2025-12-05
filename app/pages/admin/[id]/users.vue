<script setup lang="ts"></script>

<template>
    <div class="pt-20">
        <div class="relative inline-block">
            <!-- Close button -->
            <button
                class="absolute -top-8 right-2 flex items-center justify-center bg-white shadow rounded-full size-7 z-20"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="size-4"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                    />
                </svg>
            </button>

            <!-- Card -->
            <div
                class="bg-white rounded-2xl shadow h-64 w-64 p-4 overflow-visible"
            >
                here the content
            </div>
        </div>

        <div
            class="absolute bottom-2 right-2 size-14 rounded-full bg-indigo-600"
        ></div>
    </div>
</template>
