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
