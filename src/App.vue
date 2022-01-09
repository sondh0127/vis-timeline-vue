<script setup lang="ts">
import type { DataGroup, DataItem, DataSetDataGroup, DataSetDataItem, Timeline, TimelineOptions } from 'vis-timeline/esnext'
import type { SvelteComponent } from 'svelte'
import EventTimeline from './components/EventTimeline.vue'
import EventTooltip from './components/EventTooltip.svelte'
import EventItem from './components/EventItem.svelte'
import EventGroup from './components/EventGroup.svelte'

interface TimelineExpose {
  timeline: Timeline
  dataSetItems: DataSetDataItem
  dataSetGroups: DataSetDataGroup
}

const eventTimelineRef = ref<TimelineExpose>()

const groups = useStorage<DataGroup[]>('__GROUPS__', [])

// TODO: remove items app on delete
const items = useStorage<DataItem[]>('__ITEMS__', [])

const groupsApp = ref<Record<string, SvelteComponent>>({})
const itemsApp = ref<Record<string, SvelteComponent>>({})
const tooltipApp = ref<SvelteComponent>()

const options = ref<TimelineOptions>({
  editable: true,
  zoomKey: 'ctrlKey',
  align: 'center',
  horizontalScroll: true,
  zoomMin: 1000 * 60 * 60,
  zoomMax: 1000 * 60 * 60 * 24,
  // itemsAlwaysDraggable: true,
  showCurrentTime: true,
  start: (() => {
    const date = new Date()
    date.setHours(date.getHours() - 2)
    return date
  })(),
  end: (() => {
    const date = new Date()
    date.setHours(date.getHours() + 2)
    return date
  })(),
  orientation: 'top',
  minHeight: '150px',
  maxHeight: '300px',
  rollingMode: {
    follow: true,
    offset: 0.5,
  },
  template: (item, element, data) => {
    if (!item)
      return ''
    const id = `item-${item.id}`
    let containerEl = document.getElementById(id)
    if (containerEl) {
      itemsApp.value[item.id]?.$destroy()
    }
    else {
      containerEl = document.createElement('div')
      containerEl.id = id
    }

    itemsApp.value[item.id] = new EventItem({
      target: containerEl,
      props: { item },
    })

    return containerEl
  },
  tooltipOnItemUpdateTime: {
    template(item) {
      const id = `tooltip-${item.id}`
      let containerEl = document.getElementById(id)
      if (containerEl) {
        tooltipApp.value?.$destroy()
      }
      else {
        containerEl = document.createElement('div')
        containerEl.id = id
      }

      tooltipApp.value = new EventTooltip({
        target: containerEl,
        props: { item },
      })

      return containerEl.innerHTML
    },
  },
  onAdd: (item, callback) => {
    const alert = window.prompt('Add event', item.content)
    if (alert) {
      item.content = alert
      callback(item)
    }
    else {
      callback(null)
    }
  },
  onUpdate: (item, callback) => {
    const alert = window.prompt('Update event', item.content)
    if (alert) {
      item.content = alert
      callback(item)
    }
    else {
      callback(null)
    }
  },
  onMove: (item, callback) => {
    const confirm = window.confirm('Confirm move')
    callback(confirm ? item : null)
  },
  onRemove(item, callback) {
    const confirm = window.confirm('Confirm remove')
    callback(confirm ? item : null)
  },
  // groupEditable: true,
  groupTemplate(group) {
    if (!group)
      return ''
    const id = `group-${group.id}`
    let containerEl = document.getElementById(id)
    if (containerEl) {
      groupsApp.value[group.id]?.$destroy()
    }
    else {
      containerEl = document.createElement('div')
      containerEl.id = id
    }

    const app = new EventGroup({
      target: containerEl,
      props: { group },
    })

    app.$on('remove', (e) => {
      const group = e.detail
      eventTimelineRef.value?.dataSetGroups.remove(group.id)
    })

    app.$on('update', (e) => {
      const group = e.detail
      const prompt = window.prompt('Update event', group.content)

      if (prompt) {
        group.content = prompt
        eventTimelineRef.value?.dataSetGroups.updateOnly(group)
      }
    })

    groupsApp.value[group.id] = app

    return containerEl
  },
})

</script>

<template>
  <h2>Timeline</h2>
  <EventTimeline
    ref="eventTimelineRef"
    v-model:items="items"
    v-model:groups="groups"
    :options="options"
  />
</template>
