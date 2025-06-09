<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCoursesStore } from '@/stores/courses';
import type { Course, Lesson } from '@/api/types';
import { marked } from 'marked';

const route = useRoute();
const router = useRouter();
const coursesStore = useCoursesStore();

const courseId = computed(() => route.params.courseId as string);
const course = ref<Course | null>(null);
const lessons = ref<Lesson[]>([]);
const currentLessonIndex = ref(0);
const loading = ref(true);
const error = ref<string | null>(null);
const showTest = ref(false);
const testCompleted = ref(false);
const testScore = ref(0);
const userAnswers = ref<Record<string, number>>({});

// Моковые данные для уроков
const mockLessons = [
  {
    id: '1',
    title: 'Введение в курс',
    content: `
# Введение в курс

Добро пожаловать на курс! В этом уроке мы рассмотрим основные темы, которые будут освещены в рамках обучения.

## Цели курса

- Познакомиться с основными концепциями
- Научиться применять полученные знания на практике
- Разработать собственный проект к концу курса

## Структура курса

Курс состоит из теоретических материалов, практических заданий и итогового тестирования.

### Рекомендации по обучению

1. Регулярно занимайтесь, уделяя обучению не менее 1 часа в день
2. Выполняйте все практические задания
3. Задавайте вопросы в комментариях, если что-то непонятно

Желаем успехов в обучении!
    `,
    course_id: courseId.value,
    order_num: 1,
    has_test: false,
    created_at: '2023-05-10T10:00:00',
    updated_at: '2023-05-10T10:00:00'
  },
  {
    id: '2',
    title: 'Основные понятия',
    content: `
# Основные понятия и термины

В этом уроке мы познакомимся с ключевыми понятиями, которые будут использоваться на протяжении всего курса.

## Ключевые термины

### Термин 1
Подробное описание первого термина и его значение в контексте курса.

### Термин 2
Подробное описание второго термина и его практическое применение.

### Термин 3
Подробное описание третьего термина и связь с другими концепциями.

## Примеры использования

Рассмотрим несколько примеров, демонстрирующих применение изученных терминов на практике:

1. Пример первый
2. Пример второй
3. Пример третий

## Заключение

Понимание этих основных терминов является фундаментом для дальнейшего обучения. В следующем уроке мы начнем применять эти знания на практике.
    `,
    course_id: courseId.value,
    order_num: 2,
    has_test: false,
    created_at: '2023-05-12T10:00:00',
    updated_at: '2023-05-12T10:00:00'
  },
  {
    id: '3',
    title: 'Практическое применение',
    content: `
# Практическое применение

В этом уроке мы рассмотрим практические аспекты применения полученных знаний.

## Практические задания

### Задание 1

Описание первого практического задания и шаги по его выполнению:

1. Шаг первый
2. Шаг второй
3. Шаг третий

### Задание 2

Описание второго практического задания:

- Пункт 1
- Пункт 2
- Пункт 3

## Примеры решений

Ниже приведены примеры решений типовых задач:

\`\`\`
// Пример кода или решения
function example() {
  console.log("Это пример решения задачи");
}
\`\`\`

## Рекомендации

При выполнении практических заданий обратите внимание на следующие моменты:

1. Важный момент 1
2. Важный момент 2
3. Важный момент 3

В следующем уроке мы продолжим изучение практических аспектов и рассмотрим более сложные примеры.
    `,
    course_id: courseId.value,
    order_num: 3,
    has_test: false,
    created_at: '2023-05-14T10:00:00',
    updated_at: '2023-05-14T10:00:00'
  },
  {
    id: '4',
    title: 'Итоговый урок',
    content: `
# Итоговый урок

Поздравляем! Вы дошли до финального урока курса. В этом уроке мы подведем итоги обучения и закрепим полученные знания.

## Обзор пройденного материала

В рамках курса мы изучили:

1. Основные концепции и термины
2. Практические методы применения знаний
3. Решение типовых задач и проблем

## Дальнейшие шаги

Для продолжения обучения и совершенствования навыков рекомендуем:

- Изучить дополнительные материалы по теме
- Присоединиться к сообществу практиков
- Применять полученные знания в реальных проектах

## Заключение

Благодарим за прохождение курса! Не забудьте пройти итоговый тест для проверки полученных знаний.

Желаем успехов в дальнейшем обучении и практической деятельности!
    `,
    course_id: courseId.value,
    order_num: 4,
    has_test: true,
    created_at: '2023-05-16T10:00:00',
    updated_at: '2023-05-16T10:00:00'
  }
];

// Моковые данные для теста
const mockTest = {
  id: '1',
  title: 'Итоговый тест по курсу',
  description: 'Проверьте свои знания, полученные в ходе курса',
  questions: [
    {
      id: '1',
      text: 'Какой из следующих вариантов является правильным?',
      options: [
        'Вариант A',
        'Вариант B',
        'Вариант C',
        'Вариант D'
      ],
      correct_answer: 1
    },
    {
      id: '2',
      text: 'Что из перечисленного НЕ относится к основным концепциям курса?',
      options: [
        'Концепция 1',
        'Концепция 2',
        'Концепция 3',
        'Концепция 4'
      ],
      correct_answer: 3
    },
    {
      id: '3',
      text: 'Какой метод является наиболее эффективным для решения задачи X?',
      options: [
        'Метод A',
        'Метод B',
        'Метод C',
        'Метод D'
      ],
      correct_answer: 2
    },
    {
      id: '4',
      text: 'В каком случае следует применять подход Y?',
      options: [
        'Случай 1',
        'Случай 2',
        'Случай 3',
        'Случай 4'
      ],
      correct_answer: 0
    },
    {
      id: '5',
      text: 'Какой результат будет получен при выполнении операции Z?',
      options: [
        'Результат A',
        'Результат B',
        'Результат C',
        'Результат D'
      ],
      correct_answer: 1
    }
  ]
};

// Получение данных курса и уроков
const fetchCourseData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Получаем информацию о курсе
    course.value = await coursesStore.fetchCourse(courseId.value);
    
    // Используем моковые данные для уроков
    lessons.value = mockLessons;
    
    loading.value = false;
  } catch (err: any) {
    error.value = err.message || 'Ошибка при загрузке курса';
    loading.value = false;
  }
};

// Переход к следующему уроку
const nextLesson = () => {
  if (currentLessonIndex.value < lessons.value.length - 1) {
    currentLessonIndex.value++;
    showTest.value = false;
  } else if (currentLessonIndex.value === lessons.value.length - 1 && !showTest.value && lessons.value[currentLessonIndex.value].has_test) {
    showTest.value = true;
  }
};

// Переход к предыдущему уроку
const prevLesson = () => {
  if (currentLessonIndex.value > 0) {
    currentLessonIndex.value--;
    showTest.value = false;
  }
};

// Выбор ответа в тесте
const selectAnswer = (questionId: string, optionIndex: number) => {
  userAnswers.value[questionId] = optionIndex;
};

// Проверка теста
const submitTest = () => {
  let score = 0;
  let totalQuestions = mockTest.questions.length;
  
  mockTest.questions.forEach(question => {
    if (userAnswers.value[question.id] === question.correct_answer) {
      score++;
    }
  });
  
  testScore.value = Math.round((score / totalQuestions) * 100);
  testCompleted.value = true;
};

// Текущий урок
const currentLesson = computed(() => {
  return lessons.value[currentLessonIndex.value] || null;
});

// Форматированное содержимое текущего урока
const formattedContent = computed(() => {
  if (!currentLesson.value?.content) return '';
  return marked.parse(currentLesson.value.content);
});

// Проверка, все ли вопросы теста отвечены
const allQuestionsAnswered = computed(() => {
  return mockTest.questions.every(q => userAnswers.value[q.id] !== undefined);
});

// Проверка, является ли текущий урок последним
const isLastLesson = computed(() => {
  return currentLessonIndex.value === lessons.value.length - 1;
});

// Проверка, имеет ли текущий урок тест
const hasTest = computed(() => {
  return currentLesson.value?.has_test || false;
});

onMounted(async () => {
  await fetchCourseData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Загрузка -->
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-else-if="error" class="container mx-auto px-4 py-8 text-center text-red-600">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-lg">{{ error }}</p>
        <button @click="router.go(-1)" class="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
          Вернуться назад
        </button>
      </div>
    </div>

    <!-- Содержимое курса -->
    <div v-else class="container mx-auto px-4 py-8">
      <!-- Заголовок курса -->
      <div class="mb-8">
        <div class="flex items-center mb-4">
          <button 
            @click="router.push(`/courses/${courseId}`)" 
            class="flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к курсу
          </button>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ course?.title }}</h1>
        <p class="text-gray-600">{{ course?.description }}</p>
      </div>
      
      <!-- Навигация по урокам -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg p-4 sticky top-4">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Содержание курса</h2>
            <div class="space-y-2">
              <button
                v-for="(lesson, index) in lessons"
                :key="lesson.id"
                @click="currentLessonIndex = index; showTest = false"
                class="w-full text-left px-4 py-2 rounded-lg transition-colors"
                :class="index === currentLessonIndex && !showTest ? 
                  'bg-primary text-white' : 
                  'text-gray-600 hover:bg-gray-100'"
              >
                <div class="flex items-center">
                  <span class="w-6 h-6 flex items-center justify-center rounded-full border mr-2"
                        :class="index === currentLessonIndex && !showTest ? 'border-white' : 'border-gray-400'"
                  >
                    {{ index + 1 }}
                  </span>
                  <span class="truncate">{{ lesson.title }}</span>
                </div>
              </button>
              
              <button
                v-if="hasTest"
                @click="showTest = true"
                class="w-full text-left px-4 py-2 rounded-lg transition-colors"
                :class="showTest ? 
                  'bg-primary text-white' : 
                  'text-gray-600 hover:bg-gray-100'"
              >
                <div class="flex items-center">
                  <span class="w-6 h-6 flex items-center justify-center rounded-full border mr-2"
                        :class="showTest ? 'border-white' : 'border-gray-400'"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span>Итоговый тест</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Содержимое урока или тест -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <!-- Урок -->
            <div v-if="!showTest">
              <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ currentLesson?.title }}</h2>
              
              <div class="prose max-w-none" v-html="formattedContent"></div>
              
              <div class="flex justify-between mt-8">
                <button
                  v-if="currentLessonIndex > 0"
                  @click="prevLesson"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span class="flex items-center">
                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Предыдущий урок
                  </span>
                </button>
                <div v-else></div>
                
                <button
                  @click="nextLesson"
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <span class="flex items-center">
                    {{ isLastLesson && hasTest ? 'Перейти к тесту' : 'Следующий урок' }}
                    <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
            
            <!-- Тест -->
            <div v-else>
              <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ mockTest.title }}</h2>
              <p class="text-gray-600 mb-6">{{ mockTest.description }}</p>
              
              <div v-if="!testCompleted">
                <div class="space-y-8 mb-8">
                  <div v-for="(question, qIndex) in mockTest.questions" :key="question.id" class="border-b border-gray-200 pb-6">
                    <h3 class="text-xl font-semibold mb-4">{{ qIndex + 1 }}. {{ question.text }}</h3>
                    
                    <div class="space-y-3">
                      <div
                        v-for="(option, oIndex) in question.options"
                        :key="`${question.id}-${oIndex}`"
                        @click="selectAnswer(question.id, oIndex)"
                        class="flex items-center p-3 border rounded-lg cursor-pointer transition-colors"
                        :class="userAnswers[question.id] === oIndex ? 
                          'border-primary bg-primary/5' : 
                          'border-gray-200 hover:bg-gray-50'"
                      >
                        <div class="w-6 h-6 rounded-full border flex items-center justify-center mr-3"
                             :class="userAnswers[question.id] === oIndex ? 
                               'border-primary bg-primary text-white' : 
                               'border-gray-300'"
                        >
                          <svg v-if="userAnswers[question.id] === oIndex" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{{ option }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="flex justify-between">
                  <button
                    @click="showTest = false"
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span class="flex items-center">
                      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Вернуться к уроку
                    </span>
                  </button>
                  
                  <button
                    @click="submitTest"
                    :disabled="!allQuestionsAnswered"
                    class="px-4 py-2 bg-primary text-white rounded-lg transition-colors"
                    :class="allQuestionsAnswered ? 'hover:bg-primary-dark' : 'opacity-50 cursor-not-allowed'"
                  >
                    Завершить тест
                  </button>
                </div>
              </div>
              
              <!-- Результаты теста -->
              <div v-else class="text-center py-8">
                <div class="mb-6">
                  <div class="w-32 h-32 rounded-full border-8 flex items-center justify-center mx-auto"
                       :class="testScore >= 80 ? 'border-green-500' : 
                               testScore >= 60 ? 'border-yellow-500' : 
                               'border-red-500'"
                  >
                    <span class="text-4xl font-bold">{{ testScore }}%</span>
                  </div>
                </div>
                
                <h3 class="text-2xl font-bold mb-2">
                  {{ testScore >= 80 ? 'Отличный результат!' : 
                     testScore >= 60 ? 'Хороший результат!' : 
                     'Попробуйте еще раз' }}
                </h3>
                
                <p class="text-gray-600 mb-6">
                  {{ testScore >= 60 ? 
                    'Вы успешно прошли итоговый тест и завершили курс.' : 
                    'Рекомендуем повторить материал курса и попробовать пройти тест снова.' }}
                </p>
                
                <div class="flex justify-center space-x-4">
                  <button
                    v-if="testScore < 60"
                    @click="testCompleted = false; userAnswers = {}"
                    class="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    Пройти тест снова
                  </button>
                  
                  <button
                    @click="router.push(`/courses/${courseId}`)"
                    class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Вернуться к курсу
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 