import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    app: {
      name: 'Teimer',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      changeTheme: 'Change Theme',
      savedChains: 'Saved Chains',
      newChain: 'New Chain',
      loading: 'Loading...',
      welcome: 'Welcome Back',
      join: 'Join Teimer and save your chains.',
      access: 'Sign in to access your saved presets.',
      email: 'Email Address',
      password: 'Password',
      createAccount: 'Create Account',
      alreadyHave: 'Already have an account?',
      dontHave: "Don't have an account?",
      createOne: 'Create One',
      language: 'Language',
      forgotPassword: 'Forgot Password?',
      resetLinkSent: 'If the email exists, a password reset link has been sent!',
      backToSignIn: 'Back to Sign In',
      resetPassword: 'Reset Password',
      enterEmailToReset: 'Enter your email to receive a password reset link.',
      checkInboxVerify: 'Registration successful! Please check your inbox (and spam) to verify your email.'
    },
    chain: {
      placeholder: 'New Chain Name...',
      save: 'Save',
      addTimer: 'Add Timer',
      timerName: 'Timer name...',
      timer: 'Timer',
      h: 'H',
      m: 'M',
      s: 'S',
      saved: 'Chain saved successfully!',
      finished: 'Chain finished!',
      error: 'Error'
    }
  },
  ru: {
    app: {
      name: 'Teimer',
      signIn: 'Войти',
      signOut: 'Выйти',
      changeTheme: 'Сменить тему',
      savedChains: 'Сохраненные цепочки',
      newChain: 'Новая цепочка',
      loading: 'Загрузка...',
      welcome: 'С возвращением',
      join: 'Присоединяйтесь к Teimer и сохраняйте свои цепочки.',
      access: 'Войдите, чтобы получить доступ к своим пресетам.',
      email: 'Email адрес',
      password: 'Пароль',
      createAccount: 'Создать аккаунт',
      alreadyHave: 'Уже есть аккаунт?',
      dontHave: 'Нет аккаунта?',
      createOne: 'Создать',
      language: 'Язык',
      forgotPassword: 'Забыли пароль?',
      resetLinkSent: 'Если этот email зарегистрирован, ссылка для сброса пароля отправлена!',
      backToSignIn: 'Назад к входу',
      resetPassword: 'Сбросить пароль',
      enterEmailToReset: 'Введите ваш email, чтобы получить ссылку для сброса пароля.',
      checkInboxVerify: 'Регистрация успешна! Пожалуйста, проверьте почту (и спам) для подтверждения аккаунта.'
    },
    chain: {
      placeholder: 'Название новой цепочки...',
      save: 'Сохранить',
      addTimer: 'Добавить таймер',
      timerName: 'Название таймера...',
      timer: 'Таймер',
      h: 'Ч',
      m: 'М',
      s: 'С',
      saved: 'Цепочка успешно сохранена!',
      finished: 'Цепочка завершена!',
      error: 'Ошибка'
    }
  },
  uk: {
    app: {
      name: 'Teimer',
      signIn: 'Увійти',
      signOut: 'Вийти',
      changeTheme: 'Змінити тему',
      savedChains: 'Збережені ланцюжки',
      newChain: 'Новий ланцюжок',
      loading: 'Завантаження...',
      welcome: 'З поверненням',
      join: 'Приєднуйтесь до Teimer і зберігайте свої ланцюжки.',
      access: 'Увійдіть, щоб отримати доступ до своїх пресетів.',
      email: 'Email адреса',
      password: 'Пароль',
      createAccount: 'Створити акаунт',
      alreadyHave: 'Вже є акаунт?',
      dontHave: 'Немає акаунту?',
      createOne: 'Створити',
      language: 'Мова',
      forgotPassword: 'Забули пароль?',
      resetLinkSent: 'Якщо цей email зареєстрований, посилання для скидання пароля надіслано!',
      backToSignIn: 'Назад до входу',
      resetPassword: 'Скинути пароль',
      enterEmailToReset: 'Введіть ваш email, щоб отримати посилання для скидання пароля.',
      checkInboxVerify: 'Реєстрація успішна! Будь ласка, перевірте пошту (і спам) для підтвердження акаунту.'
    },
    chain: {
      placeholder: 'Назва нового ланцюжка...',
      save: 'Зберегти',
      addTimer: 'Додати таймер',
      timerName: 'Назва таймера...',
      timer: 'Таймер',
      h: 'Г',
      m: 'Хв',
      s: 'С',
      saved: 'Ланцюжок успішно збережено!',
      finished: 'Ланцюжок завершено!',
      error: 'Помилка'
    }
  },
  de: {
    app: {
      name: 'Teimer',
      signIn: 'Anmelden',
      signOut: 'Abmelden',
      changeTheme: 'Design ändern',
      savedChains: 'Gespeicherte Ketten',
      newChain: 'Neue Kette',
      loading: 'Laden...',
      welcome: 'Willkommen zurück',
      join: 'Registrieren Sie sich bei Teimer и speichern Sie Ihre Ketten.',
      access: 'Melden Sie sich an, um auf Ihre Voreinstellungen zuzugreifen.',
      email: 'E-Mail-Adresse',
      password: 'Passwort',
      createAccount: 'Konto erstellen',
      alreadyHave: 'Haben Sie bereits ein Konto?',
      dontHave: 'Haben Sie noch kein Konto?',
      createOne: 'Konto erstellen',
      language: 'Sprache',
      forgotPassword: 'Passwort vergessen?',
      resetLinkSent: 'Wenn die E-Mail registriert ist, wurde ein Link zum Zurücksetzen gesendet!',
      backToSignIn: 'Zurück zum Anmelden',
      resetPassword: 'Passwort zurücksetzen',
      enterEmailToReset: 'Geben Sie Ihre E-Mail-Adresse ein, um einen Link zum Zurücksetzen des Passworts zu erhalten.',
      checkInboxVerify: 'Registrierung erfolgreich! Bitte überprüfen Sie Ihren Posteingang (und Spam), um Ihre E-Mail zu bestätigen.'
    },
    chain: {
      placeholder: 'Name der neuen Kette...',
      save: 'Speichern',
      addTimer: 'Timer hinzufügen',
      timerName: 'Timer-Name...',
      timer: 'Timer',
      h: 'Std',
      m: 'Min',
      s: 'Sek',
      saved: 'Kette erfolgreich gespeichert!',
      finished: 'Kette beendet!',
      error: 'Fehler'
    }
  }
}

const savedLocale = localStorage.getItem('teimer-locale')

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale || 'en',
  fallbackLocale: 'en',
  messages
})
