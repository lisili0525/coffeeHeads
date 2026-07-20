import { Link } from "react-router-dom";
import {
  WashedProcessIllustration,
  SunDryingIllustration,
  HoneyProcessIllustration,
  WetHulledIllustration,
} from "../components/Illustrations";

const METHODS = [
  {
    name: "Washed (Wet) Process",
    Illustration: WashedProcessIllustration,
    body: [
      `After picking, ripe cherries are pulped to strip off the outer skin, then the beans
       - still coated in sticky mucilage - are submerged in fermentation tanks for
       12 to 48 hours. Naturally occurring enzymes and bacteria break the mucilage down,
       which is then rinsed off with clean water before the beans are laid out to dry.`,
      `This method produces the cleanest, brightest, most consistent cup: vivid acidity,
       floral and fruity notes, without any heaviness from the fruit itself. It's the
       standard across East Africa and Central America, though it's water-intensive and
       needs reliable water access and treatment.`,
    ],
  },
  {
    name: "Natural (Dry) Process",
    Illustration: SunDryingIllustration,
    body: [
      `The oldest and simplest method - ripe cherries are spread out whole (skin, fruit,
       and all) on raised beds or patios and left to dry in the sun for two to six weeks,
       raked regularly to dry evenly and avoid mold.`,
      `As the fruit dries around the seed, sugars from the cherry slowly seep into the
       bean, producing a heavier body, intense sweetness, and bold, sometimes wine-like
       fruit notes. It's traditional in Ethiopia and Yemen, and widely used in Brazil
       where water is scarcer - though quality can be inconsistent since even drying
       depends heavily on weather and labor.`,
    ],
  },
  {
    name: "Honey / Pulped Natural Process",
    Illustration: HoneyProcessIllustration,
    body: [
      `A hybrid between washed and natural: the skin is mechanically removed right after
       picking, like washed processing, but instead of fully fermenting and rinsing, the
       sticky mucilage - the "honey" - is left on the bean during drying.`,
      `How much mucilage is left on is often graded by color: yellow, red, and black honey,
       from least to most, each producing a different balance of sweetness and body.
       Closely associated with Costa Rica, where it was popularized, honey process splits
       the difference - brighter and cleaner than natural, sweeter and fuller-bodied than
       washed.`,
    ],
  },
  {
    name: "Wet-Hulled (Giling Basah)",
    Illustration: WetHulledIllustration,
    body: [
      `A method almost unique to Indonesia, developed out of necessity in humid climates
       where beans can't fully dry before mold sets in. Farmers dry the beans only
       partially - to about 30-35% moisture - before hulling off the parchment layer
       while the bean is still damp, then finish drying the exposed bean the rest of the
       way.`,
      `That unusual extra surface contact with humid air during final drying is what gives
       the bean its signature: a low-acid, heavy-bodied, earthy, herbal cup - the
       hallmark of Sumatran and Sulawesi coffees.`,
    ],
  },
];

export default function ProcessingMethods() {
  return (
    <div className="coffeepedia">
      <h2>Processing Methods</h2>
      <p className="meta">
        How the fruit gets off the bean shapes everything about the cup. A closer look at
        the four methods you'll run into most. <Link to="/coffeepedia">&larr; Back to Coffeepedia</Link>
      </p>

      {METHODS.map(({ name, Illustration, body }) => (
        <section key={name} className="coffeepedia-section-with-art">
          <div>
            <h3>{name}</h3>
            {body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <Illustration className="coffeepedia-illustration" />
        </section>
      ))}
    </div>
  );
}
