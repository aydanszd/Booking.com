'use client'

import { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { FlightType, ModalType } from '@/types/flight'
import { flightApi } from '@/api/flight'
import { LIMIT } from '@/components/adminFlights/constants'
import FlightStatsBar from '@/components/adminFlights/FlightStatsBar'
import FlightToolbar from '@/components/adminFlights/FlightToolbar'
import FlightTable from '@/components/adminFlights/FlightTable'
import FlightPagination from '@/components/adminFlights/FlightPagination'
import FlightFormModal from '@/components/modals/FlightFormModal'
import FlightDeleteModal from '@/components/modals/FlightDeleteModal'

export default function FlightsPage() {
    const [flights, setFlights] = useState<FlightType[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [filterCabin, setFilterCabin] = useState('')
    const [showFilter, setShowFilter] = useState(false)
    const [modal, setModal] = useState<ModalType>(null)
    const [selected, setSelected] = useState<FlightType | null>(null)

    const fetchFlights = async () => {
        setLoading(true)
        try {
            const data = await flightApi.getAll({ page, limit: LIMIT, cabin: filterCabin })
            setFlights(data.flights)
            setTotal(data.total)
        } catch {
            toast.error('Məlumatlar yüklənmədi')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchFlights() }, [page, filterCabin])

    const filtered = flights.filter(f =>
        `${f.airline} ${f.flightNumber} ${f.origin.city} ${f.destination.city} ${f.origin.code} ${f.destination.code}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    const openAdd    = () => { setSelected(null); setModal('add') }
    const openEdit   = (f: FlightType) => { setSelected(f); setModal('edit') }
    const openDelete = (f: FlightType) => { setSelected(f); setModal('delete') }
    const closeModal = () => { setModal(null); setSelected(null) }
    const onSuccess  = async () => { await fetchFlights(); closeModal() }

    const handleFilterChange = (cabin: string) => {
        setFilterCabin(cabin)
        setShowFilter(false)
        setPage(1)
    }

    const totalPages = Math.ceil(total / LIMIT)

    return (
        <div className="space-y-5 font-sans">
            <Toaster position="top-right" richColors />

            <FlightStatsBar flights={flights} total={total} />

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <FlightToolbar
                    search={search}
                    onSearchChange={setSearch}
                    filterCabin={filterCabin}
                    onFilterChange={handleFilterChange}
                    showFilter={showFilter}
                    onToggleFilter={() => setShowFilter(s => !s)}
                    onAdd={openAdd}
                />

                <FlightTable
                    flights={filtered}
                    loading={loading}
                    onEdit={openEdit}
                    onDelete={openDelete}
                />

                <FlightPagination
                    page={page}
                    total={total}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>

            {(modal === 'add' || modal === 'edit') && (
                <FlightFormModal
                    mode={modal}
                    flight={selected}
                    onClose={closeModal}
                    onSuccess={onSuccess}
                />
            )}

            {modal === 'delete' && selected && (
                <FlightDeleteModal
                    flight={selected}
                    onClose={closeModal}
                    onSuccess={onSuccess}
                />
            )}
        </div>
    )
}
