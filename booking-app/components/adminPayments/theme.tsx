import { Building2, Car, Plane, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export const TYPE_ICONS: Record<string, React.ReactNode> = {
    building: <Building2 size={14} className="text-blue-500" />,
    car:      <Car       size={14} className="text-violet-500" />,
    flight:   <Plane     size={14} className="text-sky-500" />,
}

export const TYPE_LABELS: Record<string, string> = {
    building: 'Otel',
    car:      'Avtomobil',
    flight:   'Uçuş',
}

export type PaymentStatusConfig = {
    label: string
    cls: string
    icon: React.ReactNode
}

export const PAYMENT_STATUS_CONFIG: Record<string, PaymentStatusConfig> = {
    paid: {
        label: 'Tam ödənilib',
        cls:   'bg-emerald-100 text-emerald-700 border-emerald-200',
        icon:  <CheckCircle2 size={11} />,
    },
    partial: {
        label: 'Qismən ödənilib',
        cls:   'bg-amber-100 text-amber-700 border-amber-200',
        icon:  <Clock size={11} />,
    },
    unpaid: {
        label: 'Ödənilməyib',
        cls:   'bg-rose-100 text-rose-700 border-rose-200',
        icon:  <AlertCircle size={11} />,
    },
    cancelled: {
        label: 'Ləğv edilib',
        cls:   'bg-gray-100 text-gray-400 border-gray-200',
        icon:  <AlertCircle size={11} />,
    },
}
