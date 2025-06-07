import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

console.log('main.ts - Приложение запускается')

// Обработчик ошибок
window.addEventListener('error', (event) => {
  console.error('Глобальная ошибка:', event.error)
})

// Моки отключены, используем реальный API
console.log('🔧 Используется реальный API-сервер')

// Создаем экземпляр приложения
const app = createApp(App)

// Настраиваем обработчик ошибок Vue
app.config.errorHandler = (err, instance, info) => {
  console.error('Ошибка Vue:', err)
  console.error('Информация:', info)
}

// Подключаем плагины
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Монтируем приложение
console.log('main.ts - Монтирование приложения')
app.mount('#app')
console.log('main.ts - Приложение смонтировано')
