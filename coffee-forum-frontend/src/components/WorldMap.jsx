import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import countriesTopology from "world-atlas/countries-110m.json";

// world-atlas country names don't always match the short forms used in
// coffeeFarms.js (e.g. "USA (Hawaii)", "Indonesia (Sumatra)").
const COUNTRY_NAME_ALIASES = {
  USA: "United States of America",
};

function toTopologyCountryName(farmCountry) {
  const base = farmCountry.replace(/\s*\(.*\)\s*/, "").trim();
  return COUNTRY_NAME_ALIASES[base] || base;
}

export default function WorldMap({ farms }) {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();
  const producerCountries = new Set(farms.map((f) => toTopologyCountryName(f.country)));

  return (
    <ComposableMap projectionConfig={{ scale: 155 }} className="world-map">
      <Geographies geography={countriesTopology}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const isProducer = producerCountries.has(geo.properties.name);
            const fill = isProducer ? "#8fb573" : "#e5d5bc";
            const stroke = isProducer ? "#5c7a48" : "#a68a63";
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill, stroke, strokeWidth: 0.5, outline: "none" },
                  hover: { fill, stroke, strokeWidth: 0.5, outline: "none" },
                  pressed: { fill, stroke, strokeWidth: 0.5, outline: "none" },
                }}
              />
            );
          })
        }
      </Geographies>
      {farms.map((farm, i) => (
        <Marker
          key={farm.name}
          coordinates={[farm.lng, farm.lat]}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
          onClick={() => navigate(`/coffeepedia/farms/${farm.slug}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`/coffeepedia/farms/${farm.slug}`);
            }
          }}
          tabIndex={0}
          role="link"
          aria-label={`View ${farm.name}, ${farm.country}`}
          style={{ cursor: "pointer" }}
        >
          <circle r="6" className="map-marker-dot" />
          <text y="3" textAnchor="middle" className="map-marker-label">{i + 1}</text>
          {active === i && (
            <g transform="translate(10, -10)">
              <rect x="0" y="-16" width={Math.max(96, (farm.name.length + farm.country.length) * 5 + 46)} height="24" rx="4" className="map-tooltip-bg" />
              <text x="8" y="0" className="map-tooltip-text">{farm.name}, {farm.country} &rarr;</text>
            </g>
          )}
        </Marker>
      ))}
    </ComposableMap>
  );
}
