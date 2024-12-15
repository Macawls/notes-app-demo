<template>
  <Icon
    mode="svg"
    :style="`width: ${size}px; height: ${size}px;`"
    name="eos-icons:loading"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  variant: {
    type: String as PropType<"small" | "medium" | "large">,
    default: "small",
  },
});

const size = computed(() => {
  switch (props.variant) {
    case "small":
      return 24;
    case "medium":
      return 34;
    case "large":
      return 52;
    default:
      return 24;
  }
});
</script>
