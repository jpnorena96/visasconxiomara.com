// src/components/CategoryChecklist.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

export default function CategoryChecklist({ uploaded = [] }) {
  const [cats, setCats] = useState([]);
  useEffect(() => { api.get('/api/v1/categories').then(setCats); }, []);
  const uploadedSet = new Set(uploaded.map(d => d.category));
  return (
    <ul className="grid sm:grid-cols-2 gap-2 text-sm">
      {cats.map(c => (
        <li key={c} className="surface p-3 flex items-center justify-between">
          <span>{c}</span>
          {uploadedSet.has(c)
            ? <span className="text-green-700 text-xs">Cargado</span>
            : <span className="text-amber-600 text-xs">Pendiente</span>}
        </li>
      ))}
    </ul>
  );
}
