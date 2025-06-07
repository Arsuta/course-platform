import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService, profileService } from '@/api/services'
import { AUTH_API_BASE_URL } from '@/api/constants'
import type { UserProfile, AuthApiResponse } from '@/types/auth'
import { useRouter } from 'vue-router'
import type { ApiResponse, TokenPair } from '@/api/types'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref<UserProfile | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isVerifying = ref(false)
  const verificationEmail = ref<string | null>(null)
  const verificationPassword = ref<string | null>(null)

  // Устанавливает токены и сохраняет их в localStorage
  function setTokens(accessToken: string, newRefreshToken: string) {
    console.log('Устанавливаю токены:', { accessToken: accessToken.substring(0, 10) + '...', refreshToken: newRefreshToken.substring(0, 10) + '...' })
    token.value = accessToken
    refreshToken.value = newRefreshToken
    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', newRefreshToken)
  }

  // Установить данные для верификации
  function setVerificationData(email: string, password: string = '', verify: boolean = true) {
    console.log('Устанавливаю данные верификации:', { email, verify })
    verificationEmail.value = email
    verificationPassword.value = password
    isVerifying.value = verify
    // Сохраняем email в localStorage для восстановления при перезагрузке страницы
    localStorage.setItem('verification_email', email)
  }

  // Очищает все данные аутентификации
  function clearAuthData() {
    console.log('Очищаю данные аутентификации')
    user.value = null
    token.value = null
    refreshToken.value = null
    isVerifying.value = false
    verificationEmail.value = null
    verificationPassword.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('verification_email')
    localStorage.removeItem('registration_email')
  }

  // Вход пользователя (первый шаг)
  async function login(email: string, password: string): Promise<AuthApiResponse> {
    try {
      isLoading.value = true
      error.value = null
      console.log('Login запрос:', { email, password })
      
      try {
        console.log('Отправка запроса на вход...')
        const response = await authService.login({ email, password })
        console.log('Ответ на запрос входа:', response)
        
        // Проверяем, содержит ли ответ токены напрямую (одноэтапная авторизация)
        // Используем конструкцию in для безопасной проверки полей
        if (response && typeof response === 'object' && 'access_token' in response && 'refresh_token' in response) {
          console.log('Получены токены авторизации без верификации')
          setTokens(response.access_token, response.refresh_token)
          
          // Загружаем профиль пользователя
          await loadUserProfile()
          
          // Возвращаем успешный результат
          return { message: 'Login successful', success: true } as AuthApiResponse
        }
        
        // Если нет токенов, то это запрос на двухфакторную авторизацию
        // Сохраняем email для последующей верификации
        setVerificationData(email, password)
        
        // Обрабатываем ApiResponse<string>
        const apiResponse = response as ApiResponse<string>
        
        // Если ответ - строка или объект с сообщением, считаем это успешным входом
        if (typeof apiResponse === 'string') {
          return { message: apiResponse } as AuthApiResponse;
        } else if (apiResponse.message) {
          return { message: apiResponse.message } as AuthApiResponse;
        } else if (apiResponse.data) {
          // Если ответ в виде строки, преобразуем в объект для соответствия типу
          return typeof apiResponse.data === 'string' 
            ? { message: apiResponse.data } as AuthApiResponse
            : apiResponse.data as AuthApiResponse;
        } else {
          // Если ничего нет, но и ошибки не было - значит всё прошло успешно
          return { message: 'Verification required' } as AuthApiResponse;
        }
      } catch (err: any) {
        console.log('Ошибка при входе:', err?.response?.status || 'нет статуса')
        console.log('Детали ошибки:', err?.response?.data || err?.message)
        
        // Проверяем ошибку 401 (Unauthorized)
        if (err.response && err.response.status === 401) {
          const errorData = err.response.data
          
          // В случае email not confirmed - это ошибка неподтвержденной регистрации
          if (errorData && errorData.error === 'email not confirmed') {
            console.log('Email не подтвержден. Пользователь должен завершить регистрацию.')
            error.value = 'Email не подтвержден. Пожалуйста, завершите регистрацию.'
            throw new Error('Email не подтвержден')
          }
        }
        
        throw err
      }
    } catch (err: any) {
      console.error('Ошибка при входе:', err)
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Ошибка при входе'
      error.value = errorMsg
      throw new Error(errorMsg)
    } finally {
      isLoading.value = false
    }
  }

  // Верификация кода при входе
  async function verifyLogin(code: string) {
    try {
      isLoading.value = true
      error.value = null
      
      // Получаем email из store или из localStorage
      const email = verificationEmail.value || localStorage.getItem('verification_email')
      
      if (!email) {
        console.error('Отсутствует email для верификации')
        error.value = 'Отсутствует email для верификации. Пожалуйста, войдите снова.'
        throw new Error('Отсутствует email для верификации')
      }
      
      console.log('Отправка запроса на верификацию входа:', { code, email })
      const response = await authService.verifyLogin({ 
        code,
        email
      })
      
      console.log('Ответ верификации входа:', response)
      
      // Вариант 1: Проверяем наличие токенов напрямую в ответе
      if (response && typeof response === 'object' && 'access_token' in response && 'refresh_token' in response) {
        console.log('Получены токены напрямую в ответе')
        setTokens(response.access_token, response.refresh_token)
        
        // Загружаем профиль пользователя
        await loadUserProfile()
        
        isVerifying.value = false
        localStorage.removeItem('verification_email')
        localStorage.removeItem('verification_id')
        return true
      }
      
      // Вариант 2: Токены в поле data
      const apiResponse = response as ApiResponse<TokenPair>
      if (apiResponse.data && typeof apiResponse.data === 'object') {
        const responseData = apiResponse.data as Record<string, any>
        const accessToken = responseData.access_token || (responseData as any).accessToken
        const userRefreshToken = responseData.refresh_token || (responseData as any).refreshToken
        
        if (accessToken && userRefreshToken) {
          console.log('Получены токены из поля data')
          setTokens(accessToken, userRefreshToken)
          
          // Загружаем профиль пользователя
          await loadUserProfile()
          
          isVerifying.value = false
          localStorage.removeItem('verification_email')
          localStorage.removeItem('verification_id')
          return true
        }
      }
      
      // Вариант 3: Другие признаки успешности
      if (
        (apiResponse.success === true) || 
        apiResponse.message || 
        (response as any).status === 'success'
      ) {
        console.log('Верификация входа прошла успешно, но без токенов')
        isVerifying.value = false
        localStorage.removeItem('verification_email')
        localStorage.removeItem('verification_id')
        return true
      }
      
      // Если дошли до сюда, значит ответ не содержит токенов и не указан как успешный
      console.error('Неожиданный формат ответа от сервера:', response)
      throw new Error('Неожиданный формат ответа от сервера')
    } catch (err: any) {
      console.error('Ошибка при верификации:', err)
      
      // Детальная обработка ошибок верификации
      if (err.response?.data?.error === 'invalid verification code') {
        error.value = 'Неверный код подтверждения. Пожалуйста, проверьте код и попробуйте снова.'
      } else {
        error.value = err.response?.data?.message || err.response?.data?.error || 'Ошибка при верификации'
      }
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Регистрация пользователя (первый шаг)
  async function register(email: string, password: string, firstName: string = '', lastName: string = ''): Promise<AuthApiResponse> {
    try {
      isLoading.value = true
      error.value = null
      console.log('Register запрос:', { email, password, firstName, lastName })
      
      // Проверка наличия CORS заголовков
      try {
        // Предварительный запрос OPTIONS для проверки CORS
        const corsCheckResponse = await fetch(`${AUTH_API_BASE_URL}/register`, {
          method: 'OPTIONS',
          headers: {
            'Origin': window.location.origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Accept'
          }
        });
        console.log('CORS проверка:', {
          status: corsCheckResponse.status,
          headers: Array.from(corsCheckResponse.headers.entries())
        });
      } catch (corsError) {
        console.warn('Ошибка при проверке CORS:', corsError);
      }
      
      const response = await authService.register({ 
        email, 
        password
      })
      
      console.log('Register ответ:', response)
      
      // Сохраняем email для последующей верификации
      setVerificationData(email, password)
      
      // Дополнительная обработка различных типов ответов
      // Если ответ - строка или объект с сообщением, считаем это успешной регистрацией
      if (typeof response === 'string') {
        console.log('Получен строковый ответ:', response);
        return { message: response };
      } else if (response.message) {
        console.log('Получен ответ с сообщением:', response.message);
        return { message: response.message };
      } else if (response.data) {
        console.log('Получен ответ с данными:', response.data);
        
        // Если в ответе есть verification_id, сохраняем его в localStorage
        if (typeof response.data === 'object' && response.data !== null) {
          const responseData = response.data as Record<string, any>;
          if (responseData.verification_id) {
            console.log('Сохраняем verification_id в localStorage:', responseData.verification_id);
            localStorage.setItem('verification_id', responseData.verification_id.toString());
          }
        }
        
        // Если ответ в виде строки, преобразуем в объект для соответствия типу
        return typeof response.data === 'string' 
          ? { message: response.data } 
          : response.data as AuthApiResponse;
      } else if (response.success === true) {
        console.log('Получен успешный ответ без данных');
        return { message: 'Регистрация успешна' };
      } else {
        // Если ничего нет, но и ошибки не было - значит всё прошло успешно
        console.log('Получен неопределенный ответ, считаем успешным:', response);
        return { message: 'Verification required' };
      }
    } catch (err: any) {
      console.error('Ошибка при регистрации:', err)
      
      // Проверяем 409 Conflict (email already exists)
      if (err.response && err.response.status === 409) {
        const errorMsg = 'Email уже существует'
        error.value = errorMsg
        throw new Error(errorMsg)
      }
      
      // Проверяем другие коды ошибок
      if (err.response && err.response.status === 404) {
        console.error('Эндпоинт регистрации не найден (404). Проверьте URL.');
      } else if (err.response && err.response.status === 0) {
        console.error('Проблема с CORS или сетевое соединение прервано.');
      }
      
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Ошибка при регистрации'
      error.value = errorMsg
      throw new Error(errorMsg)
    } finally {
      isLoading.value = false
    }
  }

  // Верификация email при регистрации
  async function verifyEmail(code: string) {
    try {
      isLoading.value = true
      error.value = null
      
      // Получаем email из store или из localStorage
      const email = verificationEmail.value || localStorage.getItem('registration_email') || localStorage.getItem('verification_email')
      
      if (!email) {
        console.error('Отсутствует email для верификации регистрации')
        error.value = 'Отсутствует email для верификации. Пожалуйста, зарегистрируйтесь снова.'
        throw new Error('Отсутствует email для верификации')
      }
      
      console.log('Отправка запроса на верификацию email:', { code, email })
      const response = await authService.verifyEmail({ 
        code,
        email
      })
      
      console.log('Ответ верификации email:', response)
      
      // Вариант 1: Проверяем наличие токенов напрямую в ответе
      if (response && typeof response === 'object' && 'access_token' in response && 'refresh_token' in response) {
        console.log('Получены токены напрямую в ответе')
        setTokens(response.access_token, response.refresh_token)
        
        // Загружаем профиль пользователя
        await loadUserProfile()
        
        isVerifying.value = false
        localStorage.removeItem('registration_email')
        localStorage.removeItem('verification_email')
        localStorage.removeItem('verification_id')
        return true
      }
      
      // Вариант 2: Токены в поле data
      const apiResponse = response as ApiResponse<TokenPair>
      if (apiResponse.data && typeof apiResponse.data === 'object') {
        const responseData = apiResponse.data as Record<string, any>
        const accessToken = responseData.access_token || (responseData as any).accessToken
        const userRefreshToken = responseData.refresh_token || (responseData as any).refreshToken
        
        if (accessToken && userRefreshToken) {
          console.log('Получены токены из поля data')
          setTokens(accessToken, userRefreshToken)
          
          // Загружаем профиль пользователя
          await loadUserProfile()
          
          isVerifying.value = false
          localStorage.removeItem('registration_email')
          localStorage.removeItem('verification_email')
          localStorage.removeItem('verification_id')
          return true
        }
      }
      
      // Вариант 3: Другие признаки успешности
      if (
        (apiResponse.success === true) || 
        apiResponse.message || 
        (response as any).status === 'success'
      ) {
        console.log('Верификация прошла успешно, но без токенов')
        isVerifying.value = false
        localStorage.removeItem('registration_email')
        localStorage.removeItem('verification_email')
        localStorage.removeItem('verification_id')
        return true
      }
      
      // Если дошли до сюда, значит ответ не содержит токенов и не указан как успешный
      console.error('Неожиданный формат ответа от сервера:', response)
      throw new Error('Неожиданный формат ответа от сервера')
    } catch (err: any) {
      console.error('Ошибка при верификации email:', err)
      
      // Детальная обработка ошибок верификации
      if (err.response?.data?.error === 'invalid verification code') {
        error.value = 'Неверный код подтверждения. Пожалуйста, проверьте код и попробуйте снова.'
      } else {
        error.value = err.response?.data?.message || err.response?.data?.error || 'Ошибка при верификации email'
      }
      
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Запрос на сброс пароля
  async function requestPasswordReset(email: string) {
    try {
      isLoading.value = true
      error.value = null
      
      console.log('Отправка запроса на сброс пароля:', { email })
      const response = await authService.requestPasswordReset({ email })
      
      console.log('Ответ запроса сброса пароля:', response)
      
      // Сохраняем email для последующей верификации
      verificationEmail.value = email
      localStorage.setItem('verification_email', email)
      
      return true
    } catch (err: any) {
      console.error('Ошибка при запросе сброса пароля:', err)
      error.value = err.response?.data?.message || err.response?.data?.error || 'Ошибка при запросе сброса пароля'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Подтверждение сброса пароля
  async function confirmPasswordReset(code: string, newPassword: string) {
    try {
      isLoading.value = true
      error.value = null
      
      // Получаем email из store или из localStorage
      const email = verificationEmail.value || localStorage.getItem('verification_email')
      
      if (!email) {
        console.error('Отсутствует email для подтверждения сброса пароля')
        error.value = 'Отсутствует email для подтверждения. Пожалуйста, запросите сброс пароля снова.'
        throw new Error('Отсутствует email для подтверждения')
      }
      
      console.log('Отправка запроса на подтверждение сброса пароля:', { code, email, newPassword })
      const response = await authService.confirmPasswordReset({ 
        code,
        email,
        new_password: newPassword 
      })
      
      console.log('Ответ подтверждения сброса пароля:', response)
      
      localStorage.removeItem('verification_email')
      verificationEmail.value = null
      
      return true
    } catch (err: any) {
      console.error('Ошибка при подтверждении сброса пароля:', err)
      error.value = err.response?.data?.message || err.response?.data?.error || 'Ошибка при подтверждении сброса пароля'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Выход пользователя
  function logout() {
    console.log('Выход пользователя')
    clearAuthData()
    router.push('/auth/login')
  }

  // Обновление токена
  async function refreshUserToken() {
    if (!refreshToken.value) {
      console.error('Отсутствует refresh token')
      throw new Error('Отсутствует refresh token')
    }
    
    try {
      console.log('Запрос на обновление токена...')
      const response = await authService.refreshToken({ refresh_token: refreshToken.value })
      
      if (response.data) {
        console.log('Токен успешно обновлен')
        const accessToken = response.data.access_token
        const newRefreshToken = response.data.refresh_token
        
        if (accessToken && newRefreshToken) {
          setTokens(accessToken, newRefreshToken)
          return true
        }
      }
      
      throw new Error('Не удалось обновить токен')
    } catch (err) {
      console.error('Ошибка при обновлении токена:', err)
      logout()
      throw err
    }
  }

  // Загрузка профиля пользователя
  async function loadUserProfile() {
    try {
      if (!token.value) {
        console.error('Отсутствует токен для загрузки профиля')
        return null
      }
      
      console.log('Загрузка профиля пользователя')
      const response = await profileService.getProfile()
      console.log('Ответ загрузки профиля:', response)
      
      // Проверяем структуру ответа: данные профиля могут быть как в response.data, так и напрямую в response
      if (response.data) {
        // Данные в поле data (старая структура)
        console.log('Профиль пользователя загружен успешно:', response.data)
        user.value = response.data
        
        // Проверяем, имеет ли пользователь роль гостя
        const userRole = response.data.role as string | undefined
        if (userRole === 'guest') {
          console.warn('Загружен профиль гостя. Возможно, авторизация не удалась или права не установлены.')
        } else {
          console.log('Успешно загружен профиль авторизованного пользователя')
        }
        
        return response.data
      } else if ('id' in response && 'email' in response) {
        // Данные профиля находятся непосредственно в response (новая структура)
        console.log('Профиль пользователя загружен успешно:', response)
        
        // Преобразуем response в UserProfile
        const userProfile: UserProfile = response as unknown as UserProfile
        user.value = userProfile
        
        // Проверяем, имеет ли пользователь роль гостя
        const userRole = userProfile.role as string | undefined
        if (userRole === 'guest') {
          console.warn('Загружен профиль гостя. Возможно, авторизация не удалась или права не установлены.')
        } else {
          console.log('Успешно загружен профиль авторизованного пользователя')
        }
        
        return userProfile
      } else if (response.success === true && response.message) {
        console.warn('Получен успешный ответ, но без данных профиля:', response.message)
        // Если есть успешный ответ, но нет данных, пробуем еще раз через 1 секунду
        await new Promise(resolve => setTimeout(resolve, 1000))
        return await loadUserProfile()
      }
      
      console.error('Не удалось загрузить данные профиля. Ответ:', response)
      return null
    } catch (err: any) {
      console.error('Ошибка при загрузке профиля:', err)
      // В случае ошибки 401, токен не валиден - очищаем данные
      if (err.response && err.response.status === 401) {
        console.warn('Токен невалиден, выполняем логаут')
        logout()
      }
      return null
    }
  }

  // Проверка аутентификации при загрузке приложения
  async function checkAuth() {
    console.log('Проверка аутентификации')
    if (token.value && refreshToken.value) {
      // Если есть токен, но нет данных пользователя, загружаем профиль
      if (!user.value) {
        await loadUserProfile()
      }
      return true
    }
    return false
  }

  // Инициализация аутентификации при запуске приложения
  async function initAuth() {
    console.log('Инициализация аутентификации')
    
    // Восстанавливаем данные верификации из localStorage
    const storedEmail = localStorage.getItem('verification_email')
    if (storedEmail) {
      verificationEmail.value = storedEmail
      isVerifying.value = true
    }
    
    // Проверяем аутентификацию
    const isAuthenticated = await checkAuth()
    
    // Если токен истек, пробуем обновить
    if (isAuthenticated && token.value) {
      // Проверяем валидность токена по его сроку действия (если это JWT)
      try {
        const tokenPayload = JSON.parse(atob(token.value.split('.')[1]))
        const expiration = tokenPayload.exp * 1000 // переводим в миллисекунды
        
        if (expiration && expiration < Date.now()) {
          console.log('Токен истек, пробуем обновить')
          await refreshUserToken()
        }
      } catch (err) {
        console.warn('Не удалось проверить срок действия токена:', err)
        // Если не удалось проверить срок действия, пробуем обновить токен
        await refreshUserToken()
      }
    }
    
    return isAuthenticated
  }

  // Получение профиля пользователя по ID
  async function getUserById(id: string) {
    try {
      isLoading.value = true
      error.value = null
      
      return await profileService.getUserById(id)
    } catch (err: any) {
      console.error('Ошибка при загрузке профиля пользователя по ID:', err)
      error.value = err.response?.data?.message || err.response?.data?.error || err.message || 'Ошибка при загрузке профиля'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Проверка CORS доступности API
  async function checkCorsEnabled() {
    try {
      // Используем fetch вместо axios для предварительной проверки
      const corsCheckResponse = await fetch(`${AUTH_API_BASE_URL}/register`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        }
      });
      
      console.log('CORS check response:', corsCheckResponse);
      return corsCheckResponse.ok;
    } catch (error) {
      console.error('CORS check failed:', error);
      return false;
    }
  }

  // Экспортируем все функции и состояния
  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    currentUser,
    isLoading,
    error,
    verificationEmail,
    verificationPassword,
    login,
    verifyLogin,
    register,
    verifyEmail,
    requestPasswordReset,
    confirmPasswordReset,
    logout,
    refreshUserToken,
    loadUserProfile,
    checkAuth,
    initAuth,
    getUserById,
    checkCorsEnabled
  }
})
