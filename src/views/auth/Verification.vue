<template>
  <div class="verification-container">
    <div class="verification-card">
      <h1 class="verification-title">Подтверждение</h1>
      <p class="verification-description">
        На вашу почту <span class="email-highlight">{{ displayEmail }}</span> был отправлен код подтверждения. 
        Пожалуйста, введите его ниже для продолжения.
      </p>
      <p class="verification-note">
        Проверьте также папку "Спам" или "Нежелательная почта", если не видите письмо в основном ящике.
      </p>

      <div class="code-input-container">
        <div class="code-digits-container">
          <template v-for="(digit, index) in 6" :key="index">
            <input
              ref="codeInputs"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="1"
              class="code-digit"
              :value="code[index] || ''"
              @input="handleDigitInput($event, index)"
              @keydown="handleKeyDown($event, index)"
              @paste="handlePaste"
              @focus="handleFocus"
            />
          </template>
        </div>
      </div>

      <div v-if="errorMessage" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="success-message">
        <i class="fas fa-check-circle"></i>
        {{ successMessage }}
      </div>

      <div class="actions">
        <button 
          class="verify-button" 
          @click="verifyCode" 
          :disabled="isLoading || code.length !== 6"
        >
          <span v-if="isLoading">
            <i class="fas fa-spinner fa-spin"></i>
          </span>
          <span v-else>Проверить код</span>
        </button>
        
        <div class="resend-container">
          <button 
            class="resend-button" 
            @click="resendCode" 
            :disabled="!canResend || resendLoading"
          >
            <span v-if="resendLoading">
              <i class="fas fa-spinner fa-spin"></i>
            </span>
            <span v-else-if="!canResend">
              Отправить код повторно ({{ remainingTime }}с)
            </span>
            <span v-else>Отправить код повторно</span>
          </button>
        </div>
      </div>
      
      <div class="back-link">
        <router-link to="/auth/login">Вернуться к входу</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Тип верификации (login или register)
const verificationType = computed(() => route.query.type as string)
const verificationId = computed(() => route.query.id as string)

// Получаем email для отображения
const displayEmail = computed(() => {
  const email = authStore.verificationEmail || 
                localStorage.getItem('verification_email') || 
                localStorage.getItem('registration_email') || 
                '';
  
  // Обрезаем email для безопасности, показывая только начало и домен
  if (email && email.includes('@')) {
    const [name, domain] = email.split('@');
    if (name.length > 3) {
      return `${name.substring(0, 3)}***@${domain}`;
    }
    return `${name}***@${domain}`;
  }
  
  return email;
});

// Логируем при создании компонента
console.log('Компонент верификации создан с параметрами:', { 
  type: verificationType.value, 
  id: verificationId.value,
  email: displayEmail.value
})

// Состояние
const code = ref('')
const codeInputs = ref<HTMLInputElement[]>([])
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const remainingTime = ref(60)
const canResend = ref(false)
const resendLoading = ref(false)

// Обработка ввода цифры кода
const handleDigitInput = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/[^0-9]/g, '')
  
  // Обновляем значение в текущем инпуте
  input.value = value.slice(-1)
  
  // Обновляем общий код
  const codeArray = code.value.split('')
  codeArray[index] = input.value
  code.value = codeArray.join('')
  
  // Если введена цифра, переходим к следующему полю
  if (value && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }
  
  // Если код полностью введен, отправляем его
  if (code.value.length === 6) {
    nextTick(() => {
      verifyCode()
    })
  }
}

// Обработка нажатия клавиш
const handleKeyDown = (event: KeyboardEvent, index: number) => {
  // Если нажат Backspace и поле пустое, переходим к предыдущему полю
  if (event.key === 'Backspace' && !code.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus()
  }
  
  // Если нажата стрелка влево, переходим к предыдущему полю
  if (event.key === 'ArrowLeft' && index > 0) {
    codeInputs.value[index - 1]?.focus()
  }
  
  // Если нажата стрелка вправо, переходим к следующему полю
  if (event.key === 'ArrowRight' && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }
}

// Обработка вставки кода
const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  
  const pastedData = event.clipboardData?.getData('text')
  if (!pastedData) return
  
  // Извлекаем только цифры
  const digits = pastedData.replace(/\D/g, '').slice(0, 6)
  
  // Заполняем поля ввода
  digits.split('').forEach((digit, index) => {
    if (index < 6) {
      if (codeInputs.value[index]) {
        codeInputs.value[index].value = digit
      }
    }
  })
  
  // Обновляем общий код
  code.value = digits
  
  // Фокусируемся на последнем заполненном поле или следующем пустом
  const focusIndex = Math.min(digits.length, 5)
  codeInputs.value[focusIndex]?.focus()
  
  // Если код полностью введен, отправляем его
  if (code.value.length === 6) {
    nextTick(() => {
      verifyCode()
    })
  }
}

// Обработка фокуса на поле ввода
const handleFocus = (event: FocusEvent) => {
  const input = event.target as HTMLInputElement
  if (input) {
    input.select()
  }
}

// Обработка ошибок верификации
const handleVerificationError = (err: any) => {
  console.error('Ошибка верификации:', err);
  
  // Проверяем структуру ошибки
  if (err.response && err.response.data) {
    const errorResponse = err.response.data;
    
    // Обработка различных форматов ошибок от API
    if (errorResponse.message) {
      errorMessage.value = errorResponse.message;
    }
    else if (errorResponse.error && typeof errorResponse.error === 'object' && errorResponse.error.message) {
      errorMessage.value = errorResponse.error.message;
    }
    else if (typeof errorResponse.error === 'string') {
      errorMessage.value = errorResponse.error;
    }
    // Если ничего не подошло
    else {
      errorMessage.value = 'Ошибка при верификации. Пожалуйста, попробуйте снова.';
    }
  } else {
    // Общая ошибка без данных от сервера
    errorMessage.value = err.message || 'Ошибка при верификации';
  }
};

// Проверка кода
const verifyCode = async () => {
  if (code.value.length !== 6) {
    errorMessage.value = 'Код должен состоять из 6 цифр';
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    console.log('Отправка кода верификации:', {
      type: verificationType.value,
      code: code.value,
      email: authStore.verificationEmail
    });
    
    // Сохраним email в localStorage для случая, если страница будет перезагружена
    if (authStore.verificationEmail) {
      localStorage.setItem('verification_email', authStore.verificationEmail);
    }
    
    let success = false;
    
    // В зависимости от типа верификации вызываем соответствующий метод
    if (verificationType.value === 'login') {
      success = await authStore.verifyLogin(code.value);
      console.log('Результат верификации входа:', success);
    } else if (verificationType.value === 'register') {
      success = await authStore.verifyEmail(code.value);
      console.log('Результат верификации регистрации:', success);
    } else {
      throw new Error('Неизвестный тип верификации');
    }
    
    // Проверяем авторизацию после верификации
    if (success) {
      // Проверяем, авторизован ли пользователь
      const isAuthenticated = authStore.isAuthenticated;
      console.log('Статус авторизации после верификации:', isAuthenticated);
      
      // Показываем сообщение об успехе
      successMessage.value = 'Верификация успешно завершена!';
      errorMessage.value = null;
      
      // Удаляем временные данные из localStorage
      localStorage.removeItem('verification_email');
      localStorage.removeItem('registration_email');
      
      // Перенаправляем пользователя
      setTimeout(() => {
        if (isAuthenticated) {
          // Если пользователь авторизован, перенаправляем на главную
          router.push('/');
        } else {
          // Если пользователь не авторизован, перенаправляем на страницу входа
          router.push('/auth/login');
        }
      }, 1500);
    } else {
      // Если верификация не удалась, показываем сообщение об ошибке
      errorMessage.value = 'Не удалось подтвердить код. Пожалуйста, попробуйте снова.';
      successMessage.value = null;
    }
  } catch (err: any) {
    handleVerificationError(err);
  } finally {
    isLoading.value = false;
  }
};

// Запуск таймера для повторной отправки
const startResendTimer = (seconds = 60) => {
  remainingTime.value = seconds;
  canResend.value = seconds === 0;
  
  if (seconds > 0) {
    const timer = setInterval(() => {
      remainingTime.value--;
      
      if (remainingTime.value <= 0) {
        clearInterval(timer);
        canResend.value = true;
      }
    }, 1000);
  }
};

// Повторная отправка кода
const resendCode = async () => {
  if (!canResend.value) return;
  
  resendLoading.value = true;
  errorMessage.value = null;
  successMessage.value = null;
  
  try {
    // Получаем email из хранилища или localStorage
    let email = authStore.verificationEmail || 
                localStorage.getItem('verification_email') || 
                localStorage.getItem('registration_email');
    
    if (!email) {
      throw new Error('Не удалось определить email для повторной отправки кода');
    }
    
    console.log('Запрос на повторную отправку кода для:', email);
    
    // Запрос на повторную отправку кода
    let response;
    if (verificationType.value === 'login') {
      // Для входа делаем предварительный логин
      response = await authStore.login(email, authStore.verificationPassword || '');
    } else if (verificationType.value === 'register') {
      // Для регистрации делаем повторную регистрацию с тем же email
      response = await authStore.register(email, authStore.verificationPassword || '', '', '');
    } else {
      throw new Error('Неизвестный тип верификации');
    }
    
    console.log('Ответ на запрос повторной отправки:', response);
    
    // Показываем сообщение об успехе
    successMessage.value = 'Новый код отправлен на ваш email';
    errorMessage.value = null;
    
    // Запускаем таймер снова
    startResendTimer();
    
    // Очищаем поле ввода кода
    code.value = '';
    codeInputs.value.forEach(input => {
      if (input) input.value = '';
    });
    codeInputs.value[0]?.focus();
  } catch (err: any) {
    console.error('Ошибка при повторной отправке кода:', err);
    errorMessage.value = err.message || 'Ошибка при отправке кода';
    successMessage.value = null;
    
    // Если email уже существует, указываем, что нужно войти
    if (err.message && err.message.includes('уже существует')) {
      errorMessage.value = 'Email уже зарегистрирован. Пожалуйста, используйте форму входа.';
    }
    
    // Если email не подтвержден, предлагаем проверить почту
    if (err.message && err.message.includes('не подтвержден')) {
      errorMessage.value = 'Email ожидает подтверждения. Пожалуйста, проверьте вашу почту или спам.';
    }
  } finally {
    resendLoading.value = false;
  }
};

// Запускаем таймер при монтировании компонента
onMounted(() => {
  // Фокусируемся на первом поле ввода
  nextTick(() => {
    if (codeInputs.value[0]) {
      codeInputs.value[0].focus();
    }
  });
  
  // Запускаем таймер для повторной отправки
  startResendTimer();
  
  // Если в URL есть параметр error, показываем его
  if (route.query.error) {
    errorMessage.value = route.query.error as string;
  }
  
  // Если в URL есть параметр success, показываем его
  if (route.query.success) {
    successMessage.value = route.query.success as string;
  }
});
</script>

<style scoped>
.verification-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-bg);
  padding: 1rem;
}

.verification-card {
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  text-align: center;
}

.verification-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
}

.verification-description {
  font-size: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.verification-note {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.email-highlight {
  font-weight: 600;
  color: var(--color-primary);
}

.code-input-container {
  margin-bottom: 2rem;
}

.code-digits-container {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.code-digit {
  width: 3rem;
  height: 3.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  transition: all 0.2s ease;
}

.code-digit:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
  outline: none;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.success-message {
  background-color: #dcfce7;
  color: #15803d;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.verify-button {
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.verify-button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.verify-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.resend-button {
  background-color: transparent;
  color: var(--color-primary);
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;
}

.resend-button:hover:not(:disabled) {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.resend-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  color: var(--color-text-muted);
}

.back-link a {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.back-link a:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .verification-card {
    padding: 1.5rem;
  }
  
  .code-digit {
    width: 2.5rem;
    height: 3rem;
    font-size: 1.25rem;
  }
}

/* Dark mode styles */
:global(.dark) .verification-card {
  background-color: var(--color-bg-secondary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

:global(.dark) .code-digit {
  background-color: var(--color-bg-secondary);
  border-color: #4b5563;
  color: var(--color-text-primary);
}

:global(.dark) .verification-title {
  color: var(--color-text-primary);
}

:global(.dark) .verification-description {
  color: var(--color-text-secondary);
}

:global(.dark) .verification-note {
  color: var(--color-text-muted);
}

:global(.dark) .error-message {
  background-color: rgba(185, 28, 28, 0.2);
  color: #ef4444;
}

:global(.dark) .success-message {
  background-color: rgba(21, 128, 61, 0.2);
  color: #22c55e;
}

:global(.dark) .back-link a {
  color: var(--color-text-secondary);
}

:global(.dark) .back-link a:hover {
  color: var(--color-primary-light);
}
</style> 