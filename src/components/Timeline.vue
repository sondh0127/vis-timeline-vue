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
 * 10 days
* learning visjs basic example
 * dataset | group | item | options
 * https://visjs.github.io/vis-timeline/docs/timeline/
 * https://visjs.github.io/vis-timeline/examples/timeline/
 *
 * - build time-line (2d)
 * sync data items
 * sync data groups
 * set max-zoom: 1 day
 * set min-zoom: a minute
 *
 * - build channel timeline (2d)
 * event timeline(crud) | program timeline(display)
 * date picker
 * next/prev day
 *
 * - integrate
 * crud item: (1d)
 * add:
 * edit:
 * delete:
 * crud group(modal): (1d)
 *
 * crud with API (2d)
 *
 *
 * TODO:
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
