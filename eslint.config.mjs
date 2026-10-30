import { config } from "@remotion/eslint-config-flat";

export default [
  // Kerangka B engine and the reaction-time example scenes are vendored verbatim from aiTrends 2D Studio; keep them identical to upstream.
  { ignores: ["src/kit2d/engine/**", "src/videos/contoh-2d/scenes/**"] },
  ...config,
];
