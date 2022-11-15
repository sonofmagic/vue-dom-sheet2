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
  // rows: IRow[]
  childKey?: string
  rowKey?: string
  children: string
}

function noop() { }

function createTransformMethod(res: IWrapDataResponse) {
  const { childKey, children, columns, rowKey } = res

  return function transform(rows: IRow[]) {
    const columnsLength = columns.length
    const data: IDataSourceRow[] = []
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const tr = []
      for (let j = 0; j < columnsLength; j++) {
        const value = row[children][j]
        // 这个默认在所有的 cell 里，不是唯一的
        // 因为有可能数据是懒加载获取的，每次用户滚动到底部才重新获取
        // 所以这个id，其中的 i ，是远程 fetch 到数据的 index, 每次是从0开始的!
        let id = `${i}-${j}`
        if (childKey && value)
          id = value[childKey]

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
      data.push({
        cells: tr,
        key: rowKey ? row[rowKey] : `row${i}`,
        row,
      })
    }
    return data
  }
}

export default function useDataSource(fn: (...args: any[]) => IWrapDataResponse) {
  const dataSetSource: IDataSourceRow[] = []
  const dataSource = ref(dataSetSource)
  const columns = ref<IColumn[]>([])
  // const rows = ref<IRow[]>([])
  let transform: ReturnType<typeof createTransformMethod> | typeof noop = noop
  if (fn) {
    const res = fn()
    transform = createTransformMethod(res)
    columns.value = res.columns
  }

  return {
    columns,
    dataSource,
    transform,
    // rows,
  }
}
