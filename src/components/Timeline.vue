<script setup lang="ts">
import './vis-timeline-graph2d.css'
import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline/esnext'
import type {
  DataGroup, DataInterfaceDataGroup, DataInterfaceDataItem,
  DataItem, IdType, TimelineEvents,
  TimelineOptions,
} from 'vis-timeline/esnext'

/**
 * - build time-line
 * sync data items
 * sync data groups
 *
 * learning visjs basic example
 * dataset | group | item | options
 * https://visjs.github.io/vis-timeline/docs/timeline/
 * https://visjs.github.io/vis-timeline/examples/timeline/
 *
 * set max-zoom: 1 day
 * set min-zoom: a minute
 *
 * - build channel timeline
 * event timeline(crud) | program timeline(display)
 *
 * date picker
 * next/prev day
 *
 * - integrate
 * crud item:
 * add:
 * edit:
 * delete:
 *
 * crud group (modal)
 *
 * crud with API
 *
 * learn some design from https://antoniandre.github.io/vue-cal/
 * improve styling
 */

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

const dataSetItems = ref<DataInterfaceDataItem>()
const dataSetGroups = ref<DataInterfaceDataGroup>()

onMounted(() => {
  if (!timelineRef.value) return

  dataSetItems.value = new DataSet(props.items)

  if (props.groups.length > 0) {
    dataSetGroups.value = new DataSet(props.groups)
    timeline.value = new Timeline(
      timelineRef.value,
      dataSetItems.value,
      dataSetGroups.value,
      props.options,
    )
  }
  else {
    timeline.value = new Timeline(timelineRef.value, dataSetItems.value, props.options)
  }
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
