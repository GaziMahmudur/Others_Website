// App Theme Definitions
// Add or modify colors and themes here!

// Display Scale Definitions (UI Zooming for all components)
const DISPLAY_SCALES = {
    xxs: '0.8',
    xs:  '0.9',
    s:   '1.0', // Default
    l:   '1.1',
    xl:  '1.2',
    xxl: '1.3'
};

// Windows Standard Colors
const WINDOWS_COLORS = [
    { hex: '#FFB900', name: 'Yellow gold' }, { hex: '#FF8C00', name: 'Gold' }, { hex: '#F7630C', name: 'Orange bright' }, { hex: '#CA5010', name: 'Orange dark' }, { hex: '#DA3B01', name: 'Rust' },
    { hex: '#EF6950', name: 'Pale rust' }, { hex: '#D13438', name: 'Brick red' }, { hex: '#FF4343', name: 'Mod red' }, { hex: '#E74856', name: 'Pale red' }, { hex: '#E81123', name: 'Red' },
    { hex: '#EA005E', name: 'Rose bright' }, { hex: '#C30052', name: 'Rose' }, { hex: '#E3008C', name: 'Plum light' }, { hex: '#BF0077', name: 'Plum' }, { hex: '#C239B3', name: 'Orchid light' },
    { hex: '#9A0089', name: 'Orchid' }, { hex: '#0866FF', name: 'Default blue' }, { hex: '#0063B1', name: 'Navy blue' }, { hex: '#8E8CD8', name: 'Purple shadow' }, { hex: '#6B69D6', name: 'Purple shadow dark' },
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
        '--background-color': '#F2F4F7',
        '--surface-color': '#FFFFFF',
        '--surface-border': 'rgba(208, 211, 215, 1)',
        '--text-main': '#080809',
        '--text-muted': '#65686C',
        '--secondary-color': '#0866FF',
        '--avatar-text-color': '#FFFFFF',
        '--input-bg': '#F0F2F5',
        '--success-color': '#24832C',
        '--danger-color': '#DD2334',
        '--shadow-sm': '0 2px 6px rgba(0,0,0,0.08)',
        '--shadow-md': '0 8px 20px rgba(0,0,0,0.12)',
        '--shadow-lg': '0 18px 48px rgba(0,0,0,0.18)',
        '--shadow-fluent': '0px 4px 10px rgba(0,0,0,0.08)',
        '--btn-color': '#080809',
        '--btn-background': '#E2E5E9',
        '--btn-border': '1px solid rgba(255, 255, 255, 0.4)'
    },

    pc_dark: {
        '--background-color': '#1C1C1D',
        '--surface-color': '#252728',
        '--surface-border': 'rgba(57, 58, 59, 1)',
        '--text-main': '#e2e5e9',
        '--text-muted': '#b0b3b8',
        '--secondary-color': '#0866ff',
        '--avatar-text-color': '#FFFFFF',
        '--input-bg': '#333334',
        '--success-color': '#3fbb46',
        '--danger-color': '#DD2334',
        '--shadow-sm': '0 2px 8px rgba(0,0,0,0.5)',
        '--shadow-md': '0 10px 30px rgba(0,0,0,0.6)',
        '--shadow-lg': '0 20px 60px rgba(0,0,0,0.7)',
        '--shadow-fluent': '0px 6px 18px rgba(0,0,0,0.5)',
        '--btn-color': '#E2E5E9',
        '--btn-background': 'rgb(255 255 255 / 10%)',
        '--btn-border': '1px solid rgba(0, 0, 0, 0.4)'
    },

    phone_light: {
        '--background-color': '#F2F4F7',
        '--surface-color': '#FFFFFF',
        '--surface-border': '#D0D3D7',
        '--text-main': '#080809',
        '--text-muted': '#65686C',
        '--secondary-color': '#0866FF',
        '--avatar-text-color': '#FFFFFF',
        '--input-bg': '#F0F2F5',
        '--success-color': '#24832C',
        '--danger-color': '#DD2334',
        '--shadow-sm': '0 2px 6px rgba(0,0,0,0.08)',
        '--shadow-md': '0 8px 20px rgba(0,0,0,0.12)',
        '--shadow-lg': '0 18px 48px rgba(0,0,0,0.18)',
        '--shadow-fluent': '0px 4px 10px rgba(0,0,0,0.08)',
        '--btn-color': '#080809',
        '--btn-background': '#E2E5E9',
        '--btn-border': '1px solid rgba(255, 255, 255, 0.4)'
    },

    phone_dark: {
        '--background-color': '#000000ff',
        '--surface-color': '#101010ff',
        '--surface-border': 'rgba(35, 35, 35, 1)',
        '--text-main': '#ffffffff',
        '--text-muted': '#b0b3b8',
        '--secondary-color': '#0866ff',
        '--avatar-text-color': '#FFFFFF',
        '--input-bg': '#202020',
        '--success-color': '#3fbb46',
        '--danger-color': '#DD2334',
        '--shadow-sm': '0 2px 8px rgba(0,0,0,0.5)',
        '--shadow-md': '0 10px 30px rgba(0,0,0,0.6)',
        '--shadow-lg': '0 20px 60px rgba(0,0,0,0.7)',
        '--shadow-fluent': '0px 6px 18px rgba(0,0,0,0.5)',
        '--btn-color': '#ffffff',
        '--btn-background': 'rgb(255 255 255 / 10%)',
        '--btn-border': '1px solid rgba(0, 0, 0, 0.4)'
    }
}