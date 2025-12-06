import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Download, Calendar, TrendingUp, Users, FileText, DollarSign,
    BarChart3, PieChart, Activity, Filter, ArrowUp, ArrowDown,
    CheckCircle, XCircle, Clock, Globe, Briefcase, GraduationCap
} from 'lucide-react'

import { api } from '../../utils/api'

export default function Reports() {
    const [dateRange, setDateRange] = useState('month')
    const [loading, setLoading] = useState(true)

    const [stats, setStats] = useState({
        totalClients: 0,
        newClients: 0,
        activeApplications: 0,
        completedApplications: 0,
        revenue: 0,
        avgProcessingTime: 0,
        approvalRate: 0,
        documentsPending: 0,
        documentsApproved: 0,
        documentsRejected: 0
    })

    const [monthlyData, setMonthlyData] = useState([])
    const [visaTypeDistribution, setVisaTypeDistribution] = useState([])
    const [countryDistribution, setCountryDistribution] = useState([])
    const [topPerformers, setTopPerformers] = useState([])

    React.useEffect(() => {
        loadReportsData()
    }, [])

    const loadReportsData = async () => {
        setLoading(true)
        try {
            const clients = await api.clients.getAll()
            const documents = await api.documents.getAllAdmin()

            // 1. Stats
            const totalClients = clients.length
            const activeApps = clients.filter(c => c.status === 'active').length
            const completedApps = clients.filter(c => c.status === 'completed').length
            const pendingDocs = documents.filter(d => d.status === 'pending').length
            const approvedDocs = documents.filter(d => d.status === 'approved').length
            const rejectedDocs = documents.filter(d => d.status === 'rejected').length

            const familiesCount = clients.filter(c => c.application_type === 'family').length

            // Revenue estimation (e.g. $1200 per client)
            const revenue = totalClients * 1200

            setStats({
                totalClients,
                familiesCount,
                newClients: clients.filter(c => {
                    const date = c.created_at ? new Date(c.created_at) : new Date()
                    return date > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }).length,
                activeApplications: activeApps,
                completedApplications: completedApps,
                revenue,
                avgProcessingTime: 15, // Estimado
                approvalRate: totalClients > 0 ? ((completedApps / totalClients) * 100).toFixed(1) : 0,
                documentsPending: pendingDocs,
                documentsApproved: approvedDocs,
                documentsRejected: rejectedDocs
            })

            // 2. Monthly Data (last 6 months)
            const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
            const currentMonth = new Date().getMonth()
            const last6Months = []
            for (let i = 5; i >= 0; i--) {
                const d = new Date()
                d.setMonth(currentMonth - i)
                const monthIdx = d.getMonth()
                const monthName = months[monthIdx]
                const year = d.getFullYear()

                const clientsInMonth = clients.filter(c => {
                    const cd = c.created_at ? new Date(c.created_at) : new Date()
                    return cd.getMonth() === monthIdx && cd.getFullYear() === year
                }).length

                last6Months.push({
                    month: monthName,
                    clients: clientsInMonth,
                    revenue: clientsInMonth * 1200,
                    applications: clientsInMonth
                })
            }
            setMonthlyData(last6Months)

            // 3. Visa Type Distribution
            const visaTypes = {}
            clients.forEach(c => {
                const type = c.visa_type || 'Otros'
                visaTypes[type] = (visaTypes[type] || 0) + 1
            })

            const visaDist = Object.entries(visaTypes).map(([type, count], index) => ({
                type,
                count,
                percentage: ((count / totalClients) * 100).toFixed(1),
                color: ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-gray-500'][index % 5]
            })).sort((a, b) => b.count - a.count)
            setVisaTypeDistribution(visaDist)

            // 4. Country Distribution
            const countries = {}
            clients.forEach(c => {
                const country = c.destination_country || 'Otros'
                countries[country] = (countries[country] || 0) + 1
            })

            const countryDist = Object.entries(countries).map(([country, count]) => ({
                country,
                count,
                flag: getFlag(country)
            })).sort((a, b) => b.count - a.count).slice(0, 5)
            setCountryDistribution(countryDist)

            // 5. Top Performers
            const performers = clients
                .sort((a, b) => (b.progress || 0) - (a.progress || 0))
                .slice(0, 5)
                .map(c => ({
                    name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Cliente',
                    applications: 1,
                    approval: c.progress || 0,
                    revenue: 1200
                }))
            setTopPerformers(performers)

        } catch (error) {
            console.error('Error loading reports:', error)
        } finally {
            setLoading(false)
        }
    }

    const getFlag = (country) => {
        const map = {
            'Estados Unidos': '🇺🇸', 'USA': '🇺🇸', 'EEUU': '🇺🇸',
            'Canadá': '🇨🇦', 'Canada': '🇨🇦',
            'España': '🇪🇸', 'Spain': '🇪🇸',
            'Reino Unido': '🇬🇧', 'UK': '🇬🇧',
            'Australia': '🇦🇺',
            'Colombia': '🇨🇴',
            'México': '🇲🇽',
        }
        return map[country] || '🌍'
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
                            <h1 className="text-3xl font-bold text-xiomara-navy">Reportes y Analytics</h1>
                            <p className="text-ink-600 mt-1">Análisis detallado del rendimiento del negocio</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="px-4 h-10 rounded-xl border-2 border-gray-200 focus:border-xiomara-sky focus:outline-none transition-all"
                            >
                                <option value="week">Última semana</option>
                                <option value="month">Último mes</option>
                                <option value="quarter">Último trimestre</option>
                                <option value="year">Último año</option>
                            </select>
                            <button className="inline-flex items-center gap-2 px-6 h-10 rounded-xl bg-gradient-to-r from-xiomara-sky to-xiomara-pink text-white font-semibold hover:shadow-lg transition-all">
                                <Download size={18} />
                                Exportar PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Total Clientes"
                        value={stats.totalClients}
                        change="+18.2%"
                        trend="up"
                        icon={Users}
                        color="blue"
                        {...fadeIn}
                    />
                    <MetricCard
                        title="Grupos Familiares"
                        value={stats.familiesCount || 0}
                        change="+12.5%"
                        trend="up"
                        icon={Users}
                        color="purple"
                        {...fadeIn}
                    />
                    <MetricCard
                        title="Ingresos Totales"
                        value={`$${stats.revenue.toLocaleString()}`}
                        change="+24.3%"
                        trend="up"
                        icon={DollarSign}
                        color="green"
                        {...fadeIn}
                    />
                    <MetricCard
                        title="Tasa de Aprobación"
                        value={`${stats.approvalRate}%`}
                        change="+3.1%"
                        trend="up"
                        icon={CheckCircle}
                        color="emerald"
                        {...fadeIn}
                    />
                </div>

                {/* Charts Row */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Monthly Trend */}
                    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-xiomara-navy">Tendencia Mensual</h3>
                                <p className="text-sm text-ink-500 mt-1">Clientes y aplicaciones por mes</p>
                            </div>
                            <BarChart3 size={24} className="text-xiomara-sky" />
                        </div>

                        <div className="space-y-3">
                            {monthlyData.map((data, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-12 text-sm font-semibold text-gray-700">{data.month}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-600">Clientes</span>
                                            <span className="text-xs font-semibold text-gray-900">{data.clients}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-xiomara-sky to-xiomara-pink rounded-full"
                                                style={{ width: `${(data.clients / 70) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-24 text-right">
                                        <div className="text-xs text-gray-600">Ingresos</div>
                                        <div className="text-sm font-bold text-emerald-600">${(data.revenue / 1000).toFixed(1)}k</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Visa Type Distribution */}
                    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-xiomara-navy">Distribución por Tipo de Visa</h3>
                                <p className="text-sm text-ink-500 mt-1">Categorías más solicitadas</p>
                            </div>
                            <PieChart size={24} className="text-xiomara-pink" />
                        </div>

                        <div className="space-y-3">
                            {visaTypeDistribution.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">{item.type}</span>
                                            <span className="text-sm font-bold text-gray-900">{item.count}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.color} rounded-full`}
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-16 text-right text-sm font-semibold text-gray-600">
                                        {item.percentage}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Additional Stats */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Country Distribution */}
                    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-xiomara-navy">Países Destino</h3>
                                <p className="text-sm text-ink-500 mt-1">Top destinos</p>
                            </div>
                            <Globe size={24} className="text-blue-500" />
                        </div>

                        <div className="space-y-3">
                            {countryDistribution.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{item.flag}</span>
                                        <span className="font-medium text-gray-900">{item.country}</span>
                                    </div>
                                    <span className="text-lg font-bold text-xiomara-sky">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Processing Time */}
                    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-xiomara-navy">Tiempo de Procesamiento</h3>
                                <p className="text-sm text-ink-500 mt-1">Métricas de eficiencia</p>
                            </div>
                            <Clock size={24} className="text-amber-500" />
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                                <div className="text-sm text-blue-700 mb-1">Tiempo Promedio</div>
                                <div className="text-3xl font-bold text-blue-900">{stats.avgProcessingTime} días</div>
                                <div className="text-xs text-blue-600 mt-1">-2.3 días vs mes anterior</div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-emerald-50 rounded-xl">
                                    <div className="text-xs text-emerald-700">Más Rápido</div>
                                    <div className="text-xl font-bold text-emerald-900">7 días</div>
                                </div>
                                <div className="p-3 bg-rose-50 rounded-xl">
                                    <div className="text-xs text-rose-700">Más Lento</div>
                                    <div className="text-xl font-bold text-rose-900">21 días</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Document Status */}
                    <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-xiomara-navy">Estado de Documentos</h3>
                                <p className="text-sm text-ink-500 mt-1">Resumen actual</p>
                            </div>
                            <FileText size={24} className="text-purple-500" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={20} className="text-emerald-600" />
                                    <span className="font-medium text-emerald-900">Aprobados</span>
                                </div>
                                <span className="text-xl font-bold text-emerald-600">{stats.documentsApproved}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Clock size={20} className="text-amber-600" />
                                    <span className="font-medium text-amber-900">Pendientes</span>
                                </div>
                                <span className="text-xl font-bold text-amber-600">{stats.documentsPending}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <XCircle size={20} className="text-rose-600" />
                                    <span className="font-medium text-rose-900">Rechazados</span>
                                </div>
                                <span className="text-xl font-bold text-rose-600">{stats.documentsRejected}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Top Performers */}
                <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-xiomara-navy">Mejores Clientes</h3>
                                <p className="text-sm text-ink-500 mt-1">Top performers del período</p>
                            </div>
                            <Activity size={24} className="text-xiomara-sky" />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ranking</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Aplicaciones</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tasa Aprobación</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Ingresos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {topPerformers.map((performer, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                                                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                                                    'bg-gradient-to-br from-orange-400 to-orange-600'
                                                }`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-xiomara-sky to-xiomara-pink flex items-center justify-center text-white font-bold">
                                                    {performer.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-gray-900">{performer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-900">{performer.applications}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 max-w-[100px]">
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                                                            style={{ width: `${performer.approval}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-emerald-600">{performer.approval}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-xiomara-sky">${performer.revenue.toLocaleString()}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

// Metric Card Component
function MetricCard({ title, value, change, trend, icon: Icon, color, ...motionProps }) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        green: 'from-green-500 to-green-600',
        emerald: 'from-emerald-500 to-emerald-600',
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
                        {trend === 'up' ? (
                            <ArrowUp size={16} className="text-emerald-600" />
                        ) : (
                            <ArrowDown size={16} className="text-rose-600" />
                        )}
                        <span className={`text-sm font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {change}
                        </span>
                        <span className="text-xs text-ink-500 ml-1">vs período anterior</span>
                    </div>
                </div>
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shrink-0`}>
                    <Icon size={28} className="text-white" />
                </div>
            </div>
        </motion.div>
    )
}
