# Объяснение структуры проекта

Этот проект представляет собой веб-приложение, построенное с использованием Vue.js. Ниже приведены основные компоненты и их взаимодействие.

## Структура компонентов

### 1. MainLayout.vue
- **Описание**: Основной контейнер для всего приложения. Управляет общей структурой и отображением дочерних компонентов.
- **Ключевые элементы**:
  - `TopPanel`: Верхняя панель с логотипом и кнопками.
  - `Navbar`: Десктопная навигация, отображается только на больших экранах.
  - `MobileNavPanel`: Мобильная навигация, отображается на маленьких экранах.
  - `ProfilePanel`: Панель профиля пользователя.
  - `Footer`: Нижняя часть страницы.
  - `RouterView`: Отображает контент в зависимости от текущего маршрута.

### 2. MainHeader.vue
- **Описание**: Заголовок приложения, содержащий логотип и навигацию.
- **Ключевые элементы**:
  - Кнопка для переключения бокового меню на мобильных устройствах.
  - Ссылки на основные разделы приложения.

### 3. MobileNavPanel.vue
- **Описание**: Мобильная навигация, адаптированная для небольших экранов.
- **Ключевые элементы**:
  - Содержит ссылки на основные разделы приложения.
  - Адаптируется в зависимости от статуса авторизации пользователя.

### 4. TopPanel.vue
- **Описание**: Панель с логотипом, которая может разворачиваться и сворачиваться.
- **Ключевые элементы**:
  - Логотипы, которые меняются в зависимости от состояния панели.
  - Анимация при разворачивании и сворачивании.

### 5. ProfilePanel.vue
- **Описание**: Панель профиля пользователя, отображающая информацию и настройки.
- **Ключевые элементы**:
  - Ссылки на профиль, настройки и выход из системы.
  - Интеграция с системой авторизации.

### 6. Navbar.vue
- **Описание**: Десктопная навигация, отображающая основные разделы приложения.
- **Ключевые элементы**:
  - Ссылки на главные страницы.
  - Возможность сворачивания панели.

### 7. MainSidebar.vue
- **Описание**: Боковая панель навигации, которая отображается на мобильных устройствах.
- **Ключевые элементы**:
  - Кнопка закрытия для мобильных устройств.
  - Ссылки на основные разделы приложения.

## Взаимодействие компонентов
- `MainLayout` управляет состоянием и отображением всех дочерних компонентов.
- `TopPanel`, `Navbar`, и `MobileNavPanel` предоставляют навигацию по маршрутам приложения.
- `RouterView` отображает контент в зависимости от текущего маршрута, который может быть изменен через навигационные компоненты.

## Используемые технологии
- **Vue.js**: Основной фреймворк для построения пользовательского интерфейса.
- **Vue Router**: Для управления маршрутизацией в приложении.
- **Tailwind CSS**: Для стилизации компонентов.

## Установка и запуск
1. Клонируйте репозиторий.
2. Установите зависимости с помощью `npm install`.
3. Запустите приложение с помощью `npm run serve`.

## Заключение
Этот проект демонстрирует использование Vue.js для создания адаптивного веб-приложения с компонентной архитектурой. Каждый компонент отвечает за свою часть интерфейса и взаимодействует с другими компонентами для создания целостного пользовательского опыта.

+-------------------+
|   MainLayout.vue  |
|                   |
|  +--------------+ |  <--- Управляет состоянием и отображением
|  |  TopPanel    | |        дочерних компонентов
|  +--------------+ |
|                   |
|  +--------------+ |   +-------------------+
|  |   Navbar     | |   |   MobileNavPanel   |
|  | (Desktop)    | |   | (Mobile)           |
|  +--------------+ |   +-------------------+
|                   |   |                   |
|  +--------------+ |   |  +--------------+ |
|  | ProfilePanel | |   |  |  User Links  | |
|  | (Desktop)    | |   |  +--------------+ |
|  +--------------+ |   |                   |
|                   |   |  +--------------+ |
|  +--------------+ |   |  |  Logout      | |
|  |   Footer     | |   |  +--------------+ |
|  +--------------+ |   +-------------------+
|                   |
|  +--------------+ |
|  | ScrollToTop  | |
|  +--------------+ |
|                   |
|  +--------------+ |
|  | RouterView   | |  <--- Отображает контент в зависимости от текущего маршрута
|  +--------------+ |
+-------------------+

Описание компонентов:
1. MainLayout.vue
Роль: Основной контейнер для всего приложения.
Взаимодействие: Управляет состоянием и отображением дочерних компонентов, таких как TopPanel, Navbar, ProfilePanel, Footer, ScrollToTop и RouterView.
2. TopPanel.vue
Роль: Верхняя панель с логотипом и кнопками.
Взаимодействие: Отправляет событие @update:blur в MainLayout для управления состоянием размытия.
3. Navbar.vue
Роль: Десктопная навигация, отображается только на больших экранах.
Взаимодействие: Отправляет событие @toggle в MainLayout для управления состоянием сворачивания.
4. MobileNavPanel.vue
Роль: Мобильная навигация, отображается на маленьких экранах.
Взаимодействие: Использует RouterLink для навигации по маршрутам и отображает ссылки в зависимости от статуса авторизации.
5. ProfilePanel.vue
Роль: Панель профиля пользователя, отображающая информацию и настройки.
Взаимодействие: Отправляет события для управления состоянием сворачивания и выхода из системы.
6. Footer.vue
Роль: Нижняя часть страницы, может содержать дополнительные ссылки или информацию.
Взаимодействие: Не взаимодействует напрямую с другими компонентами, но может изменять стиль в зависимости от состояния.
7. ScrollToTop.vue
Роль: Кнопка для быстрого перемещения к верху страницы.
Взаимодействие: Отправляет событие @scroll в MainLayout для прокрутки к верху страницы.
8. RouterView.vue
Роль: Отображает контент в зависимости от текущего маршрута.
Взаимодействие: Используется для отображения страниц в зависимости от текущего маршрута.
Дополнительные детали:
- Состояния: MainLayout управляет состоянием видимости для Navbar, ProfilePanel и MobileNavPanel в зависимости от размера экрана.
- Адаптивность: Компоненты Navbar и MobileNavPanel адаптируются в зависимости от статуса авторизации пользователя.
- События: Компоненты отправляют события для управления состоянием родительского компонента, что позволяет динамически изменять интерфейс.
Эта схема и описание помогут лучше понять, как компоненты взаимодействуют друг с другом и как они организованы в вашем приложении.

## Структура компонентов

1. **MainLayout.vue**
   - **Описание**: Основной контейнер для всего приложения. Управляет общей структурой и отображением дочерних компонентов.
   - **Ключевые элементы**:
     - `TopPanel`: Верхняя панель с логотипом и кнопками.
     - `Navbar`: Десктопная навигация, отображается только на больших экранах.
     - `MobileNavPanel`: Мобильная навигация, отображается на маленьких экранах.
     - `ProfilePanel`: Панель профиля пользователя.
     - `Footer`: Нижняя часть страницы.
     - `RouterView`: Отображает контент в зависимости от текущего маршрута.

2. **MainHeader.vue**
   - **Описание**: Заголовок приложения, содержащий логотип и навигацию.
   - **Ключевые элементы**:
     - Кнопка для переключения бокового меню на мобильных устройствах.
     - Ссылки на основные разделы приложения.

3. **MobileNavPanel.vue**
   - **Описание**: Мобильная навигация, адаптированная для небольших экранов.
   - **Ключевые элементы**:
     - Содержит ссылки на основные разделы приложения.
     - Адаптируется в зависимости от статуса авторизации пользователя.

4. **TopPanel.vue**
   - **Описание**: Панель с логотипом, которая может разворачиваться и сворачиваться.
   - **Ключевые элементы**:
     - Логотипы, которые меняются в зависимости от состояния панели.
     - Анимация при разворачивании и сворачивании.

5. **ProfilePanel.vue**
   - **Описание**: Панель профиля пользователя, отображающая информацию и настройки.
   - **Ключевые элементы**:
     - Ссылки на профиль, настройки и выход из системы.
     - Интеграция с системой авторизации.

6. **Navbar.vue**
   - **Описание**: Десктопная навигация, отображающая основные разделы приложения.
   - **Ключевые элементы**:
     - Ссылки на главные страницы.
     - Возможность сворачивания панели.

7. **MainSidebar.vue**
   - **Описание**: Боковая панель навигации, которая отображается на мобильных устройствах.
   - **Ключевые элементы**:
     - Кнопка закрытия для мобильных устройств.
     - Ссылки на основные разделы приложения.