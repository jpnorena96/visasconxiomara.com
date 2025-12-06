import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, FileText, CheckCircle, XCircle, Clock, TrendingUp,
  Calendar, DollarSign, AlertTriangle, Download, Filter,
  Search, MoreVertical, Eye, Edit, Trash2, ArrowUpRight,
  BarChart3, PieChart, Activity, UserCheck, FileCheck
} from 'lucide-react'
import { api } from '../../utils/api'
import { toast } from 'sonner'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalDocuments: 0,
    pendingDocuments: 0,
    approvedDocuments: 0,
    rejectedDocuments: 0,
    monthlyRevenue: 0,
    completionRate: 0
  })

  const [recentClients, setRecentClients] = useState([])
  const [recentDocuments, setRecentDocuments] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleExport = async () => {
    try {
      const token = api.token;
      if (!token) {
        toast.error("No hay sesión activa");
        return;
      }

      const response = await fetch(`${api.baseUrl}/api/v1/admin/export/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Error al exportar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte_clientes.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Reporte exportado exitosamente");
    } catch (e) {
      console.error(e);
      toast.error("Error al exportar reporte");
    }
  }

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Cargar clientes
      const clients = await api.clients.getAll()

      // Cargar documentos (todos)
      const documents = await api.documents.getAllAdmin()

      // Cargar actividades recientes
      const activities = await api.activities.getRecent(10)

      // Calcular estadísticas desde los datos reales
      const activeClients = clients.filter(c => c.status === 'active').length

      // Stats de documentos reales
      const totalDocs = documents.length
      const pendingDocs = documents.filter(d => d.status === 'pending').length
      const approvedDocs = documents.filter(d => d.status === 'approved').length
      const rejectedDocs = documents.filter(d => d.status === 'rejected').length

      setStats({
        totalClients: clients.length,
        activeClients: activeClients,
        totalDocuments: totalDocs,
        pendingDocuments: pendingDocs,
        approvedDocuments: approvedDocs,
        rejectedDocuments: rejectedDocs,
        monthlyRevenue: 45600, // Esto vendría de un endpoint de pagos
        completionRate: clients.length > 0 ? (activeClients / clients.length * 100).toFixed(1) : 0
      })

      // Tomar los 4 clientes más recientes
      setRecentClients(clients.slice(0, 4).map(c => ({
        id: c.id,
        name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Sin nombre',
        email: c.email,
        status: c.status,
        documents: c.total_documents || 0,
        progress: c.progress || 0
      })))

      // Convertir actividades en "documentos recientes" para mostrar
      setRecentDocuments(activities.slice(0, 4).map(a => ({
        id: a.id,
        client: a.title,
        category: a.activity_type,
        status: a.activity_type.includes('approved') ? 'approved' :
          a.activity_type.includes('rejected') ? 'rejected' : 'pending',
        date: new Date(a.created_at).toLocaleDateString('es-ES')
      })))

      // Configurar actividades recientes para el feed
      setRecentActivities(activities.map(a => {
        let icon = Activity
        let color = 'blue'

        if (a.activity_type === 'user_registered') { icon = UserCheck; color = 'blue' }
        else if (a.activity_type === 'document_approved') { icon = FileCheck; color = 'green' }
        else if (a.activity_type === 'document_rejected') { icon = AlertTriangle; color = 'red' }
        else if (a.activity_type === 'document_uploaded') { icon = FileText; color = 'yellow' }
        else if (a.activity_type === 'client_updated') { icon = Edit; color = 'purple' }

        return {
          id: a.id,
          title: a.title,
          description: a.description,
          time: new Date(a.created_at).toLocaleString('es-ES'),
          icon,
          color
        }
      }))

    } catch (error) {
      console.error('Error loading dashboard:', error)
      // Si hay error, mostrar datos vacíos en lugar de datos falsos
      setStats({
        totalClients: 0,
        activeClients: 0,
        totalDocuments: 0,
        pendingDocuments: 0,
        approvedDocuments: 0,
        rejectedDocuments: 0,
        monthlyRevenue: 0,
        completionRate: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-xiomara-navy">Panel de Administración</h1>
              <p className="text-ink-600 mt-1">Bienvenido de vuelta, administrador</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all">
                <Download size={18} />
                Exportar
              </button>
              <button className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-to-r from-xiomara-sky to-xiomara-pink text-white font-semibold hover:shadow-lg transition-all">
                <Calendar size={18} />
                Hoy: {new Date().toLocaleDateString('es-ES')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Clientes"
            value={stats.totalClients}
            change="+12%"
            trend="up"
            icon={Users}
            color="blue"
            {...fadeIn}
          />
          <StatCard
            title="Documentos Pendientes"
            value={stats.pendingDocuments}
            change="-5%"
            trend="down"
            icon={Clock}
            color="yellow"
            {...fadeIn}
          />
          <StatCard
            title="Tasa de Aprobación"
            value={`${stats.completionRate}%`}
            change="+3.2%"
            trend="up"
            icon={CheckCircle}
            color="green"
            {...fadeIn}
          />
          <StatCard
            title="Ingresos del Mes"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            change="+18%"
            trend="up"
            icon={DollarSign}
            color="purple"
            {...fadeIn}
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Document Status Chart */}
          <motion.div {...fadeIn} className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-xiomara-navy">Estado de Documentos</h3>
                <p className="text-sm text-ink-500 mt-1">Resumen de revisiones</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <DocumentStatusBar
                label="Aprobados"
                count={stats.approvedDocuments}
                total={stats.totalDocuments}
                color="emerald"
              />
              <DocumentStatusBar
                label="Pendientes"
                count={stats.pendingDocuments}
                total={stats.totalDocuments}
                color="amber"
              />
              <DocumentStatusBar
                label="Rechazados"
                count={stats.rejectedDocuments}
                total={stats.totalDocuments}
                color="rose"
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{stats.approvedDocuments}</div>
                <div className="text-xs text-ink-500 mt-1">Aprobados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{stats.pendingDocuments}</div>
                <div className="text-xs text-ink-500 mt-1">Pendientes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-rose-600">{stats.rejectedDocuments}</div>
                <div className="text-xs text-ink-500 mt-1">Rechazados</div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-xiomara-navy mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link
                to="/admin/clientes"
                className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-xiomara-sky hover:bg-xiomara-sky/5 transition-all group"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-xiomara-sky group-hover:text-white transition-colors">
                  <Users size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Ver Clientes</div>
                  <div className="text-xs text-gray-500">Gestionar usuarios</div>
                </div>
                <ArrowUpRight size={18} className="text-gray-400 group-hover:text-xiomara-sky" />
              </Link>

              <Link
                to="/admin/documentos"
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-xiomara-pink hover:bg-xiomara-pink/5 transition-all group"
              >
                <div className="h-10 w-10 rounded-lg bg-pink-100 flex items-center justify-center group-hover:bg-xiomara-pink group-hover:text-white transition-colors">
                  <FileCheck size={20} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">Revisar Docs</div>
                  <div className="text-xs text-gray-500">{stats.pendingDocuments} pendientes</div>
                </div>
                <ArrowUpRight size={18} className="text-gray-400 group-hover:text-xiomara-pink" />
              </Link>

              <Link
                to="/admin/reportes"
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
              >
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <BarChart3 size={20} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">Reportes</div>
                  <div className="text-xs text-gray-500">Ver analytics</div>
                </div>
                <ArrowUpRight size={18} className="text-gray-400 group-hover:text-purple-500" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Tables Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Clients */}
          <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-xiomara-navy">Clientes Recientes</h3>
                  <p className="text-sm text-ink-500 mt-1">Últimas incorporaciones</p>
                </div>
                <Link
                  to="/admin/clientes"
                  className="text-sm font-semibold text-xiomara-sky hover:text-xiomara-pink transition-colors"
                >
                  Ver todos →
                </Link>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {recentClients.map((client) => (
                <div key={client.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-xiomara-sky to-xiomara-pink flex items-center justify-center text-white font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{client.name}</div>
                        <div className="text-xs text-gray-500">{client.email}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${client.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                      }`}>
                      {client.status === 'active' ? 'Activo' : 'Pendiente'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>{client.documents} documentos</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span>Progreso</span>
                        <span className="font-semibold">{client.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-xiomara-sky to-xiomara-pink rounded-full"
                          style={{ width: `${client.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Documents */}
          <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-xiomara-navy">Documentos Recientes</h3>
                  <p className="text-sm text-ink-500 mt-1">Últimas subidas</p>
                </div>
                <button className="text-sm font-semibold text-xiomara-sky hover:text-xiomara-pink transition-colors">
                  Ver todos →
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <FileText size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{doc.category}</div>
                        <div className="text-xs text-gray-500">{doc.client}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={doc.status} />
                      <div className="text-xs text-gray-500 mt-1">{doc.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Activity Feed */}
        <motion.div {...fadeIn} className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-xiomara-navy">Actividad Reciente</h3>
              <p className="text-sm text-ink-500 mt-1">Últimas acciones del sistema</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 h-9 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors">
              <Filter size={16} />
              Filtrar
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay actividad reciente
              </div>
            ) : (
              recentActivities.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  icon={activity.icon}
                  iconColor={activity.color}
                  title={activity.title}
                  description={activity.description}
                  time={activity.time}
                />
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, change, trend, icon: Icon, color, ...motionProps }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-amber-500 to-amber-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <motion.div
      {...motionProps}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-ink-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={16} className={trend === 'up' ? 'text-emerald-600' : 'text-rose-600'} />
            <span className={`text-sm font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {change}
            </span>
            <span className="text-xs text-ink-500 ml-1">vs mes anterior</span>
          </div>
        </div>
        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </motion.div>
  )
}

// Document Status Bar Component
function DocumentStatusBar({ label, count, total, color }) {
  const percentage = (count / total) * 100
  const colorClasses = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{count} ({percentage.toFixed(1)}%)</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Status Badge Component
function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-100 text-rose-700 border-rose-200',
  }

  const labels = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {status === 'approved' && <CheckCircle size={12} />}
      {status === 'rejected' && <XCircle size={12} />}
      {status === 'pending' && <Clock size={12} />}
      {labels[status]}
    </span>
  )
}

// Activity Item Component
function ActivityItem({ icon: Icon, iconColor, title, description, time }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-emerald-100 text-emerald-600',
    red: 'bg-rose-100 text-rose-600',
    yellow: 'bg-amber-100 text-amber-600',
  }

  return (
    <div className="flex items-start gap-4">
      <div className={`h-10 w-10 rounded-lg ${colorClasses[iconColor]} flex items-center justify-center shrink-0`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-0.5">{description}</p>
      </div>
      <span className="text-xs text-gray-500 shrink-0">{time}</span>
    </div>
  )
}
