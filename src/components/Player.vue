<script lang="ts" setup>
// Import styles.
import 'vidstack/player/styles/base.css';
// Register elements.
import 'vidstack/player';
import 'vidstack/player/ui';
import 'vidstack/icons';

import type { MediaPlayerElement } from 'vidstack/elements';
import { ref } from 'vue';

import VideoLayout from '../components/layouts/VideoLayout.vue';
import HighlightWords from '../components/HighlightWords.vue';
import { watch } from 'vue';
import FileUploader from '../components/FileUploader.vue';
import Spinner from '../components/Spinner.vue';

import '../css/base.css';
import { startTranscription } from '../utils/gladia';

const $player = ref<MediaPlayerElement>();
const isUpLoading = ref(false);
const isTranscribing = ref(false);
const transcript = ref({} as Record<string, any>);
const isPlaying = ref(false);
const currentTime = ref(-Infinity);
const mediaURL = ref('');
const showUpload = ref(true);

const updateMediaURL = async (url: string) => {
  mediaURL.value = url;
  isTranscribing.value = true;

  const response = await startTranscription(url);
  transcript.value = response;
  isTranscribing.value = false;
  showUpload.value = false;
}

const onSeeking = () => {
  const instance = document.querySelector("media-player");
  console.log(instance?.currentTime);
  currentTime.value = instance?.currentTime || 0;
}

const onPlaying = () => {
  console.log('on play')
  isPlaying.value = true;
}

const onPause = () => {
  console.log('on pause')
  isPlaying.value = false;
}

const onEnd = () => {
  console.log('on end')
  isPlaying.value = false;
  currentTime.value = 0;
}

const onUpload = () => {
  isUpLoading.value = true;
}

const onUploadSuccess = () => {
  isUpLoading.value = false;
}

const onUploadFailed = () => {
  isUpLoading.value = false;
}

watch(isPlaying, (newVal, _) => {
  if (newVal === true) {
    if (isPlaying.value) {
      currentTime.value = Math.floor($player?.value?.currentTime || 0);

      setInterval(() => {
        currentTime.value = Math.floor($player?.value?.currentTime || 0);
      }, 1000);
    }
  } else {
    console.log('is not playing')
  }
})

</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-3xl mx-auto" v-if="showUpload">
    <div class="flex flex-col justify-center items-center">
      <file-uploader :updateMediaURL="updateMediaURL" :onUpload="onUpload" :onUploadSuccess="onUploadSuccess"
        :onUpLoadFailed="onUploadFailed" />

      <div class="flex items-center px-4 pt-4 gap-2" v-if="isUpLoading || isTranscribing">
        <Spinner />
        <h3 v-if="isUpLoading">Uploading file to get back the public URL</h3>
        <h3 v-if="isTranscribing">Sending to Gladia to transcribe</h3>
      </div>
    </div>
  </div>

  <div class="w-[1200px] mx-auto" v-if="!showUpload">
    <media-player v-if="mediaURL && !isTranscribing" autoplay
      class="w-full aspect-video bg-black text-white font-sans overflow-hidden rounded-md ring-media-focus data-[focus]:ring-4 items-start"
      title="Sprite Fight" :src="mediaURL" playsinline @seeking="onSeeking" @playing="onPlaying" @pause="onPause"
      @end="onEnd" ref="$player">
      <media-provider>
        <HighlightWords :transcriptData="transcript.result.transcription" :isPlaying="isPlaying"
          :currentTime="currentTime" />
      </media-provider>

      <VideoLayout />
    </media-player>

    <div class="flex justify-end mt-6" v-if="!showUpload">
      <button type="button"
        class="flex justify-center items-center text-white bg-indigo-700 hover:bg-blue-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
        @click="showUpload = true">
        <svg class="w-6 h-6 mr-1 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17.7 7.7A7.1 7.1 0 0 0 5 10.8M18 4v4h-4m-7.7 8.3A7.1 7.1 0 0 0 19 13.2M6 20v-4h4" />
        </svg>
        <p>Upload Again</p>
      </button>
    </div>
  </div>



</template>

<style>
media-provider video {
  display: none;
}
</style>
