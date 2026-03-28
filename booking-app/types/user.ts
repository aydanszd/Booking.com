export interface AdminUser {
    _id: string
    name: string
    email: string
    role: 'user' | 'admin'
    createdAt: string
}

export const ROLE_COLOR: Record<AdminUser['role'], string> = {
    admin: 'bg-blue-100 text-blue-700',
    user:  'bg-gray-100 text-gray-600',
}

export const AVATAR_COLORS = [
    'bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-orange-500',
    'bg-pink-500',  'bg-teal-500',   'bg-indigo-500',  'bg-rose-500',
]
