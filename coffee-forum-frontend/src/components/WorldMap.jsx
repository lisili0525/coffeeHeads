import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import landTopology from "world-atlas/land-110m.json";

export default function WorldMap({ farms }) {
  const [active, setActive] = useState(null);

  return (
    <ComposableMap projectionConfig={{ scale: 155 }} className="world-map">
      <Geographies geography={landTopology}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              style={{
                default: { fill: "#cbb89a", stroke: "#a68a63", strokeWidth: 0.5, outline: "none" },
                hover: { fill: "#cbb89a", stroke: "#a68a63", strokeWidth: 0.5, outline: "none" },
                pressed: { fill: "#cbb89a", stroke: "#a68a63", strokeWidth: 0.5, outline: "none" },
              }}
            />
          ))
        }
      </Geographies>
      {farms.map((farm, i) => (
        <Marker
          key={farm.name}
          coordinates={[farm.lng, farm.lat]}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
        >
          <circle r="6" className="map-marker-dot" />
          <text y="3" textAnchor="middle" className="map-marker-label">{i + 1}</text>
          {active === i && (
            <g transform="translate(10, -10)">
              <rect x="0" y="-16" width={Math.max(70, (farm.name.length + farm.country.length) * 5 + 20)} height="24" rx="4" className="map-tooltip-bg" />
              <text x="8" y="0" className="map-tooltip-text">{farm.name}, {farm.country}</text>
            </g>
          )}
        </Marker>
      ))}
    </ComposableMap>
  );
}
