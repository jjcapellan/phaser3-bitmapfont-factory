// Kernings used by arial font
const kerningPairs = [
  ' A', ' T', ' Y', '11', 'A ', 'AT', 'AV', 'AW', 'AY',
  'Av', 'Aw', 'Ay', 'F,', 'F.', 'FA', 'L ', 'LT', 'LV',
  'LW', 'LY', 'Ly', 'P ', 'P,', 'P.', 'PA', 'RT', 'RV',
  'RW', 'RY', 'T ', 'T,', 'T-', 'T.', 'T:', 'T;', 'TA',
  'TO', 'Ta', 'Tc', 'Te', 'Ti', 'To', 'Tr', 'Ts', 'Tu',
  'Tw', 'Ty', 'V,', 'V-', 'V.', 'V:', 'V;', 'VA', 'Va',
  'Ve', 'Vi', 'Vo', 'Vr', 'Vu', 'Vy', 'W,', 'W-', 'W.',
  'W:', 'W;', 'WA', 'Wa', 'We', 'Wi', 'Wo', 'Wr', 'Wu',
  'Wy', 'Y ', 'Y,', 'Y-', 'Y.', 'Y:', 'Y;', 'YA', 'Ya',
  'Ye', 'Yi', 'Yo', 'Yp', 'Yq', 'Yu', 'Yv', 'ff', 'r,',
  'r.', 'v,', 'v.', 'w,', 'w.', 'y,', 'y.'
];

// Default and common web-safe fonts by type

const sansSerif = [
  'Arial',
  'Calibri',
  'Helvetica',
  'Roboto',
  'Trebuchet MS',
  'Verdana'
]

const serif = [
  'Garamond',
  'Georgia',
  'serif',
  'Times',
  'Times New Roman'
]

const monospace = [
  'Consolas',
  'Courier',
  'Courier New',
  'monospace'
]

export { kerningPairs, sansSerif, serif, monospace }
