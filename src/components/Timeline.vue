<script setup lang="ts">
import './vis-timeline-graph2d.css'
import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline/esnext'
import type {
  DataGroup, DataInterfaceDataGroup, DataInterfaceDataItem,
  DataItem, IdType, TimelineEvents,
  TimelineOptions,
} from 'vis-timeline/esnext'

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

const dataSetItems = ref<DataInterfaceDataItem>(new DataSet(props.items))
const dataSetGroups = ref<DataInterfaceDataGroup>(new DataSet(props.groups))

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

</script>

<template>
  <div ref="timelineRef" />
</template>
