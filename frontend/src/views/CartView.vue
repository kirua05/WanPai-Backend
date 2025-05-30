<template>
  <div class="bg-black text-white min-h-screen flex flex-col">
    <main class="flex-1 px-4 py-6 bg-gray-100 text-black">
      <div class="container mx-auto p-4 bg-white rounded shadow">
        <h1 class="text-2xl font-bold mb-6 text-gray-800">我的購物車</h1>

        <!-- 購物車列表 -->
        <div class="overflow-x-auto">
          <DataTable
            :value="cart.items"
            v-model:selection="selectedItems"
            dataKey="id"
            class="p-datatable-sm"
            :pt="{
              table: 'min-w-full',
              thead: 'bg-gray-800 text-white',
              headerRow: 'border-b border-gray-700',
              headerCell: 'px-4 py-2',
              tbody: 'bg-white',
              bodyRow: 'border-b border-gray-200 hover:bg-gray-50',
              bodyCell: 'px-4 py-4 text-gray-900',
              checkbox: {
                root: 'cursor-pointer'
              }
            }"
          >
            <Column selectionMode="multiple" headerStyle="width: 3rem">
              <template #header>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    class="cursor-pointer w-4 h-4 bg-white"
                  />
                </div>
              </template>
              <template #body="{ data, checked }">
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    :checked="checked" 
                    class="cursor-pointer w-4 h-4"
                    @change="handleCheckboxChange(data, $event)"
                  />
                </div>
              </template>
            </Column>
            
            <Column field="title" header="品名">
              <template #body="{ data }">
                <div class="flex items-center space-x-4 h-full">
                  <img
                    v-if="data.image"
                    :src="data.image"
                    alt=""
                    class="w-20 h-20 object-cover rounded"
                  />
                  <div class="flex-1 flex flex-col justify-center">
                    <div v-if="data.eta" class="text-sm text-gray-500 mb-1">
                      預計 {{ data.eta }} 出貨
                    </div>
                    <div class="font-medium text-gray-800">{{ data.title }}</div>
                  </div>
                </div>
              </template>
            </Column>

            <Column field="qty" header="數量">
              <template #body="{ data }">
                <select
                  v-model.number="data.qty"
                  @change="updateQty(data.id, data.qty)"
                  class="border rounded px-2 py-1"
                >
                  <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                </select>
              </template>
            </Column>

            <Column field="price" header="單價">
              <template #body="{ data }">
                {{ formatCurrency(data.price) }}
              </template>
            </Column>

            <Column header="刪除">
              <template #body="{ data }">
                <button
                  @click="remove(data.id)"
                  class="text-red-600 hover:text-red-800 text-2xl focus:outline-none cursor-pointer"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- 已選項目與合計 -->
        <div class="mt-4 text-gray-700">
          已選 {{ selectedCount }} 項，合計 {{ formatCurrency(selectedTotal) }}
        </div>

        <!-- 小計 & 運費 & 總金額 -->
        <div class="mt-6 bg-white shadow rounded p-4">
          <div class="flex justify-between items-center border-b pb-2">
            <span>小計</span>
            <span class="font-medium">{{ formatCurrency(selectedTotal) }}</span>
          </div>
          <div class="flex justify-between items-center border-b py-2">
            <span>運費</span>
            <span class="font-medium">{{ formatCurrency(shipping) }}</span>
          </div>
          <div class="flex justify-between items-center pt-2">
            <span class="font-semibold">總金額 (TWD)</span>
            <span class="text-xl font-bold">
              {{ formatCurrency(selectedTotal + shipping) }}
            </span>
          </div>
          <!-- 前往結帳 按鈕 -->
          <div class="flex justify-end mt-4">
            <Button
              label="前往結帳"
              icon="pi pi-shopping-cart"
              severity="primary"
              size="large"
              @click="checkout"
              :pt="{
                root: 'bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center cursor-pointer',
                icon: 'mr-2 order-first',
                label: 'text-base order-last'
              }"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, computed, watch } from 'vue'
import { useCartStore } from '@/stores/cart'
import Button from '@/volt/Button.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { testItems } from '@/components/CartItem.vue'

// Pinia 購物車狀態
const cart = useCartStore()

// 選中的商品列表
const selectedItems = ref([])

// 計算選中項目數量和金額
const selectedCount = computed(() => selectedItems.value.length)

const selectedTotal = computed(() => {
  if (!selectedItems.value || selectedItems.value.length === 0) return 0
  return selectedItems.value.reduce((sum, item) => {
    const price = Number(item.price) || 0
    const qty = Number(item.qty) || 0
    return sum + (price * qty)
  }, 0)
})

// 運費狀態
const state = reactive({ 
  shipping: 0 
})

// 計算運費
function calculateShipping() {
  state.shipping = selectedItems.value && selectedItems.value.length > 0 ? 100 : 0
}

// 監聽選中項目變化以更新運費
watch(selectedItems, () => {
  calculateShipping()
}, { deep: true })

// 開發階段種子資料
onMounted(() => {
  if (!cart.items.length) {
    testItems.forEach(item => cart.add(item))
  }
})

function updateQty(id, qty) {
  cart.updateQty(id, qty)
}

function remove(id) {
  cart.remove(id)
  selectedItems.value = selectedItems.value.filter(item => item.id !== id)
}

const formatCurrency = (value) =>
  new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

const { shipping } = toRefs(state)

// 處理 checkbox 變化
function handleCheckboxChange(data, event) {
  const isChecked = event.target.checked
  if (isChecked) {
    if (!selectedItems.value.find(item => item.id === data.id)) {
      selectedItems.value = [...selectedItems.value, data]
    }
  } else {
    selectedItems.value = selectedItems.value.filter(item => item.id !== data.id)
  }
  calculateShipping()
}
</script>

<style scoped>
.bg-gray-100 {
  background-color: #f7fafc;
}
.text-black {
  color: #2d3748;
}
</style>
