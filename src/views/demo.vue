<script lang="ts" setup>
import { h, ref } from 'vue-demi'
import { Checkbox, MessageBox } from 'element-ui'
import dayjs from 'dayjs'
// @ts-expect-error
import { cloneDeep } from 'lodash-es'
import Item from './item.vue'
import type { ContextMenuSlotContext, ICellAttrs, IScrollOffset, ItemComponentProps, VSheetType } from '@/components/exports'
import { Sheet, SheetCell, useDataSource, vScrollbar } from '@/components/exports'
const sheetRef = ref<VSheetType>()
const { columns, dataSource } = useDataSource(async () => {
  const { data } = await import('./mock.json')
  console.log(data)
  const columns = []
  const rows = data
  const columnsLength = 30
  const firstDay = dayjs().startOf('M')
  for (let i = 0; i < columnsLength; i++) {
    columns.push({
      width: 120,
      title: firstDay.add(i, 'day').format('YYYY-MM-DD'),
      key: i,
    })
  }

  return {
    columns,
    rows,
    // childrenKey: 'shiftId',
    rowKey: 'personId',
    children: 'shiftList',
  }
})
const dom = ref<HTMLDivElement>()
const syncScroll = ({ scrollLeft, scrollTop }: IScrollOffset) => {
  if (dom.value) {
    dom.value.scrollLeft = scrollLeft
    dom.value.scrollTop = scrollTop
  }
}

const onPrompt = ({ defaultValue, isSingle }: { isSingle: boolean; defaultValue?: string }) => {
  return MessageBox.prompt('', '添加备注', {
    inputType: 'textArea',
    inputValue: defaultValue,
    inputPlaceholder: '请输入备注',
    closeOnClickModal: false,
    closeOnPressEscape: false,
  })
}

const closeContextMenu = ({ menuContext }: ContextMenuSlotContext) => {
  menuContext.close()
}

function doLock({ menuContext, selectedCellSet }: ContextMenuSlotContext) {
  selectedCellSet?.forEach((x) => {
    if (x.value)
      x.locked = true
  })
  menuContext.close()
}

function unlock({ menuContext, selectedCellSet }: ContextMenuSlotContext) {
  selectedCellSet?.forEach((x) => {
    x.locked = false
  })
  menuContext.close()
}

async function doNote({ menuContext, selectedCellSet }: ContextMenuSlotContext) {
  if (selectedCellSet) {
    const isSingle = selectedCellSet.size === 1
    // @ts-expect-error
    const defaultValue = isSingle ? Array.from(selectedCellSet.values())[0].value.remark : ''
    const res = await onPrompt({
      defaultValue,
      isSingle,
    })

    selectedCellSet?.forEach((x) => {
      // @ts-expect-error
      x.value.remark = res.value
    })
  }
}

function doSetValue({ menuContext, selectedCellSet }: ContextMenuSlotContext, value?: unknown) {
  selectedCellSet.forEach((x) => {
    x.value = cloneDeep(value)
  })
  menuContext.close()
}

function setDisabled({ selectedCellSet, menuContext }: ContextMenuSlotContext, flag: boolean) {
  selectedCellSet.forEach((x) => {
    x.disabled = flag
  })
  menuContext.close()
}

const selectValue: (e: MouseEvent, attrs: ICellAttrs, value: unknown) => void = (e, attrs, value) => {
  e.stopPropagation()

  if (attrs)
    attrs.item.value = value
}

const itemScopedSlots = {
  default: (props: ItemComponentProps) => {
    return h(Item, {
      props,
    })
  },
}
</script>

<template>
  <div class="max-w-[100vw] max-h-[100vh]">
    <div class="flex relative p-16 h-screen">
      <div class="mr-2 flex-shrink-0 w-[200px] flex flex-col">
        <div class="text-lg p-2 h-[48px] flex-shrink-0">
          阿斯蒂芬
        </div>
        <div ref="dom" class="flex-1 overflow-y-hidden">
          <div class="table border-collapse w-full">
            <div class="table-row-group">
              <div v-for="(row, idx) in dataSource" :key="row.key" class="h-[48px] border table-row">
                <div class="table-cell p-2">
                  <Checkbox
                    :true-label="true" :false-label="false"
                    @change="(v) => sheetRef?.selectRow(idx, v)"
                  />
                  选中第{{ idx + 1 }}行
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <Sheet :columns="columns" :dataSource="dataSource" @scroll="syncScroll"></Sheet> -->
      <Sheet
        ref="sheetRef" :item-scoped-slots="itemScopedSlots" :columns="columns" :data-source="dataSource"
        :item-component="SheetCell" @scroll="syncScroll"
      >
        <template #context-menu="ctx">
          <div class="w-32 text-center">
            <div class="w-32 text-center">
              <!-- <div
                class="hover:bg-blue-200 hover:text-blue-600 px-4 py-1 cursor-pointer"
                @click="closeContextMenu(ctx)"
              >
                复制
              </div>
              <div
                class="hover:bg-blue-200 hover:text-blue-600 px-4 py-1 cursor-pointer"
                @click="closeContextMenu(ctx)"
              >
                粘贴
              </div> -->
              <div class="hover:bg-blue-200 hover:text-blue-600 px-4 py-1 cursor-pointer" @click="doLock(ctx)">
                锁定
              </div>
              <div class="hover:bg-blue-200 hover:text-blue-600 px-4 py-1 cursor-pointer" @click="unlock(ctx)">
                解锁
              </div>
              <div class="hover:bg-blue-200 hover:text-blue-600 px-4 py-1 cursor-pointer" @click="doNote(ctx)">
                备注
              </div>
              <div
                class="hover:bg-blue-200 hover:text-blue-600 px-4 py-1 cursor-pointer"
                @click="setDisabled(ctx, true)"
              >
                禁用
              </div>
              <div
                class="hover:bg-blue-200 hover:text-blue-600 px-4 py-1 cursor-pointer"
                @click="setDisabled(ctx, false)"
              >
                解禁
              </div>
              <div
                class="hover:bg-blue-200 hover:text-blue-600 px-4 py-1 cursor-pointer"
                @click="closeContextMenu(ctx)"
              >
                行/列复制
              </div>
              <div
                class="hover:bg-blue-200 hover:text-blue-600 px-4 py-1 cursor-pointer"
                @click="closeContextMenu(ctx)"
              >
                复制上一区间
              </div>
              <div
                class="hover:bg-blue-200 hover:text-blue-600 px-4 py-1 cursor-pointer" @click="doSetValue(ctx, {
                  name: '测试数据',
                  startTime: '11:11',
                  endTime: '11:11',
                  remark: '',
                })"
              >
                set value
              </div>
              <div class="hover:bg-blue-200 hover:text-blue-600 px-4 py-1 cursor-pointer" @click="doSetValue(ctx)">
                clear
              </div>
            </div>
          </div>
        </template>
        <template #detail="{ attrs }">
          <div class="bg-white w-[160px] text-xs border px-2 py-1 space-y-1">
            <div class="text-[13px] text-[#333333]">
              {{ attrs?.item.value.name }}
            </div>
            <div class="text-[#333333]">
              {{ attrs?.item.value.startTime }}-{{ attrs?.item.value.endTime }} {{ attrs?.item.value.duration }}h
            </div>
            <div v-if="attrs?.item.value.remark" class="text-[#B1B9CC]">
              备注:{{ attrs?.item.value.remark }}
            </div>
          </div>
        </template>
        <template #value-selector="{ attrs }">
          <div class="bg-white w-[360px] p-2 border">
            <div>未定义</div>
            <input class="border" placeholder="请输入">
            <div class="overflow-auto h-[200px]">
              <div
                v-for="i in 30" :key="i" class="flex justify-around cursor-pointer hover:bg-blue-300"
                @click="selectValue($event, attrs, i)"
              >
                <div class="flex-1">
                  撒大声地
                </div>
                <div class="flex-1">
                  {{ i }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </Sheet>
    </div>
  </div>
</template>

<style scoped>

</style>
