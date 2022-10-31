<script lang="ts" setup>
import { ref } from 'vue-demi'
import { Checkbox, MessageBox } from 'element-ui'
// import Sheet from '@/components/Sheet/index.vue'

import item from '@/components/Item.vue'
import type { IScrollOffset } from '@/components/types'
import { useDataSource } from '@/components/hooks'
import vTable from '@/components/v-table.vue'
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
      <vTable :columns="columns" :data-source="dataSource" :item-component="item" @scroll="syncScroll">
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
      </vTable>
    </div>
  </div>
</template>

<style scoped>

</style>
