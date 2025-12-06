import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Check, XCircle, Download, Loader2, MessageSquare, Eye } from 'lucide-react';
import { api } from '../../utils/api';
import { toast } from 'sonner';

export default function ClientDocumentsModal({ client, isOpen, onClose }) {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        if (isOpen && client) {
            loadDocs();
        }
    }, [isOpen, client]);

    const loadDocs = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/api/v1/admin/customers/${client.id}/documents`);
            setDocs(data);
        } catch (error) {
            console.error(error);
            toast.error("Error cargando documentos");
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (docId, status, notes = "") => {
        setProcessingId(docId);
        try {
            await api.put(`/api/v1/admin/documents/${docId}`, { status, admin_notes: notes });
            toast.success(`Documento ${status === 'approved' ? 'aprobado' : 'rechazado'}`);

            // Update local state
            setDocs(prev => prev.map(d => d.id === docId ? { ...d, status, admin_notes: notes } : d));
        } catch (error) {
            toast.error("Error actualizando estado");
        } finally {
            setProcessingId(null);
        }
    };

    const viewDoc = async (doc) => {
        try {
            const token = api.token;
            const response = await fetch(`${api.baseUrl}/api/v1/admin/documents/${doc.id}/download`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Error loading file");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (e) {
            console.error(e);
            toast.error("No se pudo abrir el documento");
        }
    }

    const downloadDoc = async (doc) => {
        try {
            const token = api.token;
            const response = await fetch(`${api.baseUrl}/api/v1/admin/documents/${doc.id}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Download failed");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', doc.original_name);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            console.error(e);
            toast.error("Error descargando");
        }
    }

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Documentos de {client.name}</h2>
                            <p className="text-sm text-gray-500">{client.email}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="animate-spin text-xiomara-sky" size={32} />
                            </div>
                        ) : docs.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No hay documentos subidos.
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {docs.map(doc => (
                                    <div key={doc.id} className="border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => viewDoc(doc)}>
                                            <div className="h-12 w-12 rounded-lg bg-blue-50 grid place-items-center shrink-0 group-hover:bg-blue-100 transition-colors">
                                                <FileText className="text-blue-500" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{doc.category}</h4>
                                                <p className="text-sm text-gray-500">{doc.original_name}</p>
                                                {doc.family_member_name && (
                                                    <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                                        {doc.family_member_name}
                                                    </span>
                                                )}
                                                {doc.admin_notes && (
                                                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                                                        <MessageSquare size={10} /> {doc.admin_notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            {/* Status Badge */}
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${doc.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                doc.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                    'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                {doc.status === 'approved' ? 'Aprobado' : doc.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                                            </span>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 ml-2">
                                                <button
                                                    onClick={() => viewDoc(doc)}
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                                    title="Ver / Visualizar"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => downloadDoc(doc)}
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                                    title="Descargar"
                                                >
                                                    <Download size={18} />
                                                </button>

                                                {doc.status !== 'approved' && (
                                                    <button
                                                        onClick={() => handleReview(doc.id, 'approved')}
                                                        disabled={processingId === doc.id}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-50"
                                                        title="Aprobar"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}

                                                {doc.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => {
                                                            const reason = prompt("Motivo del rechazo:");
                                                            if (reason) handleReview(doc.id, 'rejected', reason);
                                                        }}
                                                        disabled={processingId === doc.id}
                                                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg disabled:opacity-50"
                                                        title="Rechazar"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
