export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    fontFamily: { display: ['"Bricolage Grotesque"', 'sans-serif'], sans: ['"IBM Plex Sans"', 'sans-serif'], mono: ['"IBM Plex Mono"', 'monospace'] },
    colors: { ink: '#0B1220', sun: '#FACC15', sig: '#2563EB', live: '#DC2626', paper: '#F5F7FA' },
  } },
};
