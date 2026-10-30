export type Word = {word: string; start: number; end: number};
export type Shot = {id: string; start: number; end: number; line?: string; [k: string]: unknown};
/** src/videos/<slug>/story.json (Kerangka B); schema in rules/KERANGKA-B.md. */
export type Story = {aspect?: string; style?: string; duration: number; shots: Shot[]; [k: string]: unknown};

export function setup(o: {story: Story; words: Word[]; style?: string; outW: number; outH: number; fps: number; debug?: boolean}): void;
export function renderFrame(canvas: HTMLCanvasElement, frame: number): void;
