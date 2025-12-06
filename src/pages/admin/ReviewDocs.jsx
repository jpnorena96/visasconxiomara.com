import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, CheckCircle, XCircle, Clock, Eye, Download, MessageSquare,
  Filter, Search, Calendar, User, AlertCircle, ChevronLeft, ChevronRight,
  ZoomIn, RotateCw, X, Check, FileCheck, Loader2
} from 'lucide-react'
import { api } from '../../utils/api'

export default function ReviewDocs() {
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [documents, setDocuments] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewing, setReviewing] = useState(false)
  const [filterStatus, setFilterStatus] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [notes, setNotes] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    if (selectedCustomer) {
      loadDocuments(selectedCustomer.id)
    }
  }, [selectedCustomer, filterStatus])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      // Simulated data - replace with actual API call
      const mockCustomers = [
        { id: 1, name: 'María González', email: 'maria@example.com', pendingDocs: 3 },
        { id: 2, name: 'Carlos Rodríguez', email: 'carlos@example.com', pendingDocs: 5 },
        { id: 3, name: 'Ana Martínez', email: 'ana@example.com', pendingDocs: 1 },
        { id: 4, name: 'Luis Fernández', email: 'luis@example.com', pendingDocs: 2 },
      ]
      setCustomers(mockCustomers)
      if (mockCustomers.length > 0) {
        setSelectedCustomer(mockCustomers[0])
      }
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDocuments = async (customerId) => {
    try {
      // Simulated data - replace with actual API call
      const mockDocs = [
        {
          id: 1,
          category: 'Pasaporte',
          original_name: 'pasaporte_maria.pdf',
          status: 'pending',
          uploaded_at: '2024-12-05T10:30:00',
          size_bytes: 2048000,
          admin_notes: '',
          url: '/sample-doc.pdf'
        },
        {
          id: 2,
          category: 'DNI',
          original_name: 'dni_frente.jpg',
          status: 'pending',
          uploaded_at: '2024-12-05T11:15:00',
          size_bytes: 1024000,
          admin_notes: '',
          url: '/sample-doc.pdf'
        },
        {
          id: 3,
          category: 'Certificado Laboral',
          original_name: 'certificado_trabajo.pdf',
          status: 'approved',
          uploaded_at: '2024-12-04T14:20:00',
          size_bytes: 512000,
          admin_notes: 'Documento válido y legible',
          url: '/sample-doc.pdf'
        },
      ]

      const filtered = filterStatus === 'all'
        ? mockDocs
        : mockDocs.filter(d => d.status === filterStatus)

      setDocuments(filtered)
    } catch (error) {
      console.error('Error loading documents:', error)
    }
  }

  const handleReview = async (docId, status) => {
    setReviewing(true)
    try {
      // Simulated API call - replace with actual
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update local state
      setDocuments(prev => prev.map(doc =>
        doc.id === docId
          ? { ...doc, status, admin_notes: notes || (status === 'approved' ? 'Aprobado' : 'Requiere corrección') }
          : doc
      ))

      setNotes('')
      setSelectedDoc(null)

      // Reload documents
      if (selectedCustomer) {
        await loadDocuments(selectedCustomer.id)
      }
    } catch (error) {
      console.error('Error reviewing document:', error)
    } finally {
      setReviewing(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
      approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
      rejected: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle },
    }
    const style = styles[status] || styles.pending
    const Icon = style.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
        <Icon size={12} />
        {status === 'pending' ? 'Pendiente' : status === 'approved' ? 'Aprobado' : 'Rechazado'}
      </span>
    )
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const pendingCount = documents.filter(d => d.status === 'pending').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-xiomara-navy">Revisión de Documentos</h1>
              <p className="text-ink-600 mt-1">
                {pendingCount} documento{pendingCount !== 1 ? 's' : ''} pendiente{pendingCount !== 1 ? 's' : ''} de revisión
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 h-10 rounded-xl border-2 border-gray-200 focus:border-xiomara-sky focus:outline-none transition-all"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendientes</option>
                <option value="approved">Aprobados</option>
                <option value="rejected">Rechazados</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Customers Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-32">
              <div className="p-4 bg-gradient-to-r from-xiomara-sky/10 to-xiomara-pink/10 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Clientes</h3>
                <p className="text-xs text-gray-600 mt-1">{customers.length} total</p>
              </div>

              <div className="p-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="animate-spin mx-auto text-xiomara-sky" size={32} />
                  </div>
                ) : (
                  <div className="space-y-1">
                    {customers.map((customer) => (
                      <button
                        key={customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                        className={`w-full text-left p-3 rounded-xl transition-all ${selectedCustomer?.id === customer.id
                            ? 'bg-gradient-to-r from-xiomara-sky to-xiomara-pink text-white shadow-md'
                            : 'hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold shrink-0 ${selectedCustomer?.id === customer.id
                              ? 'bg-white/20 text-white'
                              : 'bg-gradient-to-br from-xiomara-sky to-xiomara-pink text-white'
                            }`}>
                            {customer.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{customer.name}</div>
                            <div className={`text-xs truncate ${selectedCustomer?.id === customer.id ? 'text-white/90' : 'text-gray-500'
                              }`}>
                              {customer.email}
                            </div>
                          </div>
                          {customer.pendingDocs > 0 && (
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedCustomer?.id === customer.id
                                ? 'bg-white/20 text-white'
                                : 'bg-amber-100 text-amber-700'
                              }`}>
                              {customer.pendingDocs}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-3">
            {!selectedCustomer ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <User size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-semibold text-gray-900">Selecciona un cliente</p>
                <p className="text-gray-600 mt-2">Elige un cliente de la lista para ver sus documentos</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-semibold text-gray-900">No hay documentos</p>
                    <p className="text-gray-600 mt-2">
                      {filterStatus === 'all'
                        ? 'Este cliente no ha subido documentos aún'
                        : `No hay documentos con estado "${filterStatus}"`
                      }
                    </p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shrink-0">
                              <FileText size={28} className="text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900 text-lg">{doc.category}</h3>
                                {getStatusBadge(doc.status)}
                              </div>
                              <p className="text-sm text-gray-600 truncate">{doc.original_name}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {formatDate(doc.uploaded_at)}
                                </span>
                                <span>{formatFileSize(doc.size_bytes)}</span>
                              </div>
                              {doc.admin_notes && (
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <MessageSquare size={16} className="text-blue-600 mt-0.5 shrink-0" />
                                    <p className="text-sm text-blue-900">{doc.admin_notes}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setSelectedDoc(doc)
                                setShowPreview(true)
                              }}
                              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                            >
                              <Eye size={18} />
                              Ver
                            </button>
                            {doc.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedDoc(doc)
                                    setNotes('')
                                  }}
                                  className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all"
                                >
                                  <Check size={18} />
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedDoc(doc)
                                    setNotes('Requiere corrección')
                                  }}
                                  className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold hover:shadow-lg transition-all"
                                >
                                  <X size={18} />
                                  Rechazar
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedDoc && !showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !reviewing && setSelectedDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Revisar Documento</h2>
                  <button
                    onClick={() => !reviewing && setSelectedDoc(null)}
                    disabled={reviewing}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedDoc.category}</h3>
                  <p className="text-sm text-gray-600">{selectedDoc.original_name}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notas del Administrador
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Agrega comentarios sobre este documento..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-xiomara-sky focus:outline-none focus:ring-4 focus:ring-xiomara-sky/20 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleReview(selectedDoc.id, 'approved')}
                    disabled={reviewing}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {reviewing ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Aprobar
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReview(selectedDoc.id, 'rejected')}
                    disabled={reviewing}
                    className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {reviewing ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <XCircle size={20} />
                        Rechazar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{selectedDoc.category}</h3>
                  <p className="text-sm text-gray-300">{selectedDoc.original_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`${api.baseUrl}/api/v1/documents/${selectedDoc.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Download size={20} />
                  </a>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-8 bg-gray-100 flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                  <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Vista previa del documento</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedDoc.original_name}
                  </p>
                  <a
                    href={`${api.baseUrl}/api/v1/documents/${selectedDoc.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-6 h-11 rounded-xl bg-xiomara-sky text-white font-semibold hover:shadow-lg transition-all"
                  >
                    <Download size={18} />
                    Descargar para ver
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
