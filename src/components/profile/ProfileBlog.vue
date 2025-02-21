<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

// Проверяем, является ли текущий пользователь владельцем профиля
const isOwner = computed(() => {
  return authStore.currentUser?.id === Number(route.params.id)
})

// Состояние для нового поста
const newPost = ref({
  title: '',
  content: '',
  isPreview: false,
  image: '',
  courseLink: '',
  courseName: ''
})

// Имитация списка постов
const posts = ref([
  {
    id: 1,
    title: 'Мой путь в программировании',
    content: 'Сегодня я хочу поделиться своим опытом изучения программирования. Начал я с простых HTML и CSS, затем перешел к JavaScript...',
    date: '2024-03-15',
    likes: 24,
    comments: [
      {
        id: 1,
        author: 'Иван Закомалдин',
        avatar: '/images/Ivan.jpg',
        content: 'Отличная статья! Очень мотивирует на дальнейшее изучение.',
        date: '2024-03-15'
      },
      {
        id: 2,
        author: 'Матвей Ручин',
        avatar: '/images/Math.jpg',
        content: 'Полностью согласен, сам прошел похожий путь.',
        date: '2024-03-15'
      },
      {
        id: 3,
        author: 'Арсений Канеп',
        avatar: '/images/Arseniy.jpg',
        content: 'Было бы интересно узнать больше про твой опыт с фреймворками.',
        date: '2024-03-15'
      }
    ],
    isLiked: false,
    image: '',
    courseLink: '',
    courseName: '',
    showAllComments: false
  },
  {
    id: 2,
    title: 'Топ-5 курсов для начинающих',
    content: 'После прохождения множества курсов, я выбрал самые полезные для новичков. Вот мой список рекомендаций...',
    date: '2024-03-10',
    likes: 42,
    comments: [
      {
        id: 1,
        author: 'Матвей Ручин',
        avatar: '/images/Math.jpg',
        content: 'Спасибо за подборку! Обязательно посмотрю эти курсы.',
        date: '2024-03-10'
      }
    ],
    isLiked: false,
    image: 'https://picsum.photos/800/400',
    courseLink: '/courses/1',
    courseName: 'Основы Vue.js 3',
    showAllComments: false
  }
])

// Добавляем новое состояние для комментария
const newComment = ref('')

// Создание нового поста
const createPost = () => {
  if (!newPost.value.title || !newPost.value.content) return

  posts.value.unshift({
    id: Date.now(),
    title: newPost.value.title,
    content: newPost.value.content,
    date: new Date().toISOString().split('T')[0],
    likes: 0,
    comments: [],
    isLiked: false,
    image: newPost.value.image,
    courseLink: newPost.value.courseLink,
    courseName: newPost.value.courseName,
    showAllComments: false
  })

  // Очищаем форму
  newPost.value = {
    title: '',
    content: '',
    isPreview: false,
    image: '',
    courseLink: '',
    courseName: ''
  }
}

const toggleLike = (post: any) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

// Обновляем функцию форматирования даты
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // Если прошло меньше 24 часов, показываем время
  if (diff < 24 * 60 * 60 * 1000) {
    return new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  // Если прошло меньше недели, показываем день недели и время
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return new Intl.DateTimeFormat('ru-RU', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  // Иначе показываем полную дату
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Добавляем типизацию для иконок курсов
type CourseIconsType = {
  [key: string]: string;
}

const courseIcons: CourseIconsType = {
  'Основы Vue.js 3': 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z M13 10V3L4 14h7v7l9-11h-7z',
  'TypeScript для профессионалов': 'M13.325 3.05L8.667 20.432l-1.485-.315L11.841 2.5l1.484.55z M7.612 18.361l1.414-1.414 1.415-1.414-1.414-1.414-1.415-1.414-1.414 1.414-1.414 1.414 1.414 1.414 1.414 1.414zm8.776-8.776l1.414-1.414 1.414-1.414-1.414-1.414-1.414-1.414-1.414 1.414-1.414 1.414 1.414 1.414 1.414 1.414z',
  'Продвинутые анимации в CSS': 'M9.972 2.508a.5.5 0 00-.934 0l-7.971 15.941a.5.5 0 00.467.691h15.904a.5.5 0 00.467-.691L9.972 2.508zm-.968 1.71l7.16 14.323H1.844L9.004 4.218z M15.75 5.25a3 3 0 013 3v9.75a3 3 0 01-3 3h-9.75a3 3 0 01-3-3V8.25a3 3 0 013-3h9.75z',
  'JavaScript с нуля': 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
  'React для начинающих': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'
}

// Обработка загрузки изображения
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        newPost.value.image = e.target.result as string
      }
    }
    reader.readAsDataURL(input.files[0])
  }
}

// Удаление изображения
const removeImage = () => {
  newPost.value.image = ''
  const input = document.getElementById('image-upload') as HTMLInputElement
  if (input) input.value = ''
}

const imageInput = ref<HTMLInputElement | null>(null)

const triggerImageUpload = () => {
  imageInput.value?.click()
}

// Функция для добавления комментария
const addComment = (post: any) => {
  if (!newComment.value.trim()) return
  
  post.comments.push({
    id: Date.now(),
    author: authStore.currentUser?.name || 'Гость',
    avatar: authStore.currentUser?.avatar || 'https://via.placeholder.com/40',
    content: newComment.value,
    date: new Date().toISOString().split('T')[0]
  })
  
  newComment.value = ''
}

// Функция для переключения отображения комментариев
const toggleComments = (post: any) => {
  post.showAllComments = !post.showAllComments
}
</script>

<template>
  <div class="space-y-8">
    <!-- Форма создания поста -->
    <div v-if="isOwner" class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="p-6 space-y-4">
        <h3 class="text-lg font-semibold text-gray-800">Создать пост</h3>
        
        <!-- Переключатель режима -->
        <div class="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            @click="newPost.isPreview = false"
            class="flex-1 px-4 py-2 text-sm font-medium transition-colors"
            :class="!newPost.isPreview ? 
              'bg-primary text-white' : 
              'bg-white text-gray-600 hover:bg-gray-50'"
          >
            Редактирование
          </button>
          <button
            @click="newPost.isPreview = true"
            class="flex-1 px-4 py-2 text-sm font-medium transition-colors"
            :class="newPost.isPreview ? 
              'bg-primary text-white' : 
              'bg-white text-gray-600 hover:bg-gray-50'"
          >
            Предпросмотр
          </button>
        </div>

        <!-- Форма редактирования -->
        <div v-if="!newPost.isPreview" class="space-y-4">
          <div>
            <input
              v-model="newPost.title"
              type="text"
              placeholder="Заголовок поста"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <!-- Загрузка изображения -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700">
                Изображение
              </label>
              <button
                v-if="newPost.image"
                @click="removeImage"
                class="text-sm text-red-500 hover:text-red-600"
              >
                Удалить
              </button>
            </div>
            <input
              ref="imageInput"
              id="image-upload"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageUpload"
            />
            <div
              class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-colors"
              :class="{ 'h-48': !newPost.image }"
            >
              <img
                v-if="newPost.image"
                :src="newPost.image"
                alt="Preview"
                class="w-full h-48 object-cover rounded-lg"
              />
              <div
                v-else
                @click="triggerImageUpload"
                class="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
              >
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span class="mt-2 text-sm text-gray-500">Нажмите, чтобы добавить изображение</span>
              </div>
            </div>
          </div>

          <!-- Прикрепление курса -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Прикрепить курс
            </label>
            <div class="flex gap-4">
              <input
                v-model="newPost.courseLink"
                type="text"
                placeholder="Ссылка на курс"
                class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                v-model="newPost.courseName"
                type="text"
                placeholder="Название курса"
                class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <textarea
              v-model="newPost.content"
              rows="6"
              placeholder="Содержание поста"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
        </div>

        <!-- Предпросмотр -->
        <div v-else class="border border-gray-200 rounded-lg p-4 space-y-4">
          <h4 class="text-xl font-semibold text-gray-900">
            {{ newPost.title || 'Заголовок поста' }}
          </h4>

          <img
            v-if="newPost.image"
            :src="newPost.image"
            alt="Preview"
            class="w-full h-48 object-cover rounded-lg"
          />

          <div
            v-if="newPost.courseLink && newPost.courseName"
            class="bg-primary/5 p-4 rounded-lg"
          >
            <div class="flex items-center space-x-2 text-primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  :d="courseIcons[newPost.courseName] || 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'"
                />
              </svg>
              <span>{{ newPost.courseName }}</span>
            </div>
          </div>

          <p class="text-gray-600 whitespace-pre-wrap">
            {{ newPost.content || 'Содержание поста' }}
          </p>
        </div>

        <div class="flex justify-end">
          <button
            @click="createPost"
            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!newPost.title || !newPost.content"
          >
            Опубликовать
          </button>
        </div>
      </div>
    </div>

    <!-- Список постов -->
    <div class="space-y-6">
      <article 
        v-for="post in posts" 
        :key="post.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
      >
        <div class="p-6 space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 hover:text-primary transition-colors">
            {{ post.title }}
          </h3>

          <img
            v-if="post.image"
            :src="post.image"
            :alt="post.title"
            class="w-full h-48 object-cover rounded-lg"
          />

          <div
            v-if="post.courseLink && post.courseName"
            class="bg-primary/5 p-4 rounded-lg"
          >
            <router-link
              :to="post.courseLink"
              class="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  :d="courseIcons[post.courseName] || 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'"
                />
              </svg>
              <span>{{ post.courseName }}</span>
            </router-link>
          </div>

          <p class="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
            {{ post.content }}
          </p>

          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">{{ formatDate(post.date) }}</span>
            <div class="flex items-center space-x-4">
              <button 
                class="flex items-center space-x-1 transition-colors"
                :class="post.isLiked ? 'text-primary' : 'text-gray-500 hover:text-primary'"
                @click="toggleLike(post)"
              >
                <svg 
                  class="w-5 h-5 transition-transform duration-300"
                  :class="{ 'scale-125': post.isLiked }"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  :stroke-width="post.isLiked ? 2.5 : 2"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
                <span>{{ post.likes }}</span>
              </button>
              <button 
                class="flex items-center space-x-1 text-gray-500 hover:text-primary transition-colors"
                @click="toggleComments(post)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{{ post.comments.length }}</span>
              </button>
            </div>
          </div>

          <!-- Секция комментариев -->
          <div v-if="post.comments.length > 0" class="space-y-4 border-t border-gray-100 pt-4">
            <!-- Показываем первые 2 комментария -->
            <div 
              v-for="comment in post.showAllComments ? post.comments : post.comments.slice(0, 2)" 
              :key="comment.id"
              class="flex space-x-3"
            >
              <img 
                :src="comment.avatar" 
                :alt="comment.author"
                class="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div class="flex-1 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-900">{{ comment.author }}</span>
                  <span class="text-xs text-gray-500">{{ formatDate(comment.date) }}</span>
                </div>
                <p class="text-sm text-gray-600">{{ comment.content }}</p>
              </div>
            </div>

            <!-- Кнопка "Показать больше" -->
            <button
              v-if="post.comments.length > 2 && !post.showAllComments"
              @click="toggleComments(post)"
              class="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Показать еще {{ post.comments.length - 2 }} комментария
            </button>

            <!-- Форма добавления комментария -->
            <div class="flex items-start space-x-3 pt-2">
              <img 
                :src="authStore.currentUser?.avatar || 'https://via.placeholder.com/40'" 
                :alt="authStore.currentUser?.name || 'Гость'"
                class="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <textarea
                  v-model="newComment"
                  rows="2"
                  placeholder="Написать комментарий..."
                  class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
                <div class="flex justify-end mt-2">
                  <button
                    @click="addComment(post)"
                    class="px-4 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    :disabled="!newComment.trim()"
                  >
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template> 