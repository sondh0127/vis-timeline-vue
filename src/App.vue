<script setup lang="ts">
import type { DataGroup, DataItem, DataSetDataGroup, DataSetDataItem, Timeline, TimelineOptions } from 'vis-timeline/esnext'
import EventTimeline from './components/EventTimeline.vue'

interface TimelineExpose {
  timeline: Timeline
  dataSetItems: DataSetDataItem
  dataSetGroups: DataSetDataGroup
}

const eventTimelineRef = ref<TimelineExpose>()

const groups = useStorage<DataGroup[]>('__GROUPS__', [])

const items = useStorage<DataItem[]>('__ITEMS__', [])

const options = ref<TimelineOptions>()

</script>

<template>
  <h2 class="font-bold">
    Timeline Guide
  </h2>
  <div class="grid grid-cols-3">
    <div>
      <h3 class="font-semibold">
        Edit group
      </h3>
      <p>Add: Add group button</p>
      <p>Edit: Double click to group name</p>
      <p>Remove: Click => X</p>
    </div>
    <div>
      <h3 class="font-semibold">
        Edit item
      </h3>
      <p>Add: Window + Drag</p>
      <p>Edit time: Click => Drag|Resize</p>
      <p>Edit content: Double click</p>
      <p>Remove: Click => X</p>
    </div>
    <div>
      <h3 class="font-semibold">
        Navigation
      </h3>
      <p>Group view: Scroll wheel</p>
      <p>Item view: Shift + wheel</p>
      <p>Zoom: Ctrll + scroll wheel (configurable: 1h - 1d)</p>
      <p>Scroll to now: Right left button</p>
    </div>
  </div>

  <div class="p-10">
    <EventTimeline
      ref="eventTimelineRef"
      v-model:items="items"
      v-model:groups="groups"
      :options="options"
    />
  </div>
</template>
