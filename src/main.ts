import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

console.log('main.ts - Приложение запускается')

// Устанавливаем API URL, если не заданы через .env
if (!import.meta.env.VITE_API_BASE_URL) {
  // @ts-ignore
  import.meta.env.VITE_API_BASE_URL = 'http://localhost:3000/api/v1';
  // @ts-ignore
  import.meta.env.VITE_AUTH_API_BASE_URL = 'http://localhost:3000/api/v1/auth';
  // @ts-ignore
  import.meta.env.VITE_EDU_API_BASE_URL = 'http://localhost:3000/api/v1/edu';
  // @ts-ignore
  import.meta.env.VITE_GAME_API_BASE_URL = 'http://localhost:3000/api/v1/game';
  
  console.log('API URLs установлены программно:', import.meta.env.VITE_API_BASE_URL);
}

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
