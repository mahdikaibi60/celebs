import React, { useMemo } from 'react';
import { AbsoluteFill, useVideoConfig, Sequence, interpolate, useCurrentFrame, spring } from 'remotion';
import { AnimatedNumber } from './AnimatedNumber';
import { KineticStack } from './KineticStack';

const StandardCaption: React.FC<{ text: string }> = ({ text }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: 'clamp' });
    
    return (
        <div style={{
            position: 'absolute', 
            bottom: '8%', left: '50%', transform: 'translate(-50%, 0)', 
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
            justifyContent: 'center', width: '80%', gap: '15px',
            opacity: opacity,
            zIndex: 100
        }}>
            <span style={{
                display: 'inline-block',
                fontFamily: '"Geist Mono", "JetBrains Mono", monospace',
                fontSize: '48px',
                fontWeight: 600,
                color: '#FFFFFF',
                textShadow: '0px 2px 4px rgba(0,0,0,0.9), 0px 4px 15px rgba(0,0,0,0.8), 0px 0px 30px rgba(0,0,0,0.5)',
            }}>
                {text}
            </span>
        </div>
    );
};

const FocusCaption: React.FC<{ text: string, duration: number }> = ({ text, duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const scale = interpolate(frame, [0, duration], [0.95, 1.05]);
    
    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
            <div style={{ transform: `scale(${scale})` }}>
                <h1 style={{ 
                    fontFamily: '"Geist Mono", "JetBrains Mono", monospace', 
                    fontSize: '80px', 
                    color: 'white', 
                    textShadow: '0 10px 30px rgba(0,0,0,0.9)', 
                    textAlign: 'center', 
                    margin: 0,
                    maxWidth: '80%'
                }}>
                    {text}
                </h1>
            </div>
        </AbsoluteFill>
    );
};

export const CaptionDirector = ({ scene }: any) => {
    const { fps } = useVideoConfig();
    
    const typography = scene.typography || {};
    const style = typography.caption_style || 'standard';
    
    if (style === 'none') return null;
    
    const words = scene.words || [];
    const durationFrames = Math.max(1, Math.round(((scene.timing?.duration_ms || 3000) / 1000) * fps));
    const fullText = scene.voiceover_text || words.map((w:any) => w.word).join(" ");
    
    if (style === 'number') {
        const val = typography.target_value || 0;
        const prefix = typography.prefix || '';
        const suffix = typography.suffix || '';
        
        return (
            <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <AnimatedNumber 
                        numericValue={val}
                        durationFrames={durationFrames}
                        prefix={prefix}
                        suffix={suffix}
                    />
                </AbsoluteFill>
                {/* Standard caption below the number */}
                <StandardCaption text={fullText} />
            </AbsoluteFill>
        );
    }
    
    if (style === 'kinetic') {
        return (
            <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
                <KineticStack 
                    words={words.map((w: any) => w.word)}
                    durationFrames={durationFrames}
                />
            </AbsoluteFill>
        );
    }
    
    if (style === 'focus') {
        return <FocusCaption text={fullText} duration={durationFrames} />;
    }
    
    // Default: chunked standard captions
    // Break into chunks based on word timing
    const chunks = useMemo(() => {
        const res = [];
        let cur: any[] = [];
        for (let i = 0; i < words.length; i++) {
            cur.push(words[i]);
            if (cur.length >= 4 || /[.!?]/.test(words[i].word) || i === words.length - 1) {
                res.push({
                    text: cur.map(w => w.word).join(" "),
                    start_ms: cur[0].start_ms,
                    end_ms: cur[cur.length - 1].end_ms
                });
                cur = [];
            }
        }
        return res;
    }, [words]);
    
    return (
        <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
            {chunks.map((chunk, i) => {
                const sFrame = Math.max(0, Math.round(((chunk.start_ms - (scene.timing?.start_ms || 0)) / 1000) * fps));
                const dFrames = Math.max(1, Math.round(((chunk.end_ms - chunk.start_ms) / 1000) * fps) + 5);
                return (
                    <Sequence key={i} from={sFrame} durationInFrames={dFrames}>
                        <StandardCaption text={chunk.text} />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
