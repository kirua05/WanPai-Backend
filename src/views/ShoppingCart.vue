
<template>
  <div class="bg-black text-white min-h-screen">
    <!-- Top Bar -->
    <div class="flex justify-between items-center px-4 py-2">
      <div class="flex items-center space-x-3">
        <img src="../assets/img_shopping_cart/icon-mail.svg" alt="信箱" class="w-6 h-6 filter invert">
        <img src="../assets/img_shopping_cart/icon-info.svg" alt="資訊" class="w-6 h-6 filter invert">
        <img src="../assets/img_shopping_cart/icon-crown.svg" alt="等級" class="w-6 h-6 filter invert">
        <span class="user-level">玩具初心者</span>
        <img src="../assets/img_shopping_cart/icon-logout.svg" alt="登出" class="w-6 h-6 filter invert">
      </div>
      <div class="flex items-center space-x-4">
        <img v-for="icon in socials" :key="icon.alt" :src="icon.src" :alt="icon.alt" class="w-6 h-6 filter invert hover:opacity-75">
        <button class="p-2 hover:bg-gray-800 rounded">
          <!-- placeholder for search icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 2a8 8 0 105.291 14.291l4.146 4.146 1.414-1.414-4.146-4.146A8 8 0 0010 2zM4 10a6 6 0 1112 0 6 6 0 01-12 0z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Logo & Nav -->
    <header class="bg-black text-center pb-2">
      <h1 class="text-5xl font-extrabold text-yellow-400">玩拍</h1>
      <p class="text-2xl font-bold">WAN PAI</p>
      <nav class="mt-4">
        <ul class="flex flex-wrap justify-center space-x-4 text-sm">
          <li v-for="link in navLinks" :key="link.text" class="group relative">
            <a href="#" class="hover:text-yellow-400">{{ link.text }}</a>
            <!-- 動態下拉可依需求擴充 -->
          </li>
        </ul>
      </nav>
    </header>

    <!-- Cart Content -->
    <main class="container mx-auto mt-6 px-4 text-gray-900 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-semibold py-4 border-b">我的購物車</h2>

      <!-- Header Row -->
      <div class="grid grid-cols-7 bg-gray-800 text-white text-center py-3 font-medium">
        <div>品名</div>
        <div>規格</div>
        <div>數量</div>
        <div>單價</div>
        <div>小計</div>
        <div>刪除</div>
      </div>

      <!-- Items -->
      <div v-for="item in cartItems" :key="item.id" class="grid grid-cols-7 items-center border-b px-4 py-3 gap-4">
        <!-- 商品資訊 -->
        <div class="col-span-2 flex items-start space-x-3">
          <img :src="item.image" alt="商品圖" class="w-20 h-20 object-cover rounded">
          <div>
            <span class="inline-block bg-green-100 text-green-800 text-xs px-1 rounded">預計{{ item.delivery }}</span>
            <p class="font-medium mt-1">{{ item.title }}</p>
            <button class="mt-1 text-sm text-orange-600 hover:underline">點我享優惠加購</button>
          </div>
        </div>
        <div class="text-center">{{ item.variant }}</div>
        <div class="text-center">
          <select v-model.number="item.quantity" class="border border-gray-300 rounded px-2 py-1">
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <div class="text-center font-semibold">${{ item.price }}</div>
        <div class="text-center font-semibold">${{ item.price * item.quantity }}</div>
        <div class="text-center">
          <button @click="remove(item.id)" class="text-gray-400 hover:text-red-500">
            🗑️
          </button>
        </div>
      </div>

      <!-- 額外資訊 -->
      <section class="px-4 py-3 text-sm text-red-600 border-b">
        <!-- 靜態範例，可改綁 data -->
        <p><span class="bg-red-100 text-red-800 px-1 rounded">現金積點</span> 會員 滿 $100 元，現金積點回饋 2%（共 18 點）</p>
        <p class="mt-1 text-gray-500">詳細請參閱「現金積點規則」。</p>
        <div class="mt-2 flex items-center space-x-4">
          <label class="flex items-center"><input type="radio" name="discount" checked class="mr-1"/>不使用優惠</label>
          <label class="flex items-center"><input type="radio" name="discount" class="mr-1"/>優惠代碼</label>
        </div>
      </section>

      <div class="px-4 py-3 bg-gray-50 flex justify-between items-center text-sm border-b">
        <p>全館再 $4,342 元，抵 $222 元（尚未符合）</p>
        <a href="#" class="text-red-600 hover:underline">查看活動</a>
      </div>

      <div class="px-4 py-4 flex justify-between items-center">
        <span class="font-medium">小計</span>
        <span class="font-semibold text-lg">${{ subTotal }}</span>
      </div>
    </main>

    <!-- Shipping & Total -->
    <section class="container mx-auto mt-4 px-4">
      <div class="bg-white px-4 rounded-lg shadow overflow-hidden">
        <div class="px-4 py-3 flex justify-between items-center border-b">
          <span class="text-red-600">運費</span>
          <a href="#" class="text-red-600 hover:underline">前往下一步驟計算</a>
        </div>
        <div class="bg-gray-800 text-white">
          <div class="px-4 py-4 flex justify-between items-center">
            <span class="font-medium">總金額 (TWD)</span>
            <span class="font-bold text-xl">${{ total }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'

// 模擬購物車資料
const cartItems = reactive([
  {
    id: 1,
    image: '../assets/img_shopping_cart/test-product.png',
    delivery: '2025/11',
    title: '引進數量限定 MEGAHOUSE 榮耀傳承式樣…',
    variant: '單一規格',
    price: 880,
    quantity: 1,
  },
])

const subTotal = computed(() => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0))
const shipping = 0 // 實際可由 API 或 user input 設定
const total = computed(() => subTotal.value + shipping)

function remove(id) {
  const idx = cartItems.findIndex(i => i.id === id)
  if (idx !== -1) cartItems.splice(idx, 1)
}

// 社群 icon 資料
const socials = [
  { src: '../assets/img_shopping_cart/facebook.svg', alt: 'FB' },
  { src: '../assets/img_shopping_cart/line.svg', alt: 'Line' },
  { src: '../assets/img_shopping_cart/instagram.svg', alt: 'IG' },
  { src: '../assets/img_shopping_cart/youtube.svg', alt: 'YouTube' },
  { src: '../assets/img_shopping_cart/blog.svg', alt: 'Blog' },
]

// 導航連結
const navLinks = [
  { text: '首頁' },
  { text: '關於' },
  { text: '全部商品' },
  { text: 'BANDAI TAMASHII 魂' },
]
</script>
