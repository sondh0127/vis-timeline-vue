
<script lang="ts" setup>
import type { DataGroup } from 'vis-timeline/esnext'

interface Props {
  group: DataGroup
}

const props = defineProps<Props>()

const dispatch = defineEmits([
  'remove', 'update',
])
function removeGroup() {
  dispatch('remove', props.group)
}
function updateGroup() {
  dispatch('update', props.group)
}
</script>

<template>
  <div class="select-none flex" @dblclick="updateGroup">
    <span title="double click to edit" class="cursor-pointer">{{ group.content }}</span>
    <button class="ml-2 rounded-full border w-6 h-6" @click="removeGroup">
      X
    </button>
  </div>
</template>
