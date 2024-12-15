<template>
  <div class="h-5 w-5 translate-y-1 -translate-x-2">
    <button
      :title="isDark ? 'Use light mode' : 'Use dark mode'"
      @click="
        () => {
          colorMode.preference = isDark ? 'light' : 'dark';
          clickCount++;

          if (audio) {
            audio.currentTime = 0;
            audio.volume = 0.4;
            audio.play();
          }
        }
      "
    >
      <span
        class="absolute bottom-0 left-0 h-9 text-foreground w-9 transition-transform duration-300"
        :style="{ transform: `rotate(${rotation}deg)` }"
      >
        <IconSun
          class="absolute bottom-0 left-0"
          :class="{
            'h-5 w-5': !isDark,
            'h-4 w-4': isDark,
          }"
        />
        <IconMoon
          class="absolute right-0 top-0 transition"
          :class="{
            'h-5 w-5 -rotate-180': isDark,
            'h-4 w-4': !isDark,
          }"
        />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
const audio = ref<HTMLAudioElement | undefined>(undefined);

onMounted(() => {
  audio.value = new Audio("/audio/switch.mp3");
});

const colorMode = useColorMode();
const isDark = computed(
  () =>
    colorMode.preference === "dark" ||
    (colorMode.preference === "system" &&
      window?.matchMedia?.("(prefers-color-scheme: dark)").matches)
);

const clickCount = ref(0);
const initialRotation = isDark.value ? 180 : 0;
const rotation = computed(() => initialRotation + clickCount.value * 180);
</script>
