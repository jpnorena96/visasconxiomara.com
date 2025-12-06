import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, MoreVertical, Eye, Edit, Trash2, Mail,
  Phone, MapPin, Calendar, FileText, Download, UserPlus,
  ChevronDown, X, Check, AlertCircle, TrendingUp, Users
} from 'lucide-react'
import { toast } from 'sonner'
import { api } from '../../utils/api'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedClient, setSelectedClient] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  // Create Client Modal State
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newClient, setNewClient] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    destination_country: '',
    visa_type: '',
    application_type: 'individual',
    family_members_count: 1
  })

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    filterClients()
  }, [searchTerm, statusFilter, clients])

  const loadClients = async () => {
    setLoading(true)
    try {
      // Cargar clientes reales desde el backend
      const clientsData = await api.clients.getAll()

      // Mapear los datos del backend al formato esperado por el frontend
      const formattedClients = clientsData.map(c => ({
        id: c.id,
        name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Sin nombre',
        email: c.email,
        phone: c.phone || 'No especificado',
        country: c.destination_country || 'No especificado',
        visaType: c.visa_type || 'No especificado',
        status: c.status || 'pending',
        progress: c.progress || 0,
        documents: c.total_documents || 0,
        pendingDocs: c.pending_documents || 0,
        joinDate: c.join_date ? new Date(c.join_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        lastActivity: c.last_activity ? new Date(c.last_activity).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: c.notes || 'Sin notas'
      }))

      setClients(formattedClients)
    } catch (error) {
      console.error('Error loading clients:', error)
      setClients([]) // Mostrar lista vacía en caso de error
    } finally {
      setLoading(false)
    }
  }

  const filterClients = () => {
    let filtered = clients

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter)
    }

    setFilteredClients(filtered)
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
      inactive: 'bg-gray-100 text-gray-700 border-gray-200',
    }
    return colors[status] || colors.inactive
  }

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Activo',
      pending: 'Pendiente',
      completed: 'Completado',
      inactive: 'Inactivo',
    }
    return labels[status] || status
  }

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    pending: clients.filter(c => c.status === 'pending').length,
    completed: clients.filter(c => c.status === 'completed').length,
  }

  const handleCreateClient = async (e) => {
    e.preventDefault()
    setCreating(true)

    try {
      // Validar campos requeridos
      if (!newClient.email || !newClient.password || !newClient.first_name) {
        toast.error('Por favor complete los campos obligatorios')
        setCreating(false)
        return
      }

      await api.clients.create(
        {
          first_name: newClient.first_name,
          last_name: newClient.last_name,
          phone: newClient.phone,
          destination_country: newClient.destination_country,
          visa_type: newClient.visa_type,
          status: 'pending',
          progress: 0
        },
        newClient.email,
        newClient.password
      )

      toast.success('Cliente creado exitosamente')
      setShowCreateModal(false)
      setNewClient({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone: '',
        destination_country: '',
        visa_type: ''
      })
      loadClients() // Recargar lista
    } catch (error) {
      toast.error(error.message || 'Error al crear cliente')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteClient = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await api.clients.delete(id)
      toast.success('Cliente eliminado exitosamente')
      loadClients() // Recargar lista
    } catch (error) {
      toast.error(error.message || 'Error al eliminar cliente')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-xiomara-navy">Gestión de Clientes</h1>
              <p className="text-ink-600 mt-1">{filteredClients.length} clientes encontrados</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-gradient-to-r from-xiomara-sky to-xiomara-pink text-white font-bold hover:shadow-lg transition-all"
            >
              <UserPlus size={20} />
              Nuevo Cliente
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total" value={stats.total} icon={Users} color="blue" />
          <StatCard label="Activos" value={stats.active} icon={TrendingUp} color="green" />
          <StatCard label="Pendientes" value={stats.pending} icon={AlertCircle} color="yellow" />
          <StatCard label="Completados" value={stats.completed} icon={Check} color="purple" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, email o país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 h-12 rounded-xl border-2 border-gray-200 focus:border-xiomara-sky focus:outline-none focus:ring-4 focus:ring-xiomara-sky/20 transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 h-12 rounded-xl border-2 border-gray-200 focus:border-xiomara-sky focus:outline-none focus:ring-4 focus:ring-xiomara-sky/20 transition-all"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="pending">Pendientes</option>
              <option value="completed">Completados</option>
              <option value="inactive">Inactivos</option>
            </select>

            {/* Export Button */}
            <button className="inline-flex items-center gap-2 px-6 h-12 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all">
              <Download size={20} />
              Exportar
            </button>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-xiomara-sky border-r-transparent"></div>
              <p className="mt-4 text-ink-600">Cargando clientes...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-semibold text-gray-900">No se encontraron clientes</p>
              <p className="text-ink-600 mt-2">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      País/Visa
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Progreso
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Documentos
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredClients.map((client) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-xiomara-sky to-xiomara-pink flex items-center justify-center text-white font-bold shrink-0">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500">{client.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{client.country}</div>
                          <div className="text-sm text-gray-500">{client.visaType}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-700">{client.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-xiomara-sky to-xiomara-pink rounded-full transition-all"
                              style={{ width: `${client.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">{client.documents} total</div>
                          {client.pendingDocs > 0 && (
                            <div className="text-amber-600">{client.pendingDocs} pendientes</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(client.status)}`}>
                          {getStatusLabel(client.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedClient(client)
                              setShowDetails(true)
                            }}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                            title="Ver detalles"
                          >
                            <Eye size={18} className="text-gray-600 group-hover:text-blue-600" />
                          </button>
                          <button
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                            title="Editar"
                          >
                            <Edit size={18} className="text-gray-600 group-hover:text-green-600" />
                          </button>
                          <button
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Eliminar"
                          >
                            <Trash2 size={18} className="text-gray-600 group-hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Client Details Modal */}
      <AnimatePresence>
        {showDetails && selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-xiomara-sky to-xiomara-pink p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
                      {selectedClient.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                      <p className="text-white/90 mt-1">{selectedClient.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Información de Contacto</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Mail size={20} className="text-xiomara-sky" />
                      <div>
                        <div className="text-xs text-gray-500">Email</div>
                        <div className="font-medium text-gray-900">{selectedClient.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Phone size={20} className="text-xiomara-sky" />
                      <div>
                        <div className="text-xs text-gray-500">Teléfono</div>
                        <div className="font-medium text-gray-900">{selectedClient.phone}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visa Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Información de Visa</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin size={20} className="text-xiomara-pink" />
                      <div>
                        <div className="text-xs text-gray-500">País Destino</div>
                        <div className="font-medium text-gray-900">{selectedClient.country}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FileText size={20} className="text-xiomara-pink" />
                      <div>
                        <div className="text-xs text-gray-500">Tipo de Visa</div>
                        <div className="font-medium text-gray-900">{selectedClient.visaType}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Progreso del Caso</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Completado</span>
                      <span className="text-lg font-bold text-gray-900">{selectedClient.progress}%</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-xiomara-sky to-xiomara-pink rounded-full"
                        style={{ width: `${selectedClient.progress}%` }}
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-emerald-600">{selectedClient.documents}</div>
                        <div className="text-xs text-gray-500 mt-1">Docs Subidos</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-amber-600">{selectedClient.pendingDocs}</div>
                        <div className="text-xs text-gray-500 mt-1">Pendientes</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Fechas</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Calendar size={20} className="text-purple-500" />
                      <div>
                        <div className="text-xs text-gray-500">Fecha de Registro</div>
                        <div className="font-medium text-gray-900">{selectedClient.joinDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Calendar size={20} className="text-purple-500" />
                      <div>
                        <div className="text-xs text-gray-500">Última Actividad</div>
                        <div className="font-medium text-gray-900">{selectedClient.lastActivity}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedClient.notes && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Notas</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-blue-900">{selectedClient.notes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 h-11 rounded-xl bg-gradient-to-r from-xiomara-sky to-xiomara-pink text-white font-semibold hover:shadow-lg transition-all">
                    Ver Documentos
                  </button>
                  <button className="flex-1 h-11 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all">
                    Editar Cliente
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Client Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-900">Crear Nuevo Cliente</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nombres *</label>
                    <input
                      type="text"
                      required
                      value={newClient.first_name}
                      onChange={(e) => setNewClient({ ...newClient, first_name: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-xiomara-sky focus:ring-2 focus:ring-xiomara-sky/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Apellidos</label>
                    <input
                      type="text"
                      value={newClient.last_name}
                      onChange={(e) => setNewClient({ ...newClient, last_name: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-xiomara-sky focus:ring-2 focus:ring-xiomara-sky/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      required
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-xiomara-sky focus:ring-2 focus:ring-xiomara-sky/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Contraseña *</label>
                    <input
                      type="password"
                      required
                      value={newClient.password}
                      onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-xiomara-sky focus:ring-2 focus:ring-xiomara-sky/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                      type="tel"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-xiomara-sky focus:ring-2 focus:ring-xiomara-sky/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">País Destino</label>
                    <input
                      type="text"
                      value={newClient.destination_country}
                      onChange={(e) => setNewClient({ ...newClient, destination_country: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-xiomara-sky focus:ring-2 focus:ring-xiomara-sky/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tipo de Aplicación</label>
                    <select
                      value={newClient.application_type}
                      onChange={(e) => setNewClient({ ...newClient, application_type: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-xiomara-sky focus:ring-2 focus:ring-xiomara-sky/20 outline-none transition-all"
                    >
                      <option value="individual">Individual</option>
                      <option value="family">Grupo Familiar</option>
                    </select>
                  </div>
                  {newClient.application_type === 'family' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Miembros del Grupo</label>
                      <input
                        type="number"
                        min="2"
                        value={newClient.family_members_count}
                        onChange={(e) => setNewClient({ ...newClient, family_members_count: parseInt(e.target.value) })}
                        className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-xiomara-sky focus:ring-2 focus:ring-xiomara-sky/20 outline-none transition-all"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tipo de Visa</label>
                  <select
                    value={newClient.visa_type}
                    onChange={(e) => setNewClient({ ...newClient, visa_type: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-xiomara-sky focus:ring-2 focus:ring-xiomara-sky/20 outline-none transition-all"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Turista B1/B2">Turista B1/B2</option>
                    <option value="Estudiante F1">Estudiante F1</option>
                    <option value="Trabajo H1B">Trabajo H1B</option>
                    <option value="Residencia">Residencia</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 h-12 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-xiomara-sky to-xiomara-pink text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {creating ? 'Creando...' : 'Crear Cliente'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

// Stat Card Component
function StatCard({ label, value, icon: Icon, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    yellow: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  )
}
