interface Props {
    value: number;
}

export function ScoreBadge({ value }: Props) {
    const bg =
        value >= 9 ? "bg-[#003580]" : value >= 8 ? "bg-[#1a5276]" : "bg-[#1a6b3c]";
    return (
        <div
            className={`${bg} text-white text-sm font-bold px-2 py-1 rounded-lg rounded-tr-none min-w-[2.5rem] text-center`}
        >
            {value.toFixed(1)}
        </div>
    );
}