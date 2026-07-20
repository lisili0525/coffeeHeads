// Rich per-region content for the farm detail pages. Keyed by the same
// `slug` used in coffeeFarms.js. `terrain`/`accent`/`peaks` drive
// RegionLandscapeIllustration, `notes` drives FlavorProfileIllustration.
export const farmDetails = {
  yirgacheffe: {
    terrain: "terraced-highlands",
    accent: "#e07b39",
    notes: ["floral", "citrus", "berry"],
    paragraphs: [
      `Considered the birthplace of Arabica coffee itself, Yirgacheffe sits in Ethiopia's
       Gedeo Zone at 1,700-2,200 meters, where coffee still grows semi-wild in the
       understory of native forest alongside false banana and eucalyptus.`,
      `Most of it is washed at small, family-run wet mills before drying on raised beds,
       and even the natural lots here are prized rather than treated as a lesser grade.
       It's also the setting for the legend of Kaldi, the goat herder who supposedly
       discovered coffee after his goats grew energetic from eating the cherries.`,
      `Expect a cup that's intensely floral and fragrant - jasmine and bergamot on the
       nose - with bright lemon acidity and a berry-like sweetness that's become the
       reference point for what "Ethiopian coffee" tastes like.`,
    ],
  },
  huila: {
    terrain: "steep-slope",
    accent: "#7fa876",
    notes: ["citrus", "nutty", "chocolate"],
    paragraphs: [
      `Huila, in Colombia's southern Andes, is the country's most productive coffee
       department - steep volcanic slopes and consistent rainfall give smallholder farms
       (most under 5 hectares) ideal conditions between 1,250 and 2,000 meters.`,
      `Nearly all of it is washed and sun-dried on covered patios called "elba" to protect
       the beans from Huila's frequent afternoon showers.`,
      `The altitude and volcanic soil produce a cup with real structure - balanced
       acidity, a syrupy body, and sweetness that runs from caramel and toasted nut
       through to bright citrus, which is why Huila lots are a mainstay of specialty
       roasters looking for a dependable, crowd-pleasing single origin.`,
    ],
  },
  "minas-gerais": {
    terrain: "rolling-hills",
    accent: "#c98a2e",
    notes: ["chocolate", "nutty"],
    paragraphs: [
      `Brazil grows more coffee than any other country, and Minas Gerais - specifically
       the Cerrado and Sul de Minas regions - produces the bulk of it.`,
      `The terrain here is flatter and lower-altitude than most specialty origins, which
       is exactly what makes it possible to mechanically harvest entire rows of trees at
       once, keeping costs down at enormous scale. Most cherries are dried naturally right
       on the tree or on patios, since Brazil's drier climate makes sun-drying reliable.`,
      `The result is a low-acid, heavy-bodied cup with chocolate and roasted nut notes and
       a natural sweetness - the backbone flavor of countless espresso blends worldwide.`,
    ],
  },
  antigua: {
    terrain: "volcano",
    accent: "#b0402f",
    notes: ["spice", "chocolate", "earthy"],
    paragraphs: [
      `The colonial city of Antigua sits in a valley ringed by three volcanoes - Agua,
       Fuego, and Acatenango - whose ash has enriched the surrounding soil for centuries.
       Fuego is still active and occasionally dusts the coffee farms in fine volcanic ash,
       which locals only half-joke is a free fertilizer treatment.`,
      `Farms here sit at 1,500-1,700 meters and are almost universally washed-processed,
       with the volcanic minerality coming through unmistakably in the cup: smoky, spiced,
       cocoa-forward, with a full body that's made Antigua one of the most recognized
       named origins on any coffee bag.`,
    ],
  },
  boquete: {
    terrain: "misty-mountains",
    accent: "#c98ac2",
    peaks: 2,
    notes: ["floral", "tropical", "citrus"],
    paragraphs: [
      `Boquete, in Panama's western highlands, would be a fairly quiet mountain coffee
       town if it weren't for one farm: Hacienda La Esmeralda, whose Geisha variety set an
       auction record in 2004 and reshaped what the entire specialty industry thought
       coffee could taste like.`,
      `Geisha trees are tall, low-yielding, and finicky to grow, but the cloud-forest
       altitude and cool temperatures around Boquete happen to suit them perfectly.`,
      `A good Geisha lot, usually washed to keep the cup as clean as possible, tastes
       almost more like fine tea than coffee - jasmine, bergamot, and tropical fruit in a
       delicate body that commands some of the highest prices in the industry.`,
    ],
  },
  tarrazu: {
    terrain: "terraced-highlands",
    accent: "#5c7a48",
    notes: ["citrus", "honeyed"],
    paragraphs: [
      `Tarrazu, in Costa Rica's Talamanca mountain range, sits at 1,200-1,900 meters on
       steep terraced slopes that make anything but hand-picking impractical - which,
       combined with Costa Rica's ban on growing lower-quality Robusta, keeps quality
       consistently high across the whole region.`,
      `Tarrazu is also where honey processing was popularized: drying cherries with
       varying amounts of sticky mucilage left on the parchment adds sweetness and body
       without the full fermentation of a natural process.`,
      `The resulting cup is exceptionally clean and bright, with citrus acidity and a
       pronounced honeyed sweetness that's made Tarrazu one of the most consistently
       well-regarded origins in Central America.`,
    ],
  },
  "blue-mountains": {
    terrain: "misty-mountains",
    accent: "#4a6fa5",
    peaks: 3,
    notes: ["nutty", "chocolate", "floral"],
    paragraphs: [
      `The Blue Mountains rise to over 2,200 meters east of Kingston, tall enough to be
       wrapped in the cool, misty cloud cover that gives the range its name and its
       coffee its unusually slow, even ripening.`,
      `Only coffee grown within a legally defined boundary in these mountains can be
       labeled "Jamaica Blue Mountain," a protected designation policed as strictly as
       Champagne's. That scarcity, combined with genuine quality, made it famous - and,
       for decades, absurdly expensive, propped up further by a long-running exclusive
       supply deal with Japanese buyers.`,
      `The cup itself is deliberately mild: soft acidity, a clean body, and a delicate
       sweetness with mild nutty and chocolate notes rather than anything bold.`,
    ],
  },
  mandheling: {
    terrain: "jungle-lowland",
    accent: "#5c7a48",
    notes: ["earthy", "herbal", "spice"],
    paragraphs: [
      `"Mandheling" doesn't refer to a place at all - it's the Mandailing ethnic group of
       North Sumatra, whose name got attached to the coffee by early exporters and stuck.`,
      `What actually defines this coffee is giling basah, or wet-hulling: in Sumatra's
       humid, rainy climate, farmers can't reliably sun-dry cherries to a stable moisture
       level, so they hull the parchment off while the bean is still damp and finish
       drying it exposed.`,
      `That unconventional extra exposure to humid air is responsible for Sumatran
       coffee's signature look (bean surfaces are often visibly dented and irregular) and
       taste: heavy body, low acid, and deep earthy, herbal, almost cedar-like notes
       unlike almost anywhere else in the world.`,
    ],
  },
  kona: {
    terrain: "coastal-slope",
    accent: "#5fa8c4",
    notes: ["nutty", "tropical"],
    paragraphs: [
      `The Kona districts on Hawaii's Big Island are one of the only places coffee is
       commercially grown on U.S. soil, thanks to a rare combination: volcanic slopes on
       Mauna Loa, consistent afternoon cloud cover that shades trees like a natural cover
       crop, and rich, mineral volcanic soil.`,
      `Farms are small - often just a few acres - and nearly all harvesting is still done
       by hand since the terrain is too steep for machines.`,
      `Authentic 100% Kona coffee (as opposed to the much more common 10% "Kona blend") is
       smooth and mild, with gentle nutty sweetness, light body, and low acidity - prized
       as much for its rarity and story as for being genuinely pleasant, easy-drinking
       coffee.`,
    ],
  },
};
