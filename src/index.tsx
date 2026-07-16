import { AbsoluteFill, Sequence, useVideoConfig, staticFile as remotionStaticFile, registerRoot, Composition } from 'remotion';
import React from 'react';
import masterJsonRaw from '../master_timeline.json';

import { LayoutRouter } from './components/Layouts';
import { CaptionDirector } from './components/CaptionDirector';
import { GlobalFinisher } from './components/GlobalFinisher';

const staticFile = (path: string) => remotionStaticFile(path?.startsWith('public/') ? path.slice(7) : path);

const rawAny = masterJsonRaw as any;
const normalisedTimeline = (rawAny.timeline ?? []).map((s: any) => s).filter(Boolean);

const masterJson: any = {
  ...rawAny,
  timeline: normalisedTimeline,
};

const AutomatedDocumentary = () => {
  const { fps } = useVideoConfig();
  const msToFrames = (ms: number) => Math.round((ms / 1000) * fps);

  // Determine global frame positioning for absolute sequences
  const mappedScenes = masterJson.timeline.map((scene: any, i: number) => {
      const startMs = scene.timing?.start_ms || (i * 3000);
      const audioDurMs = scene.timing?.duration_ms || 3000;
      
      const startFrame = msToFrames(startMs);
      const audioDurFrames = msToFrames(audioDurMs);
      
      // Look ahead to the next scene to prevent 1-frame rounding gaps
      let visualDurFrames = audioDurFrames;
      if (i < masterJson.timeline.length - 1) {
          const nextStartMs = masterJson.timeline[i+1].timing?.start_ms || ((i+1) * 3000);
          const nextStartFrame = msToFrames(nextStartMs);
          visualDurFrames = nextStartFrame - startFrame;
      }
      
      return {
          ...scene,
          startFrame,
          visualDurFrames,
          audioDurFrames
      };
  });

  return (
    <GlobalFinisher>
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
         {mappedScenes.map((scene: any, index: number) => {
            return (
               <React.Fragment key={scene.scene_id || index}>
                  
                  {/* VISUAL SEQUENCE */}
                  <Sequence from={scene.startFrame} durationInFrames={scene.visualDurFrames}>
                     <AbsoluteFill>
                        
                        <LayoutRouter scene={scene} duration={scene.visualDurFrames} />
                        
                        <CaptionDirector scene={scene} />

                     </AbsoluteFill>
                  </Sequence>

                  {/* DECOUPLED AUDIO SEQUENCE */}
                  <Sequence from={scene.startFrame} durationInFrames={scene.audioDurFrames}>
                      {/* Audio tracks handled globally or here */}
                  </Sequence>
                  
               </React.Fragment>
            );
         })}
      </AbsoluteFill>
    </GlobalFinisher>
  );
};

const RemotionRoot = () => {
  const totalDurationMs = masterJson.meta?.total_duration_ms || masterJson.metadata?.total_duration_ms || 10000;
  const totalFrames = Math.max(1, Math.round((totalDurationMs / 1000) * 30)) + 60;
  return <Composition id="AutomatedDocumentary" component={AutomatedDocumentary} durationInFrames={totalFrames} fps={30} width={1920} height={1080} />;
};

registerRoot(RemotionRoot);
