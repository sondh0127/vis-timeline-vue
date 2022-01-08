<script setup lang="ts">
import type { DataGroup, DataItem, TimelineOptions } from 'vis-timeline/esnext'
import type { SvelteComponent } from 'svelte'
import Timeline from './components/Timeline.vue'
import EventTooltip from './components/EventTooltip.vue'
import EventItem from './components/EventItem.svelte'

const timeline = ref()

const groups = useStorage<DataGroup[]>('__GROUPS__', [
  {
    id: 0,
    content: 'Group 1',
  },
])

const items = useStorage<DataItem[]>('__ITEMS__', [])
window.$apps = new Map<string, SvelteComponent>()

const options = ref<TimelineOptions>({
  editable: true,
  zoomKey: 'ctrlKey',
  align: 'center',
  horizontalScroll: true,
  zoomMin: 1000 * 60 * 60,
  zoomMax: 1000 * 60 * 60 * 24,
  itemsAlwaysDraggable: true,
  showCurrentTime: true,
  orientation: 'top',
  minHeight: '150px',
  maxHeight: '300px',
  rollingMode: {
    follow: true,
    offset: 0.5,
  },
  template: (item, element, data) => {
    let containerEl = document.getElementById(item.id)
    if (containerEl) {
      window.$apps.get(item.id)?.$destroy()
    }
    else {
      containerEl = document.createElement('div')
      containerEl.id = item.id
    }

    window.$apps.set(item.id, new EventItem({
      target: containerEl,
      props: { item },
    }))

    return containerEl
  },
  tooltipOnItemUpdateTime: {
    template(item) {
      let containerEl = document.getElementById(`${item.id}-tooltip`)
      if (containerEl) {
        window.$tooltip?.$destroy()
      }
      else {
        containerEl = document.createElement('div')
        containerEl.id = `${item.id}-tooltip`
      }

      window.$tooltip = new EventItem({
        target: containerEl,
        props: { item },
      })

      return containerEl.innerHTML
    },
  },
  onAdd: (item, callback) => {
    const alert = window.prompt('Add event', item.content)
    item.content = alert!
    callback(item)
  },
  onMove: (item, callback) => {
    const confirm = window.confirm('Confirm move')
    callback(confirm ? item : null)
  },
  onRemove(item, callback) {
    const confirm = window.confirm('Confirm remove')
    callback(confirm ? item : null)
  },
})

</script>

<template>
  <h2>Timeline</h2>
  <Timeline
    ref="timeline"
    v-model:items="items"
    v-model:groups="groups"
    :options="options"
  />
</template>
