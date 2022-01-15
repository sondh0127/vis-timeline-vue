
<script lang="ts" setup>
import type { DataItem } from 'vis-timeline/esnext'

interface Props {
  item: DataItem
}

const props = defineProps<Props>()
</script>

<template>
  <div>{{ item.start }}</div>
  <div>{{ item.end }}</div>
</template>
