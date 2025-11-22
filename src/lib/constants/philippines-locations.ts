import { PHILIPPINES_LOCATIONS } from "@/resources/locations/philippines";
import type { Province } from "@/lib/models/location";

/**
 * Get all provinces
 */
export const getProvinces = (): string[] =>
  PHILIPPINES_LOCATIONS.map((p) => p.name);

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
 */
export const searchLocations = (query: string): string[] => {
  if (!query.trim()) return [];

  const q = query.toLowerCase();
  const results = new Set<string>();

  PHILIPPINES_LOCATIONS.forEach((province) => {
    const provLower = province.name.toLowerCase();
    if (provLower.includes(q) || provLower.startsWith(q)) {
      results.add(province.name);
    }

    province.cities.forEach((city) => {
      const cityLower = city.name.toLowerCase();
      if (cityLower.includes(q) || cityLower.startsWith(q)) {
        results.add(`${province.name} > ${city.name}`);
      }
    });
  });

  return [...results];
};

/**
 * Parse "Province > City"
 */
export const parseLocation = (locationString: string) => {
  const parts = locationString.split(">");

  return {
    province: parts[0].trim(),
    city: parts[1]?.trim(),
  };
};

