<script lang="ts" setup>
import type { DataItem } from 'vis-timeline/esnext'

interface Props {
  item: DataItem
}

const props = defineProps<Props>()
</script>

<template>
  <div class="select-none">
    {{ item.content }}
  </div>
</template>
