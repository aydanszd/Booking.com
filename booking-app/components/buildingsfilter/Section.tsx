interface Props {
    title: string;
    children: React.ReactNode;
}

export function Section({ title, children }: Props) {
    return (
        <div className="py-4 border-b border-gray-100 last:border-0">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h3>
            <div className="space-y-1.5">{children}</div>
        </div>
    );
}