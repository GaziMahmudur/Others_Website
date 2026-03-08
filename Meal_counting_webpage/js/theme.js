// App Theme Definitions
// Add or modify colors and themes here!

// Text Size Definitions
const TEXT_SIZES = {
    xxs: '12px',
    xs: '13px',
    s: '14px', // Default
    l: '15px',
    xl: '16px',
    xxl: '18px'
};

// Windows Standard Colors
const WINDOWS_COLORS = [
    { hex: '#FFB900', name: 'Yellow gold' }, { hex: '#FF8C00', name: 'Gold' }, { hex: '#F7630C', name: 'Orange bright' }, { hex: '#CA5010', name: 'Orange dark' }, { hex: '#DA3B01', name: 'Rust' },
    { hex: '#EF6950', name: 'Pale rust' }, { hex: '#D13438', name: 'Brick red' }, { hex: '#FF4343', name: 'Mod red' }, { hex: '#E74856', name: 'Pale red' }, { hex: '#E81123', name: 'Red' },
    { hex: '#EA005E', name: 'Rose bright' }, { hex: '#C30052', name: 'Rose' }, { hex: '#E3008C', name: 'Plum light' }, { hex: '#BF0077', name: 'Plum' }, { hex: '#C239B3', name: 'Orchid light' },
    { hex: '#9A0089', name: 'Orchid' }, { hex: '#0078D7', name: 'Default blue' }, { hex: '#0063B1', name: 'Navy blue' }, { hex: '#8E8CD8', name: 'Purple shadow' }, { hex: '#6B69D6', name: 'Purple shadow dark' },
    { hex: '#8764B8', name: 'Iris pastel' }, { hex: '#744DA9', name: 'Iris spring' }, { hex: '#B146C2', name: 'Violet red light' }, { hex: '#881798', name: 'Violet red' }, { hex: '#0099BC', name: 'Cool blue bright' },
    { hex: '#2D7D9A', name: 'Cool blue' }, { hex: '#00B7C3', name: 'Seafoam' }, { hex: '#038387', name: 'Seafoam teal' }, { hex: '#00B294', name: 'Mint light' }, { hex: '#018574', name: 'Mint dark' },
    { hex: '#00CC6A', name: 'Turf green' }, { hex: '#10893E', name: 'Sport green' }, { hex: '#7A7574', name: 'Gray' }, { hex: '#5D5A58', name: 'Gray brown' }, { hex: '#68768A', name: 'Steel blue' },
    { hex: '#515C6B', name: 'Metal blue' }, { hex: '#567C73', name: 'Pale moss' }, { hex: '#486860', name: 'Moss' }, { hex: '#498205', name: 'Meadow green' }, { hex: '#107C10', name: 'Green' },
    { hex: '#767676', name: 'Overcast' }, { hex: '#4C4A48', name: 'Storm' }, { hex: '#69797E', name: 'Blue gray' }, { hex: '#4A5459', name: 'Gray dark' }, { hex: '#647C64', name: 'Liddy green' },
    { hex: '#525E54', name: 'Sage' }, { hex: '#847545', name: 'Camouflage desert' }, { hex: '#7E735F', name: 'Camouflage' }
];

// Base Themes
const BASE_THEMES = {
    // PC Themes
    pc_light: {
        '--background-color': '#FFFFFF',
        '--surface-color': '#f0f0f0',
        '--surface-border': 'rgba(0, 0, 0, 0.1)',
        '--text-main': '#0d0d0d',
        '--text-muted': '#6b7280',
        '--secondary-color': '#6366F1',
        '--avatar-text-color': '#FFFFFF',
        '--input-bg': '#FFFFFF',
        '--success-color': '#16a34a', // Vibrant Green 600
        '--danger-color': '#dc2626',   // Vibrant Red 600
    },
    pc_dark: {
        '--background-color': '#121212', // Slightly lighter than pure black for depth
        '--surface-color': '#1e1e1e',    // standard dark surface
        '--surface-border': 'rgba(255, 255, 255, 0.1)',
        '--text-main': '#ffffff',
        '--text-muted': '#a0a0a0',
        '--secondary-color': '#6366F1',
        '--avatar-text-color': '#0F0F10',
        '--input-bg': '#2c2c2c',
        '--success-color': '#4ade80', // Vibrant Green 400 (Pops on dark)
        '--danger-color': '#f87171',   // Vibrant Red 400
    },
    // Phone Themes
    phone_light: {
        '--background-color': '#FFFFFF',
        '--surface-color': '#F2F2F7', // iOS Grouped BG
        '--surface-border': 'rgba(0, 0, 0, 0.1)',
        '--text-main': '#000000',
        '--text-muted': '#6b7280',
        '--secondary-color': '#6366F1',
        '--avatar-text-color': '#FFFFFF',
        '--input-bg': '#FFFFFF',
        '--success-color': '#16a34a',
        '--danger-color': '#dc2626',
    },
    phone_dark: {
        '--background-color': '#000000',
        '--surface-color': '#1c1c1e', // iOS Dark Surface
        '--surface-border': 'rgba(255, 255, 255, 0.15)',
        '--text-main': '#ffffff',
        '--text-muted': '#98989d',
        '--secondary-color': '#6366F1',
        '--avatar-text-color': '#0D0D0E',
        '--input-bg': '#1c1c1e',
        '--success-color': '#4ade80',
        '--danger-color': '#f87171',
    }
};
