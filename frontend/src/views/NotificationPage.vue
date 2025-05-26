<template>
  <div class="notification-page">
    <h2 class="notification-title">我的通知</h2>

    <div class="notification-layout">
      <!-- 左側分類 -->
      <aside class="notification-sidebar">
        <ul class="notification-menu">
          <li
            class="notification-menu-item"
            v-for="(item, index) in categories"
            :key="index"
            :class="{ active: selectedCategory === item.type }"
            @click="selectedCategory = item.type"
          >
            {{ item.label }}
            <span v-if="hasUnread(item.type)" class="unread-dot"></span>
          </li>
        </ul>
      </aside>

      <!-- 右側通知內容 -->
      <section v-if="selectedCategory" class="notification-content">
        <div class="notification-header">
          <span>{{ currentLabel }}</span>
          <span class="notification-count">共 {{ filteredNotifications.length }} 條</span>
        </div>

        <Divider class="my-2" />

        <div
          class="notification-item"
          v-for="(item, index) in filteredNotifications"
          :key="index"
          @click="toggleExpanded(item)"
        >
          <!-- 一律顯示時間 + 紅點 -->
          <p class="notification-time">
            {{ item.time }}
            <span v-if="!item.read" class="dot-icon pi pi-circle-fill"></span>
          </p>

          <!-- 點開後才顯示細節 -->
          <div v-if="item.expanded">
            <p class="notification-message">
              <strong class="notification-username">{{ item.username }}</strong>
              {{ item.message }}
            </p>
            <p class="notification-order-id">訂單編號：{{ item.orderId }}</p>
          </div>

          <!-- 加分隔線，但最後一筆不加 -->
          <Divider
            v-if="index < filteredNotifications.length - 1"
            class="my-3"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Divider from 'primevue/divider'

const categories = ref([
  { label: '訂單訊息', type: 'order' },
  { label: '帳戶訊息', type: 'account' },
  { label: '優惠相關', type: 'promo' },
])

const selectedCategory = ref('order')

const notifications = ref([
  {
    type: 'order',
    time: '2024-09-16 10:04',
    username: '會員名稱',
    message: '您好，感謝您購買本站商品，商品訂單已成立',
    orderId: '2024090801004604613',
    read: false,
    expanded: false,
  },
  {
    type: 'promo',
    time: '2024-09-01 08:20',
    username: '系統訊息',
    message: '限時優惠 88 折，立即搶購！',
    orderId: '',
    read: true,
    expanded: false,
  },
])

const filteredNotifications = computed(() =>
  notifications.value.filter((n) => n.type === selectedCategory.value)
)

const currentLabel = computed(() =>
  categories.value.find((c) => c.type === selectedCategory.value)?.label || ''
)

function toggleExpanded(item) {
  item.expanded = !item.expanded
  if (!item.read) {
    item.read = true
  }
}

function hasUnread(type) {
  return notifications.value.some((n) => n.type === type && !n.read)
}
</script>

<style scoped>
.notification-page {
  padding: 24px;
  font-family: sans-serif;
}

.notification-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  margin-left: 32px;
}

.notification-layout {
  display: flex;
  gap: 24px;
}

.notification-sidebar {
  width: 160px;
}

.notification-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-menu-item {
  background-color: #e9e9e9;
  padding: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  text-align: center;
  border-radius: 4px;
  position: relative;
}

.notification-menu-item.active {
  background-color: #333;
  color: white;
}

.unread-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #d9534f;
  border-radius: 50%;
  margin-left: 6px;
}

.notification-content {
  flex: 1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #888;
  font-size: 14px;
  padding-left: 24px;
  padding-right: 24px;
}

.notification-item {
  padding: 8px 24px;
  cursor: pointer;
}

.notification-time {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.dot-icon {
  font-size: 8px;
  color: #d9534f;
}

.notification-message {
  font-size: 16px;
  margin-bottom: 4px;
}

.notification-username {
  color: #d9534f;
}

.notification-order-id {
  font-size: 14px;
  color: #444;
}

.notification-count {
  font-size: 14px;
}
</style>
