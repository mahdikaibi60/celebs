import { AbsoluteFill, useCurrentFrame } from 'remotion';
import React from 'react';

export const TypographyRouter = ({ textData }: any) => {
  if (!textData || !textData.type || !textData.content) return null;
  const type = textData.type.toLowerCase();
  const content = textData.content;

  let color = '#FFFFFF';
  let fontStyle = 'normal';
  
  if (type === 'quote') {
    fontStyle = 'italic';
    color = '#D4AF37'; // Muted gold/amber
  } else if (type === 'warning' || type.includes('highlight') || type === 'fact card') {
    color = '#00FF41'; // Cyber-green
  } else if (type.includes('number') || type.includes('price')) {
    color = '#5CFF7A';
  }

  return (
    <AbsoluteFill style={{ zIndex: 50, pointerEvents: 'none', justifyContent: 'center', alignItems: 'center' }}>
      <style>
         {`@import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;600;700&display=swap');`}
      </style>
      <div style={{
        width: '80%', textAlign: 'center'
      }}>
         <h1 style={{ 
            color: color, 
            fontFamily: '"Geist Mono", "JetBrains Mono", monospace', 
            fontSize: '70px', 
            fontStyle: fontStyle, 
            textShadow: '0 4px 15px rgba(0,0,0,0.8)', 
            margin: 0,
            fontWeight: 600,
            lineHeight: 1.2
        }}>
            {type === 'quote' ? `"${content}"` : content}
         </h1>
      </div>
    </AbsoluteFill>
  );
};
