<script lang="ts">
import type {  DataItem } from 'vis-timeline/esnext'

export let item: DataItem
</script>

<div>{item.start}</div>
<div>{item.end}</div>
