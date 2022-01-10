<script setup lang="ts">
import './vis-timeline-graph2d.css'
import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline/esnext'
import type {
  DataGroup, DataItem, IdType, TimelineEvents, TimelineOptions,
} from 'vis-timeline/esnext'
import { nanoid } from 'nanoid'
import type { SvelteComponent } from 'svelte'
import moment from 'moment'
import EventTooltip from './EventTooltip.svelte'
import EventItem from './EventItem.svelte'
import EventGroup from './EventGroup.svelte'

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

const groupsApp = ref<Record<string, SvelteComponent>>({})
const itemsApp = ref<Record<string, SvelteComponent>>({})
const tooltipApp = ref<SvelteComponent>()

const options = ref<TimelineOptions>({
  editable: true,
  zoomKey: 'ctrlKey',
  align: 'center',
  horizontalScroll: true,
  verticalScroll: true,
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
  maxHeight: '400px',
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
  groupEditable: true,
  groupOrder: (a, b) => {
    return a.value - b.value
  },
  groupOrderSwap: (a, b, groups) => {
    const v = a.value
    a.value = b.value
    b.value = v
  },
  groupTemplate: (group) => {
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
      const confirm = window.confirm('Confirm remove')
      if (confirm)
        dataSetGroups.value.remove(group.id)
    })

    app.$on('update', (e) => {
      const group = e.detail
      const prompt = window.prompt('Update event', group.content)

      if (prompt) {
        group.content = prompt
        dataSetGroups.value.updateOnly(group)
      }
    })

    groupsApp.value[group.id] = app

    return containerEl
  },
})

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
    {
      ...options.value,
      ...props.options,
    },
  )
})

// watch(() => props.options, () => {
//   timeline.value?.setOptions(props.options)
// }, {
//   deep: true,
// })

// watch(() => props.selection, (newValue) => {
//   timeline.value?.setSelection(newValue)
// })

defineExpose({
  timeline,
  dataSetItems,
  dataSetGroups,
})

function addGroup() {
  const prompt = window.prompt('Add group', 'New group')
  if (prompt) {
    const value = groupsValue.value.length + 1
    dataSetGroups.value.add({
      id: nanoid(),
      content: `${prompt} ${value}`,
      value,
    })
  }
}
const date = ref(moment().format('DD/MM/YYYY'))

function onChangeDate(e: any) {
  date.value = moment(e.target.value).format('DD/MM/YYYY')
  timeline.value?.setWindow(moment(e.target.value).toDate(), moment(e.target.value).add(1, 'day').toDate())
}

</script>

<template>
  <div ref="timelineRef">
    <div class="absolute top-0 left-0 w-[calc(150px-16px)] z-1 flex items-center justify-center p-2">
      <button class="text-[#4d4d4d]" @click="addGroup">
        Add group
      </button>
    </div>

    <div class="absolute top-0 right-0 w-[calc(200px-16px)] z-1 flex flex-col justify-center">
      <label class="text-[#4d4d4d]" for="start"> Select Date</label>
      <input
        id="start" type="date"
        @change="onChangeDate"
      >
    </div>
  </div>
</template>
