<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const clickCount = ref(0)
const multiplier = ref(1)
const isAnimating = ref(false)
const lastClickTime = ref(Date.now())
const clicksPerSecond = ref(0)
const totalXPEarned = ref(0)
const popups = ref<{ id: number, value: number, x: number, y: number }[]>([])

interface Upgrade {
  id: number
  name: string
  description: string
  baseCost: number
  count: number
  xpPerSecond?: number
  multiplier?: number
  icon: string
}

const upgrades = ref<Upgrade[]>([
  {
    id: 1,
    name: 'Двойной клик',
    description: 'Удваивает количество XP за клик',
    baseCost: 100,
    count: 0,
    multiplier: 2,
    icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'
  },
  {
    id: 2,
    name: 'Автокликер',
    description: 'Автоматически кликает каждую секунду',
    baseCost: 500,
    count: 0,
    xpPerSecond: 1,
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    id: 3,
    name: 'Бустер XP',
    description: 'Увеличивает множитель XP на 50%',
    baseCost: 1000,
    count: 0,
    multiplier: 1.5,
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
  }
])

const calculateUpgradeCost = (upgrade: Upgrade) => {
  return Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.count))
}

const handleClick = () => {
  isAnimating.value = true
  
  const xpGained = Math.floor(multiplier.value)
  clickCount.value += xpGained
  totalXPEarned.value += xpGained

  // Создаем новый всплывающий элемент
  const id = Date.now()
  const angle = Math.random() * Math.PI * 2 // Случайный угол
  const distance = 40 + Math.random() * 20 // Случайное расстояние
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance

  popups.value.push({ id, value: xpGained, x, y })
  
  // Удаляем всплывающий элемент через 1 секунду
  setTimeout(() => {
    popups.value = popups.value.filter(popup => popup.id !== id)
  }, 1000)

  // Подсчет кликов в секунду
  const now = Date.now()
  const timeDiff = now - lastClickTime.value
  clicksPerSecond.value = 1000 / timeDiff
  lastClickTime.value = now

  // Обновление уровня пользователя
  if (authStore.currentUser) {
    authStore.addXP(xpGained)
  }

  setTimeout(() => {
    isAnimating.value = false
  }, 150)
}

const buyUpgrade = (upgrade: Upgrade) => {
  const cost = calculateUpgradeCost(upgrade)
  if (clickCount.value >= cost) {
    clickCount.value -= cost
    upgrade.count++
    
    // Применение эффектов апгрейда
    if (upgrade.multiplier) {
      multiplier.value *= upgrade.multiplier
    }
  }
}

// Автокликер
setInterval(() => {
  const autoClickerUpgrade = upgrades.value[1]
  if (autoClickerUpgrade.count > 0 && autoClickerUpgrade.xpPerSecond) {
    const xpGained = autoClickerUpgrade.count * autoClickerUpgrade.xpPerSecond * multiplier.value
    clickCount.value += xpGained
    totalXPEarned.value += xpGained
    
    if (authStore.currentUser) {
      authStore.addXP(Math.floor(xpGained))
    }
  }
}, 1000)
</script>

<template>
  <div class="space-y-8">
    <div class="text-center space-y-4">
      <h2 class="text-2xl font-bold text-gray-900">Кликер XP</h2>
      <p class="text-gray-600">Кликайте, чтобы заработать XP и улучшить своего персонажа!</p>
    </div>

    <!-- Основная область клика -->
    <div class="flex justify-center">
      <div class="relative">
        <button
          @click="handleClick"
          class="relative w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden group"
          :class="{ 'animate-click': isAnimating }"
        >
          <!-- Волны при клике -->
          <div class="absolute inset-0 bg-white opacity-20 scale-0 group-active:scale-100 transition-transform duration-500 rounded-full"></div>
          <div class="absolute inset-0 bg-white opacity-20 scale-0 group-active:scale-100 transition-transform duration-700 rounded-full"></div>
          
          <!-- Основной контент -->
          <div class="relative flex flex-col items-center justify-center space-y-1">
            <div class="text-2xl font-bold">{{ Math.floor(clickCount) }}</div>
            <div class="text-sm font-medium">XP</div>
          </div>

          <!-- Всплывающие числа -->
          <transition-group 
            name="popup" 
            tag="div" 
            class="absolute inset-0 pointer-events-none overflow-visible"
          >
            <div
              v-for="popup in popups"
              :key="popup.id"
              class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xl whitespace-nowrap"
              :style="{
                '--x': `${popup.x}px`,
                '--y': `${popup.y}px`
              }"
            >
              +{{ popup.value }}
            </div>
          </transition-group>
        </button>

        <!-- Индикатор кликов в секунду -->
        <div 
          class="absolute -top-2 -right-2 bg-white text-primary text-sm font-medium px-2 py-1 rounded-full shadow-md transform transition-transform"
          :class="{ 'scale-110': clicksPerSecond > 5 }"
        >
          {{ clicksPerSecond.toFixed(1) }} /сек
        </div>
      </div>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-primary">{{ Math.floor(multiplier * 100) / 100 }}x</div>
        <div class="text-sm text-gray-500">Множитель</div>
      </div>
      <div class="bg-white rounded-xl p-4 text-center">
        <div class="text-2xl font-bold text-primary">{{ Math.floor(totalXPEarned) }}</div>
        <div class="text-sm text-gray-500">Всего XP</div>
      </div>
    </div>

    <!-- Улучшения -->
    <div class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-900">Улучшения</h3>
      
      <div class="grid gap-4">
        <button
          v-for="upgrade in upgrades"
          :key="upgrade.id"
          @click="buyUpgrade(upgrade)"
          class="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow relative overflow-hidden group"
          :class="{ 'opacity-75 cursor-not-allowed': clickCount < calculateUpgradeCost(upgrade) }"
          :disabled="clickCount < calculateUpgradeCost(upgrade)"
        >
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium text-gray-900">{{ upgrade.name }}</h4>
              <p class="text-sm text-gray-500">{{ upgrade.description }}</p>
              <div class="text-xs text-gray-400 mt-1">
                Куплено: {{ upgrade.count }}
              </div>
            </div>
            <div class="text-primary font-medium">
              {{ Math.floor(calculateUpgradeCost(upgrade)) }} XP
            </div>
          </div>

          <!-- Индикатор возможности покупки -->
          <div 
            class="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300"
            :style="{ 
              width: `${Math.min(100, (clickCount / calculateUpgradeCost(upgrade)) * 100)}%` 
            }"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes click {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

.animate-click {
  animation: click 150ms ease-out;
}

.popup-enter-active,
.popup-leave-active {
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.popup-enter-from {
  opacity: 0;
  transform: translate(calc(-50% + 0px), calc(-50% + 0px)) scale(0.5);
}

.popup-enter-to {
  opacity: 0;
  transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1.5);
}

.popup-leave-from {
  opacity: 1;
  transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1);
}

.popup-leave-to {
  opacity: 0;
  transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1.5);
}
</style> 