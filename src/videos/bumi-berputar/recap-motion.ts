/** Layout for the recap's globe-to-yard handoff; input is the already-eased progress. */
export const recapLayers = (follow: number) => {
  const progress = Math.max(0, Math.min(1, follow));
  return {
    earthY: 1130,
    earthOpacity: Math.max(0, 1 - progress * 2),
    roofX: -90,
    roofY: 0,
    roofOpacity: Math.max(0, progress * 2 - 1),
  };
};
