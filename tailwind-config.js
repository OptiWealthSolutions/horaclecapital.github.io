tailwind.config = {
  theme: {
    extend: {
      colors: {
        /* Light surfaces */
        bg:       '#FFFFFF',
        'bg-2':   '#F7F9FC',
        'bg-3':   '#EEF2F9',
        /* Dark surfaces */
        dark:     '#0F172A',
        'dark-2': '#1C2236',
        'dark-3': '#243044',
        /* Text */
        text:     '#0F172A',
        off:      '#475569',
        dim:      '#94A3B8',
        /* Borders */
        border:   '#E2E8F0',
        'border-2': '#CBD5E1',
        'border-dk': '#1E2D45',
        /* Blue accent — maps all "orange" refs to blue */
        orange:   '#2563EB',
        'orange-d': 'rgba(37,99,235,0.07)',
        blue:     '#1E40AF',
        'blue-2': '#2563EB',
        'blue-3': '#60A5FA',
        'blue-d': 'rgba(37,99,235,0.07)',
        /* Keep white */
        white:    '#FFFFFF',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['DM Sans', 'sans-serif'],
        head: ['DM Serif Display', 'serif'],
      }
    }
  }
}
