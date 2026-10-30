// Reusable SVG Earth with real coastlines (Natural Earth 1:110m land, public domain,
// naturalearthdata.com; coordinates rounded to 0.01°). Orthographic projection via d3-geo.
// Optional asset: style comes from props, so it fits any Kerangka A look, not only Animate Math.
import {geoGraticule, geoOrthographic, geoPath, type ExtendedFeatureCollection} from 'd3-geo';
import land from './land-110m.json';

const LAND = land as unknown as ExtendedFeatureCollection;
const GRATICULE = geoGraticule().step([30, 30])();

export type EarthColors = {ocean: string; oceanOpacity: number; land: string; landOpacity: number; line: string; grid: string};

/** Animate Math look (see src/kit/animate-math.tsx). */
export const EARTH_MATH: EarthColors = {ocean: '#2E86AB', oceanOpacity: 0.3, land: '#BBBBBB', landOpacity: 0.16, line: '#BBBBBB', grid: '#BBBBBB'};

/**
 * Earth centred at (cx, cy) with radius r. `lon` is the longitude facing the viewer (degrees);
 * decrease it over time to turn the Earth west to east. `tilt` 0 = side view, 90 = seen from
 * above the north pole (then west-to-east looks counterclockwise). `detail` 0..1 fades land and
 * grid, e.g. while zooming so far in that the surface should read as flat ground.
 */
export const Earth: React.FC<{
  cx: number;
  cy: number;
  r: number;
  lon: number;
  tilt?: number;
  detail?: number;
  grid?: boolean;
  colors?: EarthColors;
}> = ({cx, cy, r, lon, tilt = 0, detail = 1, grid = true, colors = EARTH_MATH}) => {
  const path = geoPath(geoOrthographic().scale(r).translate([cx, cy]).rotate([-lon, -tilt]));
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={colors.ocean} fillOpacity={colors.oceanOpacity} />
      {detail > 0 ? (
        <>
          {grid ? <path d={path(GRATICULE) ?? ''} fill="none" stroke={colors.grid} strokeWidth={1.5} opacity={0.22 * detail} /> : null}
          <path d={path(LAND) ?? ''} fill={colors.land} fillOpacity={colors.landOpacity} stroke={colors.line} strokeWidth={2} strokeLinejoin="round" opacity={detail} />
        </>
      ) : null}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.line} strokeWidth={3} />
    </g>
  );
};
