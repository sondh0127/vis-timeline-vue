// import { DataSet } from 'vis-data'

const arrayDiff = (arr1: any[], arr2: any[]) => arr1.filter(x => !arr2.includes(x))

const translateEvent = (event: string) => {
  return event.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

// function mountVisData(props, propName) {
//   let data = props[propName]
//   // If data is DataSet or DataView we return early without attaching our own events
//   if (!(props[propName] instanceof DataSet || props[propName] instanceof DataView)) {
//     data = new DataSet(props[propName])
//     // Rethrow all events
//     data.on('*', (event, properties, senderId) =>
//       props.$emit(`${propName}-${event}`, { event, properties, senderId }),
//     )
//     // We attach deep watcher on the prop to propagate changes in the DataSet
//     const callback = (value) => {
//       if (Array.isArray(value)) {
//         const newIds = new DataSet(value).getIds()
//         const diff = arrayDiff(props.visData[propName].getIds(), newIds)
//         props.visData[propName].update(value)
//         props.visData[propName].remove(diff)
//       }
//     }
//     props.$watch(propName, callback, {
//       deep: true,
//     })
//   }

//   // Emitting DataSets back
//   emit(`${propName}-mounted`, data)

//   return data
// }

export { arrayDiff, translateEvent }
