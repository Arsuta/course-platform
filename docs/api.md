# API Documentation

## Общая информация

Все API-запросы выполняются через сервисы, которые наследуются от базового класса `BaseAPI`. 
Базовый URL API настраивается через переменную окружения `VITE_API_URL`.

## Авторизация

Для авторизованных запросов используется JWT токен, который автоматически добавляется в заголовок `Authorization`.
При истечении срока действия токена происходит автоматическое обновление через refresh token.

## Доступные сервисы

### CourseService

Сервис для работы с курсами.

```typescript
import { api } from '@/api'

// Получение списка курсов
const courses = await api.courses.getAllCourses({
  page: 1,
  per_page: 10
})

// Получение курса по ID
const course = await api.courses.getCourseById('course-id')

// Покупка курса
await api.courses.purchaseCourse('course-id')
```

### CategoryService

Сервис для работы с категориями курсов.

```typescript
import { api } from '@/api'

// Получение всех категорий
const categories = await api.categories.getAllCategories()
```

### ProfileService

Сервис для работы с профилем пользователя.

```typescript
import { api } from '@/api'

// Получение профиля
const profile = await api.profile.getProfile()

// Обновление профиля
await api.profile.updateProfile({
  first_name: 'John',
  last_name: 'Doe'
})

// Получение купленных курсов
const purchasedCourses = await api.profile.getPurchasedCourses()
```

### TestService

Сервис для работы с тестами.

```typescript
import { api } from '@/api'

// Получение теста для урока
const test = await api.tests.getLessonTest('lesson-id')

// Отправка ответов на тест
await api.tests.submitTestAnswers('lesson-id', {
  'question-1': 2,
  'question-2': 0
})
```

### ProgressService

Сервис для работы с прогрессом обучения.

```typescript
import { api } from '@/api'

// Получение прогресса по курсу
const progress = await api.progress.getCourseProgress('course-id')

// Отметить урок как просмотренный
await api.progress.markLessonViewed('lesson-id')

// Отметить урок как завершенный
await api.progress.markLessonCompleted('lesson-id')
```

## Обработка ошибок

Все API методы возвращают объект типа `APIResponse<T>`:

```typescript
interface APIResponse<T> {
  data: T
  status: number
  message?: string
}
```

При возникновении ошибки выбрасывается исключение с объектом типа `APIError`:

```typescript
interface APIError {
  message: string
  status: number
  code?: string
}
```

Рекомендуется всегда оборачивать API-вызовы в try-catch блоки:

```typescript
try {
  const response = await api.courses.getCourseById('id')
  // Обработка успешного ответа
} catch (error) {
  // Обработка ошибки
  console.error('API Error:', error.message)
}
``` 