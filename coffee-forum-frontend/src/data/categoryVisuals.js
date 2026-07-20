import { BrewMethodsIcon, BeanBagIcon, GrinderIcon, CoffeeBeanIcon } from "../components/Illustrations";

const VISUALS_BY_NAME = {
  "brew methods": {
    Icon: BrewMethodsIcon,
    tagline: "Pour-over, French press, espresso — every method has an opinion. Bring yours.",
  },
  "bean reviews": {
    Icon: BeanBagIcon,
    tagline: "Crack open a bag, rate the roast, and tell us if it lived up to the label.",
  },
  "gear talk": {
    Icon: GrinderIcon,
    tagline: "Grinders, kettles, scales — the hardware nerds compare notes here.",
  },
};

export function getCategoryVisual(name) {
  return VISUALS_BY_NAME[name?.trim().toLowerCase()] || { Icon: CoffeeBeanIcon, tagline: null };
}
