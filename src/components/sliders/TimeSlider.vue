<script setup lang="ts">
import SliderChapters from './SliderChapters.vue';
import SliderThumb from './SliderThumb.vue';

const { thumbnails } = defineProps<{
  thumbnails?: string;
}>();
</script>

<template>
  <media-time-slider
    class="group relative mx-[7.5px] inline-flex h-10 w-full cursor-pointer touch-none select-none items-center outline-none">
    <SliderChapters />
    <SliderThumb />
  </media-time-slider>
</template>
