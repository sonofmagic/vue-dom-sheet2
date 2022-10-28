import { ref } from 'vue-demi'
import dayjs from 'dayjs'
import type { IDataSourceItem, IDataSourceRow } from '../types'

export default function useDataSource() {
  const dataSetSource: IDataSourceRow[] = []
  const columns = ref<
    {
      key: string | number
      title: string
      width: number | string
    }[]
  >([])
  const firstDay = dayjs().startOf('M')
  for (let i = 0; i < 30; i++) {
    columns.value.push({
      width: 120,
      title: firstDay.add(i, 'day').format('YYYY-MM-DD'),
      key: i,
    })
  }
  for (let i = 0; i < 1000; i++) {
    const tr = []
    for (let j = 0; j < 30; j++) {
      const td: IDataSourceItem = {
        value: undefined, // `${i}-${j}`,
        id: `${i}-${j}`,
        selected: false,
        readonly: false,
        disabled: false,
        editing: false,
        locked: false,
        note: '',
      }
      tr.push(td)
    }
    dataSetSource.push({
      cells: tr,
      key: `row${i}`,
    })
  }
  const dataSource = ref(dataSetSource)
  return {
    columns,
    dataSource,
  }
}
