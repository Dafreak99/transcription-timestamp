<script lang="ts" setup>
// Import styles.
import 'vidstack/player/styles/base.css';
// Register elements.
import 'vidstack/player';
import 'vidstack/player/ui';
import 'vidstack/icons';

import { isHLSProvider, type MediaAudioTrackChangeEvent, type MediaCanPlayEvent, type MediaProviderChangeEvent } from 'vidstack';
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
const isTranscripting = ref(false);
const transcript = ref({} as any);
const isPlaying = ref(false);
const currentTime = ref(-Infinity);
const mediaURL = ref('');
const showUpload = ref(true);

const updateMediaURL = async (url: string) => {
  mediaURL.value = url;
  isTranscripting.value = true;

  const response = await startTranscription(url);
  transcript.value = response;
  isTranscripting.value = false;
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

      <div class="flex items-center px-4 pt-4 gap-2" v-if="isUpLoading || isTranscripting">
        <Spinner />
        <h3 v-if="isUpLoading">Uploading file to get back the public URL</h3>
        <h3 v-if="isTranscripting">Sending to Gladia to transcript</h3>
      </div>
    </div>
  </div>

  <div class="w-[1200px]">
    <media-player v-if="mediaURL && !isTranscripting" autoplay
      class="w-full aspect-video text-white font-sans overflow-hidden rounded-md ring-media-focus data-[focus]:ring-4 border border-indigo-400"
      title="Sprite Fight" :src="mediaURL" playsinline @seeking="onSeeking" @playing="onPlaying" @pause="onPause"
      @end="onEnd" ref="$player">
      <media-provider>
        <HighlightWords :transcriptData="transcript.result.transcription" :isPlaying="isPlaying"
          :currentTime="currentTime" />
      </media-provider>

      <VideoLayout />
    </media-player>
  </div>


</template>

<style>
media-provider video {
  display: none;
}
</style>
