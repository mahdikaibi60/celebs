import React from 'react';
import { Composition, AbsoluteFill } from 'remotion';

import { AnimatedNumber } from './components/AnimatedNumber';
import { AnimatedWord } from './components/AnimatedWord';
import { EffectsDirector } from './components/Effects';
import { GlassStatGrid } from './components/GlassStatGrid';
import { GlobalFinisher } from './components/GlobalFinisher';
import { KineticStack } from './components/KineticStack';
import { OrganicCamera } from './components/OrganicCamera';

export const AnimatedNumberShowcase = () => (
    <AbsoluteFill style={{ backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' }}>
        <AnimatedNumber numericValue={75} durationFrames={150} type="money" prefix="$" suffix="k" />
    </AbsoluteFill>
);

export const AnimatedWordShowcase = () => (
    <AbsoluteFill style={{ backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' }}>
        <AnimatedWord word="CRITICAL" globalIndex={0} durationFrames={150} category="Danger" />
    </AbsoluteFill>
);

export const EffectsShowcase = () => (
    <AbsoluteFill style={{ backgroundColor: '#111' }}>
        <EffectsDirector variants={['money']} events={[{ type: 'money', start: 0, end: 150 }]} />
        <div style={{ position: 'absolute', color: 'white', fontSize: 60, top: '50%', width: '100%', textAlign: 'center' }}>Effects Showcase</div>
    </AbsoluteFill>
);

export const GlassStatGridShowcase = () => (
    <AbsoluteFill style={{ backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', backgroundImage: 'url(https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200)', backgroundSize: 'cover' }}>
        <GlassStatGrid 
            start={10} 
            end={140} 
            stats={[
                { label: 'Velocity', value: 842, suffix: 'mph' },
                { label: 'Altitude', value: 12, suffix: 'k' },
                { label: 'G-Force', value: 3.2, suffix: 'g' }
            ]} 
        />
    </AbsoluteFill>
);

export const KineticStackShowcase = () => (
    <AbsoluteFill style={{ backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' }}>
        <KineticStack words={['MASSIVE', 'ENGINEERING', 'FAILURES']} side="left" layoutType="C" durationFrames={150} />
    </AbsoluteFill>
);

export const CameraAndFinisherShowcase = () => (
    <GlobalFinisher>
        <OrganicCamera seed="test-seed">
            <AbsoluteFill style={{ backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ color: 'white', fontSize: 120 }}>Handheld Drift + Finisher</h1>
            </AbsoluteFill>
        </OrganicCamera>
    </GlobalFinisher>
);

import { MagnatesStage_TwoPart, RedactedMemoEvidence, FinancialAuditGraphEvidence, BiometricWireframeEvidence } from './components/MagnatesStage_TwoPart';

export const ProceduralEvidenceShowcase = () => (
    <AbsoluteFill style={{ backgroundColor: '#020306', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 40, padding: 60 }}>
        <RedactedMemoEvidence accentColor="#D4AF37" width={680} height={520} />
        <FinancialAuditGraphEvidence accentColor="#D4AF37" width={680} height={520} />
        <BiometricWireframeEvidence accentColor="#D4AF37" width={680} height={520} />
    </AbsoluteFill>
);

export const MagnatesStage_TwoPartShowcase = () => {
    // REAL PRODUCTION SCENARIO: Gemini output with 1 single image for orbit_helpers
    const testPayload = {
        scene_type: 'two_part_whip',
        part_1: {
            hero: {
                trigger_start_ms: 300,
                local_path: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
            },
            orbit_helpers: {
                trigger_start_ms: 600,
                local_path: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400',
                count: 4,
            },
        },
        transition: {
            trigger_start_ms: 3000,
            direction: 'right',
        },
        part_2: {
            background: {
                grid_color: 'gold',
            },
            subject: {
                trigger_start_ms: 3200,
                position: 'left',
                local_path: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
            },
            typography: {
                trigger_start_ms: 3500,
                text: 'THE OBSIDIAN EMPIRE',
            },
        },
    };

    return <MagnatesStage_TwoPart payload={testPayload} durationInFrames={210} />;
};

export const ShowcaseRegistry = () => (
    <>
        <Composition id="Preview-ProceduralEvidence" component={ProceduralEvidenceShowcase} durationInFrames={120} fps={30} width={2560} height={1333} />
        <Composition id="Preview-MagnatesStage-TwoPart" component={MagnatesStage_TwoPartShowcase} durationInFrames={210} fps={30} width={2560} height={1333} />
        <Composition id="Preview-AnimatedNumber" component={AnimatedNumberShowcase} durationInFrames={150} fps={30} width={2560} height={1333} />
        <Composition id="Preview-AnimatedWord" component={AnimatedWordShowcase} durationInFrames={150} fps={30} width={2560} height={1333} />
        <Composition id="Preview-Effects" component={EffectsShowcase} durationInFrames={150} fps={30} width={2560} height={1333} />
        <Composition id="Preview-GlassStatGrid" component={GlassStatGridShowcase} durationInFrames={150} fps={30} width={2560} height={1333} />
        <Composition id="Preview-KineticStack" component={KineticStackShowcase} durationInFrames={150} fps={30} width={2560} height={1333} />
        <Composition id="Preview-OrganicCamera-GlobalFinisher" component={CameraAndFinisherShowcase} durationInFrames={150} fps={30} width={2560} height={1333} />
    </>
);
