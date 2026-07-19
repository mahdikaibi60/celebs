import { AbsoluteFill, useCurrentFrame, staticFile as remotionStaticFile, OffthreadVideo, Img, interpolate, spring, useVideoConfig } from 'remotion';
import React from 'react';
import { VolumetricDust, FilmGrain } from './Effects';

const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const staticFile = (path: string) => {
    if (!path || typeof path !== 'string') return TRANSPARENT_PIXEL;
    const cleanPath = path.startsWith('public/') ? path.slice(7) : path;
    if (cleanPath.trim() === '' || cleanPath.endsWith('/')) return TRANSPARENT_PIXEL;
    return remotionStaticFile(cleanPath);
};

export const SmartMedia: React.FC<{ src: string, style?: any }> = ({ src, style }) => {
  if (!src) return null;
  const isVideo = src.toLowerCase().endsWith('.mp4');
  return isVideo 
    ? <OffthreadVideo src={staticFile(src)} style={style} muted delayRenderTimeoutInMilliseconds={120000} onError={(e) => console.log("Media playback error caught on OffthreadVideo:", e)} />
    : <Img src={staticFile(src)} style={style} />;
};

const BackgroundVideo: React.FC<{ scene: any, blurred?: boolean }> = ({ scene, blurred }) => {
  const mediaPaths = scene.media_paths || [];
  const src = mediaPaths[0] || scene.media_path;
  if (!src) return null;
  
  return (
    <AbsoluteFill style={{ filter: blurred ? 'blur(10px) brightness(0.6)' : 'brightness(0.9)' }}>
      <SmartMedia src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.1)' }} />
    </AbsoluteFill>
  );
};

// ==========================================
// 1. VIBE LAYOUT
// ==========================================
const VibeLayout: React.FC<{ scene: any, duration: number }> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = interpolate(frame, [0, duration], [1.05, 1.15]); // gentle push in
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
         <BackgroundVideo scene={scene} blurred={false} />
      </AbsoluteFill>
      <FilmGrain />
    </AbsoluteFill>
  );
};

// ==========================================
// 2. DATA LAYOUT
// ==========================================
const DataLayout: React.FC<{ scene: any }> = ({ scene }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <BackgroundVideo scene={scene} blurred={true} />
      <VolumetricDust />
    </AbsoluteFill>
  );
};

// ==========================================
// 3. SPECIFIC LAYOUT (Image + Text)
// ==========================================
const SpecificLayout: React.FC<{ scene: any, duration: number }> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const visual = scene.visual || {};
  const assets = visual.assets || [];
  const imageAsset = assets.find((a: any) => a.type === 'image');
  
  if (!imageAsset || !imageAsset.local_path) return <VibeLayout scene={scene} duration={duration} />;
  
  const layoutPreset = visual.layout_preset || 'image_left_text_right';
  const isLeft = layoutPreset.includes('left');
  
  const triggerMs = imageAsset.trigger_start_ms || scene.timing?.start_ms || 0;
  const triggerFrame = Math.max(0, Math.round(((triggerMs - scene.timing.start_ms) / 1000) * fps));
  
  const popProgress = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 1.2 }
  });
  
  const activeFrame = Math.max(0, frame - triggerFrame);
  const floatY = Math.sin(activeFrame * 0.05) * 15;
  const targetX = isLeft ? -400 : 400;
  
  const x = interpolate(popProgress, [0, 1], [isLeft ? -1000 : 1000, targetX]);
  const s = interpolate(popProgress, [0, 1], [0.5, 1.0]);
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <BackgroundVideo scene={scene} blurred={true} />
      <VolumetricDust />
      
      {frame >= triggerFrame && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            position: 'absolute',
            transform: `translate3d(${x}px, ${floatY}px, 0) scale(${s})`,
            filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.9))'
          }}>
            <Img src={staticFile(imageAsset.local_path)} style={{ maxWidth: '800px', maxHeight: '800px', objectFit: 'contain' }} />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ==========================================
// 4. COMPARISON LAYOUT (Dynamic Floating)
// ==========================================
const ComparisonLayout: React.FC<{ scene: any, duration: number }> = ({ scene, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const visual = scene.visual || {};
  const assets = visual.assets || [];
  
  // Sort assets by trigger frame to know who comes first
  const mappedAssets = assets.filter((a:any) => a.type === 'image' && a.local_path).map((a: any) => {
      const tMs = a.trigger_start_ms || scene.timing?.start_ms || 0;
      const tF = Math.max(0, Math.round(((tMs - scene.timing.start_ms) / 1000) * fps));
      return { ...a, triggerFrame: tF };
  }).sort((a:any, b:any) => a.triggerFrame - b.triggerFrame);
  
  if (mappedAssets.length === 0) return <VibeLayout scene={scene} duration={duration} />;
  
  const mainAsset = mappedAssets[0];
  const compAssets = mappedAssets.slice(1);
  const compTriggerFrame = compAssets.length > 0 ? compAssets[0].triggerFrame : 999999;
  
  // Physics for Main Asset
  const mainActiveFrame = Math.max(0, frame - mainAsset.triggerFrame);
  const mainPop = spring({ frame: mainActiveFrame, fps, config: { damping: 14, stiffness: 90, mass: 1.2 } });
  
  // When competitor triggers, main asset moves from center to its position
  const shiftProgress = spring({ frame: Math.max(0, frame - compTriggerFrame), fps, config: { damping: 14, stiffness: 80 } });
  
  const getXForPosition = (pos: string, isMain: boolean) => {
      if (pos === 'left') return -450;
      if (pos === 'right') return 450;
      return 0; // fallback
  };
  
  const mainTargetX = getXForPosition(mainAsset.position || 'left', true);
  const mainCurrentX = interpolate(shiftProgress, [0, 1], [0, mainTargetX]);
  
  // Main starts at scale 1.1 in center, scales down slightly when shifting
  const mainCurrentS = interpolate(shiftProgress, [0, 1], [1.1, 1.0]) * mainPop;
  
  const floatY = Math.sin(frame * 0.05) * 15;
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
      <BackgroundVideo scene={scene} blurred={true} />
      <VolumetricDust />
      
      {/* Main Asset */}
      {frame >= mainAsset.triggerFrame && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            position: 'absolute',
            transform: `translate3d(${mainCurrentX}px, ${floatY}px, 0) scale(${mainCurrentS})`,
            filter: 'drop-shadow(0 40px 60px rgba(0,0,0,0.9))'
          }}>
            <Img src={staticFile(mainAsset.local_path)} style={{ maxWidth: '800px', maxHeight: '800px', objectFit: 'contain' }} />
          </div>
        </AbsoluteFill>
      )}
      
      {/* Competitor Assets */}
      {compAssets.map((asset: any, idx: number) => {
          if (frame < asset.triggerFrame) return null;
          const aActiveFrame = Math.max(0, frame - asset.triggerFrame);
          const aPop = spring({ frame: aActiveFrame, fps, config: { damping: 14, stiffness: 90, mass: 1.2 } });
          const aTargetX = getXForPosition(asset.position || 'right', false);
          
          // If split_3, stack them vertically. For now, we do a simple vertical spread.
          let yOff = 0;
          if (visual.layout_preset === 'split_3' && compAssets.length > 1) {
              yOff = idx === 0 ? -200 : 200;
          }
          
          const aFloatY = Math.sin(frame * 0.04 + idx) * 10 + yOff;
          
          return (
             <AbsoluteFill key={idx} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                  position: 'absolute',
                  transform: `translate3d(${aTargetX}px, ${aFloatY}px, 0) scale(${aPop * 0.9})`, // slightly smaller
                  filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.8))'
                }}>
                  <Img src={staticFile(asset.local_path)} style={{ maxWidth: '700px', maxHeight: '700px', objectFit: 'contain' }} />
                </div>
             </AbsoluteFill>
          );
      })}
    </AbsoluteFill>
  );
};


// ==========================================
// ROUTER
// ==========================================
export const LayoutRouter: React.FC<{ scene: any, duration: number, isEven?: boolean, variants?: any }> = ({ scene, duration, isEven, variants }) => {
  const type = scene?.visual?.scene_type || 'vibe';
  
  if (type === 'data') return <DataLayout scene={scene} />;
  if (type === 'comparison') return <ComparisonLayout scene={scene} duration={duration} />;
  if (type === 'specific') return <SpecificLayout scene={scene} duration={duration} />;
  
  return <VibeLayout scene={scene} duration={duration} />;
};
