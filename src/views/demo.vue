<script lang="ts" setup>
import { h, ref } from 'vue-demi'
import { Checkbox, MessageBox } from 'element-ui'
import Item from './item.vue'
import type { ICellAttrs, IScrollOffset } from '@/components/exports'
import { Sheet, SheetCell, useDataSource } from '@/components/exports'
const { columns, dataSource } = useDataSource()
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

const closeContextMenu = ({ menuContext }) => {
  menuContext.close()
}

function doLock({ menuContext, selectedCellSet }) {
  selectedCellSet?.forEach((x) => {
    if (x.value)
      x.locked = true
  })
  menuContext.close()
}

function unlock({ menuContext, selectedCellSet }) {
  selectedCellSet?.forEach((x) => {
    x.locked = false
  })
  menuContext.close()
}

async function doNote({ menuContext, selectedCellSet }) {
  if (selectedCellSet) {
    const isSingle = selectedCellSet.size === 1
    const defaultValue = isSingle ? Array.from(selectedCellSet.values())[0].note : ''
    const res = await onPrompt({
      defaultValue,
      isSingle,
    })

    selectedCellSet?.forEach((x) => {
      // @ts-expect-error
      x.note = res.value
    })
  }
}

function doSetValue({ menuContext, selectedCellSet }, value?: number) {
  selectedCellSet.forEach((x) => {
    x.value = value
  })
  menuContext.close()
}

const selectValue: (e: MouseEvent, attrs: ICellAttrs, value: unknown) => void = (e, attrs, value) => {
  e.stopPropagation()

  if (attrs)
    attrs.item.value = value
}

const itemScopedSlots = {
  default: (props) => {
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
                  <Checkbox />
                  选中第{{ idx + 1 }}行
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <Sheet :columns="columns" :dataSource="dataSource" @scroll="syncScroll"></Sheet> -->
      <Sheet :item-scoped-slots="itemScopedSlots" :columns="columns" :data-source="dataSource" :item-component="SheetCell" @scroll="syncScroll">
        <template #context-menu="ctx">
          <div class="w-32 text-center">
            <div class="w-32 text-center">
              <div
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
              </div>
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
              <div class="hover:bg-blue-200 hover:text-blue-600 px-4 py-1 cursor-pointer" @click="doSetValue(ctx, 1)">
                set(1)
              </div>
              <div class="hover:bg-blue-200 hover:text-blue-600 px-4 py-1 cursor-pointer" @click="doSetValue(ctx, 2)">
                set(2)
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
              {{ attrs?.item.value }}的值啊啊
            </div>
            <div class="text-[#333333]">
              11:11-33:22 24.00h
            </div>
            <div v-if="attrs?.item.note" class="text-[#B1B9CC]">
              备注:{{ attrs?.item.note }}
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