import { ref, watch } from 'vue-demi'
import type { Ref } from 'vue-demi'
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
  children?: string
}

function noop(x: unknown) { return x }

function createTransformMethod(res: IWrapDataResponse, dataSourceRef: Ref<IDataSourceRow<unknown>[]>) {
  const { childKey, children = 'children', columns, rowKey } = res

  return function transform(rows: IRow[]) {
    const columnsLength = columns.length
    const data: IDataSourceRow[] = []
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const tr = []
      for (let j = 0; j < columnsLength; j++) {
        const value = row[children][j]
        const y = i + dataSourceRef.value.length
        const x = j
        let id = `${y}-${x}`
        // console.log(i, dataSourceRef.value.length)
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
          x,
          y,
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
  let config: IWrapDataResponse | undefined
  if (fn) {
    config = fn()
    transform = createTransformMethod(config, dataSource)
    columns.value = config.columns
  }

  watch(columns, (nv) => {
    transform = createTransformMethod({
      ...config,
      columns: nv,
    }, dataSource)
  })

  return {
    columns,
    dataSource,
    transform,
    // rows,
  }
}
