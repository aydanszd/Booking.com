import { Building2, Car, Plane, CheckCircle2, XCircle, Clock } from 'lucide-react'

export const TYPE_ICONS: Record<string, React.ReactNode> = {
    building: <Building2 size={15} className="text-blue-500" />,
    car:      <Car       size={15} className="text-violet-500" />,
    flight:   <Plane     size={15} className="text-sky-500" />,
}

export const TYPE_LABELS: Record<string, string> = {
    building: 'Otel',
    car:      'Avtomobil',
    flight:   'Uçuş',
}

export const STATUS_STYLES: Record<string, string> = {
    confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
    pending:   'bg-amber-100 text-amber-700 border-amber-200',
    completed: 'bg-blue-100 text-blue-700 border-blue-200',
}

export const STATUS_ICONS: Record<string, React.ReactNode> = {
    confirmed: <CheckCircle2 size={12} />,
    cancelled: <XCircle      size={12} />,
    pending:   <Clock        size={12} />,
    completed: <CheckCircle2 size={12} />,
}
