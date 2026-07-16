import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

export const KineticStack: React.FC<{
    words: string[];
    side: 'left' | 'right'; // kept for prop compatibility but unused visually
    layoutType: 'A' | 'B' | 'C';
    durationFrames: number;
}> = ({ words, layoutType }) => {
    const frame = useCurrentFrame();

    // Group words into lines based on layout
    const lines: { text: string, globalIndex: number }[][] = [];

    if (layoutType === 'A') {
        for (let i = 0; i < words.length; i++) {
            lines.push([{ text: words[i], globalIndex: i }]);
        }
    } else if (layoutType === 'B') {
        for (let i = 0; i < words.length; i += 2) {
            const line = [{ text: words[i], globalIndex: i }];
            if (i + 1 < words.length) {
                line.push({ text: words[i + 1], globalIndex: i + 1 });
            }
            lines.push(line);
        }
    } else if (layoutType === 'C') {
        if (words.length > 0) lines.push([{ text: words[0], globalIndex: 0 }]);
        if (words.length > 1) {
            const line2 = [{ text: words[1], globalIndex: 1 }];
            if (words.length > 2) line2.push({ text: words[2], globalIndex: 2 });
            lines.push(line2);
        }
        if (words.length > 3) lines.push([{ text: words[3], globalIndex: 3 }]);
        if (words.length > 4) lines.push([{ text: words[4], globalIndex: 4 }]);
    }

    const fontSize = 60;

    return (
        <AbsoluteFill style={{
            justifyContent: 'center',
            alignItems: 'center', // Locked to dead center
            zIndex: 100
        }}>
            <style>
               {`@import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@600&display=swap');`}
            </style>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', textAlign: 'center' }}>
                {lines.map((line, lineIndex) => (
                    <div key={lineIndex} style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
                        {line.map((w) => {
                            const delay = w.globalIndex * 3; // 3 frames offset
                            const startFrame = delay;
                            
                            const opacity = interpolate(frame - startFrame, [0, 5], [0, 1], {
                                extrapolateLeft: 'clamp',
                                extrapolateRight: 'clamp',
                                easing: Easing.out(Easing.cubic)
                            });

                            return (
                                <span key={w.globalIndex} style={{
                                    fontFamily: '"Geist Mono", "JetBrains Mono", monospace',
                                    fontSize: `${fontSize}px`,
                                    color: 'white',
                                    textShadow: '0 4px 10px rgba(0,0,0,0.8)',
                                    opacity: opacity,
                                    lineHeight: '1.1',
                                    display: 'inline-block' 
                                }}>
                                    {w.text}
                                </span>
                            );
                        })}
                    </div>
                ))}
            </div>
        </AbsoluteFill>
    );
};
