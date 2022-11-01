import { ref } from 'vue-demi'

import type { IDataSourceItem, IDataSourceRow } from '../types'

interface IColumn {
  key: string | number
  title: string
  width: number | string
  [k: string]: any
}

interface IRow {
  key: string | number
  [k: string]: any
}
interface IWrapDataResponse {
  columns: IColumn[]
  rows: IRow[]
  childrenKey: string
  rowKey: string
  children: string
}

export default function useDataSource(fn: (...args: any[]) => Promise<IWrapDataResponse>) {
  const dataSetSource: IDataSourceRow[] = []
  const dataSource = ref(dataSetSource)
  const columns = ref<IColumn[]>([])
  const rows = ref<IRow[]>([])

  if (fn) {
    fn().then(({ childrenKey, children, columns: _columns, rows: _rows, rowKey }) => {
      const columnsLength = _columns.length
      for (let i = 0; i < _rows.length; i++) {
        const row = _rows[i]
        const tr = []
        for (let j = 0; j < columnsLength; j++) {
          const value = row[children][j]

          let id = `${i}-${j}`
          if (childrenKey && value)
            id = value[childrenKey]

          const td: IDataSourceItem = {
            value, // `${i}-${j}`,
            id,
            selected: false,
            readonly: false,
            disabled: false,
            editing: false,
            locked: false,
          }
          tr.push(td)
        }
        dataSource.value.push({
          cells: tr,
          key: rowKey ? row[rowKey] : `row${i}`,
        })
      }
      columns.value = _columns
      rows.value = _rows
    })
  }

  return {
    columns,
    dataSource,
    rows,
  }
}
