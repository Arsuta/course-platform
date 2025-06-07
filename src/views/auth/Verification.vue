<template>
  <div class="verification-container">
    <div class="verification-card">
      <h1>Подтверждение</h1>
      <p class="verification-description">
        На вашу почту <span class="email-highlight">{{ displayEmail }}</span> был отправлен код подтверждения. 
        Пожалуйста, введите его ниже для продолжения.
      </p>
      <p class="verification-note">
        Проверьте также папку "Спам" или "Нежелательная почта", если не видите письмо в основном ящике.
      </p>

      <div class="code-input-container">
        <input
          v-model="code"
          type="text"
          class="code-input"
          placeholder="Введите 6-значный код"
          maxlength="6"
          pattern="\d{6}"
          inputmode="numeric"
        />
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="success-message">
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
import { ref, onMounted, computed } from 'vue'
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
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const remainingTime = ref(60)
const canResend = ref(false)
const resendLoading = ref(false)

// Обработка ошибок верификации
const handleVerificationError = (err: any) => {
  console.error('Ошибка верификации:', err);
  
  // Проверяем сообщение об ошибке
  const errorResponse = err?.response?.data;
  
  // Проверяем разные варианты сообщений об ошибках
  if (errorResponse) {
    console.log('Данные ошибки:', errorResponse);
    
    // Истек код верификации
    if (errorResponse.error === 'verification code expired') {
      errorMessage.value = 'Код верификации истек. Пожалуйста, запросите новый код.';
      startResendTimer(0); // Сразу разрешаем повторную отправку
    } 
    // Неверный код
    else if (errorResponse.error === 'invalid verification code' || 
             errorResponse.error === 'invalid code') {
      errorMessage.value = 'Неверный код верификации. Пожалуйста, проверьте и попробуйте снова.';
    }
    // Верификация уже завершена
    else if (errorResponse.error === 'email already verified' || 
             errorResponse.error === 'already verified') {
      errorMessage.value = 'Email уже подтвержден. Пожалуйста, войдите в систему.';
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
    // Не найден ID верификации
    else if (errorResponse.error === 'verification id not found') {
      errorMessage.value = 'Запрос на верификацию не найден. Пожалуйста, запросите новый код.';
      startResendTimer(0);
    }
    // Общее сообщение об ошибке, если есть
    else if (errorResponse.message) {
      errorMessage.value = errorResponse.message;
    }
    // Если есть просто поле error как строка
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
      console.log('Верификация успешна, проверяем аутентификацию');
      // Проверяем, аутентифицирован ли пользователь
      if (authStore.isAuthenticated) {
        console.log('Пользователь аутентифицирован, перенаправление на главную');
        // Очищаем временные данные из localStorage
        localStorage.removeItem('verification_email');
        localStorage.removeItem('registration_email');
        localStorage.removeItem('verification_id');
        // После успешной верификации перенаправляем на главную
        router.push('/');
      } else {
        console.warn('Верификация успешна, но пользователь не аутентифицирован');
        // Загружаем профиль пользователя повторно
        try {
          await authStore.loadUserProfile();
          if (authStore.isAuthenticated) {
            console.log('Профиль успешно загружен, перенаправление на главную');
            router.push('/');
          } else {
            console.error('Не удалось загрузить профиль после верификации');
            throw new Error('Не удалось загрузить профиль пользователя после верификации');
          }
        } catch (profileErr) {
          console.error('Ошибка при загрузке профиля:', profileErr);
          throw new Error('Ошибка при загрузке профиля после верификации');
        }
      }
    } else {
      throw new Error('Неизвестная ошибка верификации');
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
  console.log('Компонент верификации смонтирован, параметры:', {
    type: verificationType.value,
    id: verificationId.value
  })
  
  // Проверяем наличие необходимых параметров
  if (!verificationType.value || !verificationId.value) {
    console.error('Отсутствуют необходимые параметры для верификации')
    errorMessage.value = 'Ошибка: отсутствуют необходимые параметры для верификации'
    return
  }
  
  startResendTimer()
})
</script>

<style scoped>
.verification-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.verification-card {
  width: 90%;
  max-width: 400px;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
}

.verification-description {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.code-input-container {
  margin-bottom: 1.5rem;
}

.code-input {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  text-align: center;
  letter-spacing: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.code-input:focus {
  border-color: #4a90e2;
  outline: none;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 1.5rem;
  text-align: center;
  padding: 8px;
  background-color: #ffeeee;
  border-radius: 4px;
}

.success-message {
  color: #2ecc71;
  margin-bottom: 1.5rem;
  text-align: center;
  padding: 8px;
  background-color: #eeffee;
  border-radius: 4px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.verify-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.verify-button:hover:not(:disabled) {
  background-color: #3a80d2;
}

.verify-button:disabled {
  background-color: #a0c4f0;
  cursor: not-allowed;
}

.resend-container {
  text-align: center;
}

.resend-button {
  background-color: transparent;
  color: #4a90e2;
  border: 1px solid #4a90e2;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
}

.resend-button:hover:not(:disabled) {
  background-color: #f0f7ff;
}

.resend-button:disabled {
  color: #aaa;
  border-color: #ddd;
  cursor: not-allowed;
}

.back-link {
  text-align: center;
  margin-top: 1.5rem;
}

.back-link a {
  color: #666;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}
</style> 