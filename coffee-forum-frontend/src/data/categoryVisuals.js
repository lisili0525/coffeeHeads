import {
  BrewMethodsIcon,
  BeanBagIcon,
  GrinderIcon,
  CoffeeBeanIcon,
  LatteArtIcon,
  HomeRoastingIcon,
  CoffeeShopIcon,
  ColdBrewIcon,
  BeginnerQuestionsIcon,
} from "../components/Illustrations";

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
  "latte art": { Icon: LatteArtIcon, tagline: null },
  "home roasting": { Icon: HomeRoastingIcon, tagline: null },
  "coffee shops & cafes": { Icon: CoffeeShopIcon, tagline: null },
  "cold brew & iced coffee": { Icon: ColdBrewIcon, tagline: null },
  "beginner questions": { Icon: BeginnerQuestionsIcon, tagline: null },
};

export function getCategoryVisual(name) {
  return VISUALS_BY_NAME[name?.trim().toLowerCase()] || { Icon: CoffeeBeanIcon, tagline: null };
}
