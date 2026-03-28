import { STATUS_STYLES, STATUS_ICONS } from './constants'

export default function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLES[status] ?? STATUS_STYLES.pending}`}>
            {STATUS_ICONS[status]}
            {status}
        </span>
    )
}
