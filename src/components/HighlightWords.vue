<script setup>
import { computed } from 'vue';

const props = defineProps({
  transcriptData: {
    type: Object,
    required: true,
  },
  isPlaying: {
    type: Boolean,
    required: true,
  },
  currentTime: {
    type: Number,
    required: true,
  },
});

const wordsBySecond = computed(() => {
  let words = [];

  for (let i = 0; i < props.transcriptData.utterances.length; i++) {
    words = words.concat(props.transcriptData.utterances[i].words);
  }

  const wordsBySecond = {}

  words.forEach((word) => {
    const second = Math.floor(word.start)
    if (wordsBySecond[second]) {
      wordsBySecond[second].push(word.word.trim())
    } else {
      wordsBySecond[second] = [word.word.trim()]
    }
  })

  return wordsBySecond;
});

console.log('wordsBySecond', wordsBySecond.value);

const isWordActive = (word, index) => {
  let totalIndexUpToSecond = 0;
  const currentTime = Math.floor(props.currentTime);

  if (!wordsBySecond.value[currentTime]) return false;

  for (let i = 0; i < currentTime; i++) {
    if (wordsBySecond.value[i]) {
      totalIndexUpToSecond += wordsBySecond.value[i].length;
    }
  }

  if (index < totalIndexUpToSecond || index > (totalIndexUpToSecond + wordsBySecond.value[currentTime]?.length || 0)) {
    return false;
  }

  return wordsBySecond.value[currentTime] && wordsBySecond.value[currentTime].includes(word.trim());
}
</script>

<template>
  <div class="transcript-container flex justify-center items-center px-8 h-[calc(100%-84px)]">
    <div class="flex items-center flex-wrap leading-[2.5rem]	">
      <span v-for="(word, index) of transcriptData.full_transcript.split(/\s+/)" :key="index"
        :class="{ highlight: isWordActive(word, index) }">
        {{ word }}&nbsp;
      </span>
    </div>
  </div>
</template>

<style>
.highlight {
  background-color: #3ac7ab;
  color: #fff;
}
</style>