export type LocaleData = Record<string, string>
export type AllData = { en: LocaleData; tr: LocaleData; ru: LocaleData }
export type Locale = 'en' | 'tr' | 'ru'

export const LOCALES = [
    { code: 'en' as Locale, label: 'English', flag: '🇬🇧' },
    { code: 'tr' as Locale, label: 'Türkçe',  flag: '🇹🇷' },
    { code: 'ru' as Locale, label: 'Русский', flag: '🇷🇺' },
] as const

export const SECTION_COLORS: Record<string, string> = {
    nav:    'bg-blue-50 text-blue-700 border-blue-200',
    header: 'bg-purple-50 text-purple-700 border-purple-200',
    guests: 'bg-green-50 text-green-700 border-green-200',
    home:   'bg-orange-50 text-orange-700 border-orange-200',
    other:  'bg-gray-100 text-gray-600 border-gray-200',
}
