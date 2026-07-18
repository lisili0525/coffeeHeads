import WorldMap from "../components/WorldMap";
import { coffeeFarms } from "../data/coffeeFarms";

export default function Coffeepedia() {
  return (
    <div className="coffeepedia">
      <h2>Coffeepedia</h2>
      <p className="meta">A quick reference for everything coffee: where it came from, what you're drinking, and how it got there.</p>

      <section>
        <h3>Origins of Coffee</h3>
        <p>
          Coffee's story is usually traced to the highlands of <strong>Ethiopia</strong>,
          where legend credits a goat herder named Kaldi with discovering the plant
          after noticing his goats grew energetic from eating its red berries. From
          Ethiopia, coffee cultivation spread across the Red Sea to <strong>Yemen</strong>{" "}
          by the 15th century, where it was first deliberately cultivated and brewed.
          Trade routes carried it through the Ottoman Empire into Europe by the 17th
          century, and European colonization then spread coffee cultivation to the
          Americas, Southeast Asia, and beyond - which is why the world's biggest
          producers today (Brazil, Vietnam, Colombia) are nowhere near coffee's
          original home.
        </p>
      </section>

      <section>
        <h3>Popular Kinds of Coffee</h3>
        <p>Nearly all coffee you drink comes from one of these species:</p>
        <ul>
          <li><strong>Arabica (Coffea arabica)</strong> - roughly 60-70% of world production. Grown at higher altitudes, prized for nuanced, slightly acidic, sweeter flavor. More fragile and disease-prone to grow.</li>
          <li><strong>Robusta (Coffea canephora)</strong> - the rest of world production. Hardier, higher caffeine content, more bitter and earthy - common in espresso blends and instant coffee for its crema and lower cost.</li>
          <li><strong>Liberica</strong> - a small share of production, mostly grown in the Philippines and parts of Southeast Asia. Distinctive smoky, woody, floral flavor.</li>
          <li><strong>Excelsa</strong> - technically a variety of Liberica, grown mostly in Southeast Asia; adds tart, fruity notes and is often used to round out blends.</li>
        </ul>
      </section>

      <section>
        <h3>Processing Methods</h3>
        <p>Once cherries are picked, the fruit has to be removed from the seed (the "bean") before it can be dried. How that happens shapes the final cup:</p>
        <ul>
          <li><strong>Washed (Wet)</strong> - fruit is stripped off before drying, producing a cleaner, brighter, more acidic cup. Water-intensive.</li>
          <li><strong>Natural (Dry)</strong> - whole cherries are dried in the sun with the fruit still on, then hulled. Produces heavier body and fruitier, sometimes wine-like flavor.</li>
          <li><strong>Honey / Pulped Natural</strong> - a middle ground: skin is removed but some sticky fruit mucilage ("honey") is left on during drying, balancing brightness and body.</li>
          <li><strong>Wet-Hulled (Giling Basah)</strong> - a method distinctive to Indonesia where the bean is hulled while still slightly wet, producing the low-acid, heavy-bodied, earthy cup associated with Sumatran coffee.</li>
        </ul>
      </section>

      <section>
        <h3>Famous Coffee-Growing Regions</h3>
        <p>Hover a marker for the region name, or scan the list below the map for details.</p>
        <WorldMap farms={coffeeFarms} />
        <ol className="farm-legend">
          {coffeeFarms.map((farm) => (
            <li key={farm.name}>
              <strong>{farm.name}, {farm.country}</strong> - {farm.note}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
