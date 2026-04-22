export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 mt-20 min-h-screen animate-pulse">
            {/* Breadcrumb */}
            <div className="h-3 bg-gray-200 rounded w-48 mb-4 mt-2" />

            {/* Title card */}
            <div className="bg-white px-3 sm:px-6 py-4 mb-4 rounded-2xl border border-gray-100">
                <div className="h-8 bg-gray-200 rounded w-64 mb-3" />
                <div className="h-8 bg-gray-100 rounded-xl w-40" />
            </div>

            {/* Gallery */}
            <div className="bg-white px-3 sm:px-6 py-4 mb-4 rounded-2xl border border-gray-100">
                <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 h-[400px]">
                    <div className="col-span-2 row-span-2 bg-gray-200 rounded-xl" />
                    <div className="col-span-2 bg-gray-200 rounded-xl" />
                    <div className="col-span-2 bg-gray-100 rounded-xl" />
                </div>
                <div className="sm:hidden h-56 bg-gray-200 rounded-xl" />
            </div>

            {/* Description */}
            <div className="px-3 sm:px-6 py-5 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
                <div className="h-3 bg-gray-100 rounded w-4/6" />
            </div>
        </div>
    )
}
