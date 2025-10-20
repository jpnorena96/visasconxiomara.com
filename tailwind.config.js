/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // >>> INICIO: AGREGAR DEFINICIONES DE ANIMACIÓN <<<
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        // Duración de 1.5s para el fondo
        fadeIn: 'fadeIn 1.5s ease-out forwards', 
        // Duración de 0.8s para los elementos de contenido
        slideInUp: 'slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards', 
      },
      // >>> FIN: AGREGAR DEFINICIONES DE ANIMACIÓN <<<
      colors: {
        brand: {
          50:'#eef6ff',100:'#d9e9ff',200:'#b7d6ff',300:'#89bbff',400:'#5799ff',
          500:'#2d79ff',600:'#1f5de6',700:'#1a49b4',800:'#163e8f',900:'#143876'
        },
        ink: {
          50:'#f9fafb',100:'#f3f4f6',200:'#e5e7eb',300:'#d1d5db',400:'#9ca3af',
          500:'#6b7280',600:'#4b5563',700:'#374151',800:'#1f2937',900:'#111827'
        },
        accent: {
          50:'#eef9ff',100:'#d5f1ff',200:'#aee3ff',300:'#78ceff',400:'#3eb3ff',
          500:'#1899ff',600:'#007be0',700:'#0063b4',800:'#004b8b',900:'#003968'
        },
        xiomara: {
          pink:'#e70c7b', pink2:'#ff2ea2', navy:'#1b2a4a', sky:'#2d79ff'
        }
      },
      spacing: { '18':'4.5rem' },
      boxShadow: {
        subtle:'0 6px 24px -10px rgba(0,0,0,0.1)',
        glow:'0 12px 40px -12px rgba(45,121,255,0.35)',
        xlsoft:'0 20px 60px -20px rgba(0,0,0,0.25)'
      },
      borderRadius: { '2xl':'1.25rem' },
      backgroundImage: {
        'xiomara-gradient':'linear-gradient(90deg, #e70c7b 0%, #2d79ff 100%)',
        'radial-brand':'radial-gradient(80% 60% at 50% -10%, rgba(45,121,255,0.18), rgba(255,255,255,0))'
      },
      fontFamily: { sans: ['Plus Jakarta Sans','ui-sans-serif','system-ui'] }
    }
  },
  plugins:[]
}