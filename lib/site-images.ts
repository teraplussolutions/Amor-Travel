export type SiteImage = {
  src: string;
  altEn: string;
  /** MK-friendly description for i18n / admin preview */
  altMk: string;
  destination?: string;
};

export const BRAND_LOGO: SiteImage = {
  src: "/images/brand/amor-logo.png",
  altEn: "Amor Travel agency logo",
  altMk: "Лого на агенцијата Амор Травел",
};

export const HERO_SLIDES: SiteImage[] = [
  {
    src: "/images/hero/prague.png",
    altEn: "Charles Bridge and Prague old town at sunset",
    altMk: "Кarlов мост и стариот дел на Прага на зајдисонце",
    destination: "Prague",
  },
  {
    src: "/images/hero/budapest.png",
    altEn: "Parliament building along the Danube in Budapest",
    altMk: "Парламентот покрај Дунав во Будимпешта",
    destination: "Budapest",
  },
  {
    src: "/images/hero/malta.jpg",
    altEn: "Historic harbour and limestone buildings in Malta",
    altMk: "Старо пристаниште и камени згради на Малта",
    destination: "Malta",
  },
  {
    src: "/images/hero/sharm-el-sheikh.png",
    altEn: "Turquoise Red Sea coast near Sharm El Sheikh",
    altMk: "Тиркизна обала на Црвеното Море кај Шарм El Sheikh",
    destination: "Sharm El Sheikh",
  },
  {
    src: "/images/hero/skopje.png",
    altEn: "Skopje city centre with mountains in the background",
    altMk: "Центар на Скопје со планини во позадина",
    destination: "Skopje",
  },
  {
    src: "/images/hero/phuket.png",
    altEn: "Tropical beach and palm trees in Phuket, Thailand",
    altMk: "Тропска плажа и палми на Пукет, Тајланд",
    destination: "Phuket",
  },
  {
    src: "/images/hero/tbilisi.png",
    altEn: "Colourful old town rooftops in Tbilisi, Georgia",
    altMk: "Шарени покриви во стариот дел на Тбилиси, Грузија",
    destination: "Tbilisi",
  },
  {
    src: "/images/hero/venice.jpg",
    altEn: "Canal and gondolas in Venice, Italy",
    altMk: "Канал и гондоли во Венеција, Италија",
    destination: "Venice",
  },
  {
    src: "/images/hero/copenhagen.jpg",
    altEn: "Colourful Nyhavn waterfront in Copenhagen",
    altMk: "Шарена обала Nyhavn во Кopenhagen",
    destination: "Copenhagen",
  },
  {
    src: "/images/hero/italy.jpg",
    altEn: "Italian coastal town with sea views",
    altMk: "Приморски италијански град со поглед на море",
    destination: "Italy",
  },
];

export const FEATURED_TRIPS: SiteImage[] = [
  {
    src: "/images/destinations/antalya.jpg",
    altEn: "Resort coast and beaches in Antalya, Turkey",
    altMk: "Приморски одмор и плажи во Анталија, Турција",
    destination: "Antalya",
  },
  {
    src: "/images/destinations/athens.jpg",
    altEn: "Acropolis and Athens city skyline",
    altMk: "Акропола и панорама на Атина",
    destination: "Athens",
  },
  {
    src: "/images/destinations/vienna.png",
    altEn: "Historic architecture in Vienna city centre",
    altMk: "Историска архитектура во центарот на Виена",
    destination: "Vienna",
  },
  {
    src: "/images/destinations/yerevan.png",
    altEn: "Mount Ararat view from Yerevan, Armenia",
    altMk: "Поглед кон планината Арарат од Ереван, Ерменија",
    destination: "Yerevan",
  },
  {
    src: "/images/destinations/kuala-lumpur.png",
    altEn: "Petronas Towers skyline in Kuala Lumpur",
    altMk: "Kулите Petronas во Kuala Lumpur",
    destination: "Kuala Lumpur",
  },
  {
    src: "/images/destinations/sozopol.jpg",
    altEn: "Old town and Black Sea coast in Sozopol, Bulgaria",
    altMk: "Stariot grad i Crnomorska obala vo Sozopol, Bugariја",
    destination: "Sozopol",
  },
];

/** Available for admin CMS trip assignment later */
export const UNASSIGNED_DESTINATION_IMAGES: SiteImage[] = [
  {
    src: "/images/destinations/belgrade.jpg",
    altEn: "Belgrade cityscape along the Sava river",
    altMk: "Панорама на Белград покрај реката Сава",
    destination: "Belgrade",
  },
  {
    src: "/images/destinations/budva.jpg",
    altEn: "Adriatic coast and old town of Budva, Montenegro",
    altMk: "Jadranska obala i stariot grad Budva, Crna Gora",
    destination: "Budva",
  },
  {
    src: "/images/destinations/paralia.jpg",
    altEn: "Beach resort town of Paralia, Greece",
    altMk: "Primorski grad Paralia, Grcija",
    destination: "Paralia",
  },
  {
    src: "/images/destinations/excursion-1.jpg",
    altEn: "Group excursion at a scenic travel destination",
    altMk: "Групна екскурзija на ubava destinacija",
  },
  {
    src: "/images/destinations/excursion-2.jpg",
    altEn: "Travelers exploring a historic European city",
    altMk: "Patnici sto ja istrazhuvaat istoriski evropski grad",
  },
  {
    src: "/images/destinations/excursion-3.jpg",
    altEn: "Sightseeing tour at a popular landmark",
    altMk: "Obikolka na poznata znamenitost",
  },
  {
    src: "/images/destinations/journey-1.jpg",
    altEn: "Scenic journey through mountains and nature",
    altMk: "Ubav pat niz planini i priroda",
  },
  {
    src: "/images/destinations/mediterranean-1.jpg",
    altEn: "Mediterranean seaside holiday scene",
    altMk: "Odmor na mediteranska obala",
  },
  {
    src: "/images/destinations/mediterranean-2.jpg",
    altEn: "Coastal Mediterranean town with blue waters",
    altMk: "Primorski mediteranski grad so sino more",
  },
  {
    src: "/images/destinations/travel-1.jpg",
    altEn: "Holiday travel destination with scenic views",
    altMk: "Odmorska destinacija so ubavi pogledi",
  },
  {
    src: "/images/destinations/travel-2.jpg",
    altEn: "Relaxing travel getaway by the water",
    altMk: "Odmor pokraj voda na ubava lokacija",
  },
];

/** Default hero slides for admin preview before CMS overrides */
export const ADMIN_HERO_DEFAULTS = HERO_SLIDES.slice(0, 3);

export function imageAlt(image: SiteImage, locale: "mk" | "en"): string {
  return locale === "mk" ? image.altMk : image.altEn;
}
