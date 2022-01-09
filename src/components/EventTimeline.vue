<script setup lang="ts">
import './vis-timeline-graph2d.css'
import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline/esnext'
import type {
  DataGroup, DataItem, IdType, TimelineEvents, TimelineOptions,
} from 'vis-timeline/esnext'
import { nanoid } from 'nanoid'

interface Props {
  groups?: DataGroup[]
  items?: DataItem[]
  selection?: IdType | IdType[]
  options?: TimelineOptions
}

const props = withDefaults(defineProps<Props>(), {
  groups: () => [],
  items: () => [],
  selection: () => [],
  options: () => ({}),
})

const emit = defineEmits([
  'update:items', 'update:groups',
])

const timelineRef = ref<HTMLDivElement>()
const timeline = ref<Timeline>()

const itemsValue = useVModel(props, 'items', emit)
const groupsValue = useVModel(props, 'groups', emit)

const dataSetItems = ref(new DataSet(props.items))
const dataSetGroups = ref(new DataSet(props.groups))

/** maybe watch individual event to improve performance */
dataSetItems.value.on('*', (name, payload, senderId) => {
  itemsValue.value = dataSetItems.value.get()
})

dataSetGroups.value.on('*', (name, payload, senderId) => {
  groupsValue.value = dataSetGroups.value.get()
})

onMounted(() => {
  if (!timelineRef.value) return
  timeline.value = new Timeline(
    timelineRef.value,
    dataSetItems.value,
    dataSetGroups.value,
    props.options,
  )
})

watch(() => props.options, () => {
  timeline.value?.setOptions(props.options)
}, {
  deep: true,
})

watch(() => props.selection, (newValue) => {
  timeline.value?.setSelection(newValue)
})

defineExpose({
  timeline,
  dataSetItems,
  dataSetGroups,
})

function addGroup() {
  const prompt = window.prompt('Add group', 'New group')
  if (prompt)
    dataSetGroups.value.add({ id: nanoid(), content: prompt })
}

</script>

<template>
  <div ref="timelineRef">
    <div class="absolute top-0 left-0 w-[100px] h-[60px] z-1 flex items-center p-2">
      <button class="text-[#4d4d4d]" @click="addGroup">
        Add group
      </button>
    </div>
  </div>
</template>
