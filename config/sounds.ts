export type SoundDefinition = {
  src: string;
  volume: number;
  playbackRate: [min: number, max: number];
};

export const sounds = {
  cannonShot: {
    src: "/sounds/cannon-shot.mp3",
    volume: 0.5,
    playbackRate: [0.8, 1.2],
  },
  sail: {
    src: "/sounds/sail.mp3",
    volume: 0.5,
    playbackRate: [0.8, 1.2],
  },
} satisfies Record<string, SoundDefinition>;

export type SoundName = keyof typeof sounds;
