import { staticFile } from 'remotion';

// Exact SFX files present in public/audio/AnimatedNumber sfx/
// Verified against: H:\My Drive\Colab_AutoVideoCreator\public\audio\sfx\AnimatedNumber sfx\
// Files: general.wav, money.wav, year.wav, Horsepower.wav
const SFX_MAP: Record<string, string | null> = {
    // Direct mappings to their purpose-built SFX
    money:      'audio/AnimatedNumber sfx/money.wav',
    price:      'audio/AnimatedNumber sfx/money.wav',  // alias for money
    gain:       'audio/AnimatedNumber sfx/money.wav',  // financial gain = money cue
    loss:       'audio/AnimatedNumber sfx/money.wav',  // financial loss = money cue
    year:       'audio/AnimatedNumber sfx/year.wav',
    hp:         'audio/AnimatedNumber sfx/Horsepower.wav',
    horsepower: 'audio/AnimatedNumber sfx/Horsepower.wav',

    // Everything else falls back to the general tick
    general:    'audio/AnimatedNumber sfx/general.wav',
    percent:    'audio/AnimatedNumber sfx/general.wav',
    duration:   'audio/AnimatedNumber sfx/general.wav',
    impact:     'audio/AnimatedNumber sfx/general.wav',
    count:      'audio/AnimatedNumber sfx/general.wav',
    number:     'audio/AnimatedNumber sfx/general.wav',
};

/**
 * Resolves the correct SFX file for a given AnimatedNumber type.
 * Deterministic — no async probing, no delayRender needed.
 * Falls back to general.wav for any unknown type.
 */
export const useDynamicSfx = (type: string, _globalIndex: number): string | null => {
    const key = (type || 'general').toLowerCase();
    const path = SFX_MAP[key] ?? SFX_MAP['general'] ?? null;
    return path;
};
