<script lang="ts">
import type {  DataGroup } from 'vis-timeline/esnext'
import { createEventDispatcher } from 'svelte'

export let group: DataGroup

const dispatch = createEventDispatcher()

function removeGroup() {
  dispatch('remove', group)
}

function updateGroup() {
  dispatch('update', group)
}

</script>

<div class="select-none flex" on:dblclick={updateGroup}>
  <span title="double click to edit" class="cursor-pointer">{group.content}</span>
  <button class="ml-2 rounded-full border w-6 h-6" on:click={removeGroup}>X</button>
</div>
