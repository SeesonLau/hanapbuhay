/**
 * Philippines Provinces and Cities/Municipalities
 * Organized by province with their respective cities/municipalities
 */

export interface City {
  name: string;
  isCapital?: boolean;
}

export interface Province {
  name: string;
  cities: City[];
}

export const PHILIPPINES_LOCATIONS: Province[] = [
  {
    name: "Metro Manila",
    cities: [
      { name: "Manila" },
      { name: "Makati" },
      { name: "Quezon City" },
      { name: "Pasig" },
      { name: "Caloocan" },
      { name: "Las Piñas" },
      { name: "Parañaque" },
      { name: "San Juan" },
      { name: "Mandaluyong" },
      { name: "Marikina" },
      { name: "Pasay" },
      { name: "Taguig" },
      { name: "Muntinlupa" },
      { name: "Navotas" },
      { name: "Malabon" },
      { name: "Valenzuela" },
    ],
  },
  {
    name: "Cebu",
    cities: [
      { name: "Cebu City", isCapital: true },
      { name: "Lapu-Lapu City" },
      { name: "Mandaue City" },
      { name: "Toledo City" },
      { name: "Alcantara" },
      { name: "Alegria" },
      { name: "Aloguinsan" },
      { name: "Argao" },
      { name: "Asturias" },
      { name: "Badian" },
      { name: "Bantayan" },
      { name: "Barili" },
      { name: "Bogo City" },
      { name: "Boljoon" },
      { name: "Borbon" },
      { name: "Carcar" },
      { name: "Catmon" },
      { name: "Consolacion" },
      { name: "Cordova" },
      { name: "Danao City" },
      { name: "Dumanjug" },
      { name: "Ginatilan" },
      { name: "Liloan" },
      { name: "Mabini" },
      { name: "Mactan" },
      { name: "Moalboal" },
      { name: "Naga City" },
      { name: "Oslob" },
      { name: "Pilar" },
      { name: "Poro" },
      { name: "Ronda" },
      { name: "Samboan" },
      { name: "San Fernando" },
      { name: "Santa Fe" },
      { name: "Santander" },
      { name: "Tabogon" },
      { name: "Tabuelan" },
      { name: "Talisay City" },
      { name: "Tuburan" },
    ],
  },
  {
    name: "Batangas",
    cities: [
      { name: "Batangas City", isCapital: true },
      { name: "Lipa City" },
      { name: "Tanauan City" },
      { name: "Santo Tomas" },
      { name: "Talisay" },
      { name: "Lemery" },
      { name: "Nasugbu" },
      { name: "San Juan" },
      { name: "Ibaan" },
      { name: "Rosario" },
      { name: "Calatagan" },
      { name: "Mabini" },
      { name: "Cuenca" },
      { name: "Balayan" },
    ],
  },
  {
    name: "Iloilo",
    cities: [
      { name: "Iloilo City", isCapital: true },
      { name: "Roxas City" },
      { name: "Passi City" },
      { name: "Barotac Viejo" },
      { name: "Cabatuan" },
      { name: "Dumangas" },
      { name: "Estancia" },
      { name: "Hamtic" },
      { name: "Jaro" },
      { name: "Leganes" },
    ],
  },
  {
    name: "Pangasinan",
    cities: [
      { name: "Dagupan City", isCapital: true },
      { name: "San Carlos City" },
      { name: "Alaminos City" },
      { name: "San Fabian" },
      { name: "Binmaley" },
      { name: "Bolinao" },
      { name: "Agno" },
      { name: "Bugallon" },
      { name: "Mangatarem" },
    ],
  },
  {
    name: "Benguet",
    cities: [
      { name: "Baguio City" },
      { name: "La Trinidad", isCapital: true },
      { name: "Itogon" },
      { name: "Tublay" },
      { name: "Kapangan" },
      { name: "Kibungan" },
      { name: "Atok" },
      { name: "Buguias" },
      { name: "Bokod" },
      { name: "Sablan" },
      { name: "Tuba" },
      { name: "Daclan" },
    ],
  },
  {
    name: "Cagayan",
    cities: [
      { name: "Tuguegarao City", isCapital: true },
      { name: "Ilagan City" },
      { name: "Gattaran" },
      { name: "Iguig" },
      { name: "Lal-lo" },
      { name: "Lasam" },
      { name: "Penablanca" },
      { name: "Santa Ana" },
    ],
  },
  {
    name: "Albay",
    cities: [
      { name: "Legazpi City", isCapital: true },
      { name: "Ligao City" },
      { name: "Tabaco City" },
      { name: "Daraga" },
      { name: "Guinobatan" },
      { name: "Tiwi" },
      { name: "Camalig" },
      { name: "Jovellar" },
    ],
  },
  {
    name: "Aklan",
    cities: [
      { name: "Kalibo", isCapital: true },
      { name: "Boracay" },
      { name: "Ibajay" },
      { name: "Numancia" },
      { name: "Batan" },
      { name: "Altavas" },
      { name: "Balete" },
      { name: "Banga" },
      { name: "Buruanga" },
      { name: "Caluya" },
      { name: "Hamtic" },
    ],
  },
  {
    name: "Capiz",
    cities: [
      { name: "Roxas City", isCapital: true },
      { name: "Calinog" },
      { name: "Dumalag" },
      { name: "Dumarao" },
      { name: "Jamindan" },
      { name: "Mambusao" },
      { name: "Panay" },
      { name: "Panitan" },
      { name: "Pilar" },
      { name: "Sigma" },
      { name: "Tapaz" },
    ],
  },
  {
    name: "Nueva Ecija",
    cities: [
      { name: "Cabanatuan City", isCapital: true },
      { name: "San Fernando" },
      { name: "Palayan City" },
      { name: "Munoz City" },
      { name: "Gapan" },
      { name: "Talugtug" },
      { name: "Peñaranda" },
    ],
  },
  {
    name: "Bulacan",
    cities: [
      { name: "Malolos City", isCapital: true },
      { name: "Meycauayan City" },
      { name: "Marilao" },
      { name: "Obando" },
      { name: "Norzagaray" },
      { name: "San Ildefonso" },
      { name: "Cabanatuan" },
    ],
  },
  {
    name: "Laguna",
    cities: [
      { name: "Santa Rosa" },
      { name: "Calamba" },
      { name: "Biñan" },
      { name: "San Pedro" },
      { name: "Cabuyao" },
      { name: "Cavite City" },
      { name: "Bacoor" },
      { name: "Silang" },
    ],
  },
  {
    name: "Cavite",
    cities: [
      { name: "Dasmariñas" },
      { name: "Silang" },
      { name: "Cavite City", isCapital: true },
      { name: "Bacoor" },
      { name: "Imus" },
      { name: "Rosario" },
      { name: "Maragondon" },
      { name: "Magdiwang" },
      { name: "Naic" },
      { name: "Noveleta" },
      { name: "Kawit" },
    ],
  },
  {
    name: "Quezon",
    cities: [
      { name: "Lucena City", isCapital: true },
      { name: "Tayabas City" },
      { name: "Sariaya" },
      { name: "Pagbilao" },
      { name: "Atimonan" },
      { name: "Candelaria" },
      { name: "Dolores" },
    ],
  },
  {
    name: "Rizal",
    cities: [
      { name: "Antipolo City", isCapital: true },
      { name: "Baras" },
      { name: "Binangonan" },
      { name: "Cainta" },
      { name: "Jala-jala" },
      { name: "Morong" },
      { name: "Pililla" },
      { name: "San Mateo" },
      { name: "Tanay" },
      { name: "Taytay" },
    ],
  },
  {
    name: "Nueva Vizcaya",
    cities: [
      { name: "Bayombong", isCapital: true },
      { name: "Bambang" },
      { name: "Aritao" },
      { name: "Dupax del Norte" },
      { name: "Dupax del Sur" },
      { name: "Kasibu" },
    ],
  },
  {
    name: "Ifugao",
    cities: [
      { name: "Lagawe", isCapital: true },
      { name: "Banaue" },
      { name: "Kiangan" },
      { name: "Mayoyao" },
      { name: "Asipulo" },
    ],
  },
  {
    name: "Mountain Province",
    cities: [
      { name: "Bontoc", isCapital: true },
      { name: "Sagada" },
      { name: "Besao" },
      { name: "Barlig" },
    ],
  },
  {
    name: "Isabela",
    cities: [
      { name: "Ilagan City", isCapital: true },
      { name: "Cabanatuan" },
      { name: "Cauayan City" },
      { name: "Santiago City" },
      { name: "Cabanauan" },
    ],
  },
  {
    name: "Abra",
    cities: [
      { name: "Bangued", isCapital: true },
      { name: "Lagangilang" },
      { name: "Lacub" },
      { name: "Bucloc" },
      { name: "Dolores" },
    ],
  },
  {
    name: "Ilocos Norte",
    cities: [
      { name: "Laoag City", isCapital: true },
      { name: "Batac City" },
      { name: "Paoay" },
      { name: "Pagudpud" },
      { name: "San Nicolas" },
    ],
  },
  {
    name: "Ilocos Sur",
    cities: [
      { name: "Vigan City", isCapital: true },
      { name: "Candon City" },
      { name: "Santa Cruz" },
      { name: "Narvacan" },
      { name: "Cabugao" },
    ],
  },
  {
    name: "Davao Region",
    cities: [
      { name: "Davao City", isCapital: true },
      { name: "Tagum City" },
      { name: "Digos City" },
      { name: "Panabo City" },
      { name: "General Santos City" },
      { name: "Cotabato City" },
    ],
  },
];

/**
 * Get all provinces
 */
export const getProvinces = (): string[] => {
  return PHILIPPINES_LOCATIONS.map((p) => p.name);
};

/**
 * Get cities for a given province
 */
export const getCitiesByProvince = (provinceName: string): string[] => {
  const province = PHILIPPINES_LOCATIONS.find(
    (p) => p.name.toLowerCase() === provinceName.toLowerCase()
  );
  return province ? province.cities.map((c) => c.name) : [];
};

/**
 * Search provinces and cities by keyword
 * Returns format: "Province > City" or just "Province"
 */
export const searchLocations = (query: string): string[] => {
  if (!query.trim()) return [];

  const queryLower = query.toLowerCase();
  const results: string[] = [];
  const seen = new Set<string>();

  PHILIPPINES_LOCATIONS.forEach((province) => {
    const provinceLower = province.name.toLowerCase();

    // Province match (exact or contains)
    if (provinceLower.includes(queryLower) || provinceLower.startsWith(queryLower)) {
      const prov = province.name;
      if (!seen.has(prov)) {
        results.push(prov);
        seen.add(prov);
      }
    }

    // City match
    province.cities.forEach((city) => {
      const cityLower = city.name.toLowerCase();
      if (cityLower.includes(queryLower) || cityLower.startsWith(queryLower)) {
        const loc = `${province.name} > ${city.name}`;
        if (!seen.has(loc)) {
          results.push(loc);
          seen.add(loc);
        }
      }
    });
  });

  return results;
};

/**
 * Parse location string to get province and city
 * Formats: "Province" or "Province > City"
 */
export const parseLocation = (
  locationString: string
): { province: string; city?: string } => {
  const parts = locationString.split(">");
  return {
    province: parts[0].trim(),
    city: parts.length > 1 ? parts[1].trim() : undefined,
  };
};

/**
 * Find province name by a given city/municipality name
 */
export const getProvinceByCity = (cityName: string): string | undefined => {
  const target = cityName.trim().toLowerCase();
  for (const prov of PHILIPPINES_LOCATIONS) {
    if (prov.cities.some((c) => c.name.toLowerCase() === target)) {
      return prov.name;
    }
  }
  return undefined;
};

/**
 * Parse a full location string to province, city, and optional address.
 * Accepts formats:
 * - "Province > City > Address"
 * - "Province > City, Address"
 * - "City" (will infer province when possible)
 */
export const parseLocationDetailed = (
  locationString: string
): { province?: string; city?: string; address?: string } => {
  const raw = (locationString ?? "").trim();
  if (!raw) return {};
  const parts = raw.split(">").map((p) => p.trim()).filter(Boolean);
  let province = parts[0];
  let city = parts[1];
  let address: string | undefined;

  if (parts.length >= 3) {
    address = parts.slice(2).join(" > ");
  } else if (city && city.includes(",")) {
    const [c, ...rest] = city.split(",");
    city = c.trim();
    address = rest.join(",").trim() || undefined;
  } else if (!city && province && province.includes(",")) {
    const [provMaybe, ...rest] = province.split(",");
    province = provMaybe.trim();
    address = rest.join(",").trim() || undefined;
  }

  // If only a city was provided originally, infer province
  if (!city && province) {
    const maybeProv = getProvinceByCity(province);
    if (maybeProv) {
      city = province;
      province = maybeProv;
    }
  }

  return { province, city, address };
};
