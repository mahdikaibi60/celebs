import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';
import { HeroType } from './HeroDetector';
import { SmartAudio } from './SmartAudio';
import { useDynamicSfx } from './useDynamicSfx';

interface Props {
    numericValue: number;
    type: HeroType;
    durationFrames: number;
    globalIndex: number;
}

export const AnimatedNumber: React.FC<Props> = ({ numericValue, type, durationFrames, globalIndex }) => {
    const frame = useCurrentFrame();

    const sfxPath = useDynamicSfx(type, globalIndex);

    // Clean, linear data interpolation. No springs.
    const currentValue = interpolate(
        frame,
        [0, Math.min(15, durationFrames)], // animate over 15 frames max
        [0, numericValue],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
        }
    );

    const formatValue = (num: number) => {
        if (type === 'year') return { display: Math.floor(num).toString(), suffix: "" };
        
        let display = "";
        let suffix = "";
        
        if (numericValue >= 1e9) {
            display = (num / 1e9).toFixed(1).replace(/\.0$/, '');
            suffix = "B";
        } else if (numericValue >= 1e6) {
            display = (num / 1e6).toFixed(1).replace(/\.0$/, '');
            suffix = "M";
        } else if (numericValue >= 1000) {
            display = (num / 1000).toFixed(1).replace(/\.0$/, '');
            suffix = "K";
        } else {
            display = (numericValue % 1 !== 0) ? num.toFixed(1) : Math.floor(num).toString();
        }

        if (type === 'percent') suffix = "%";
        else if (type === 'hp') suffix = " HP";
        else if (type === 'duration') suffix = " Seconds";

        return { display, suffix };
    };

    const { display, suffix } = formatValue(currentValue);
    const prefix = type === 'money' ? '$' : '';

    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', zIndex: 200, pointerEvents: 'none' }}>
            {sfxPath && <SmartAudio src={sfxPath} durationFrames={durationFrames} />}
            <div
                style={{
                    fontFamily: "'Geist Mono', 'JetBrains Mono', 'Roboto Mono', monospace",
                    fontSize: "80px",
                    color: "#ffffff",
                    fontWeight: "bold",
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    justifyContent: 'center',
                    width: '100%',
                    textShadow: '0 4px 10px rgba(0,0,0,0.8)'
                }}
            >
                {prefix && <span style={{ marginRight: '5px' }}>{prefix}</span>}
                <span>{display}</span>
                {suffix && <span style={{ marginLeft: suffix === '%' ? '0' : '15px' }}>{suffix}</span>}
            </div>
        </AbsoluteFill>
    );
};
