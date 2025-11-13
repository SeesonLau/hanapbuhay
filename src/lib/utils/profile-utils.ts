export const NAME_DELIMITER = " | ";

/**
 * Splits a stored name into first and last name components
 * @param storedName - Name from database (format: "FirstName | LastName")
 * @returns Object with firstName and lastName
 */
export function parseStoredName(storedName: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  if (!storedName) {
    return { firstName: "", lastName: "" };
  }

  if (storedName.includes(NAME_DELIMITER)) {
    const [first, last] = storedName.split(NAME_DELIMITER);
    return {
      firstName: first?.trim() || "",
      lastName: last?.trim() || ""
    };
  }

  // Fallback for names without delimiter
  const lastSpaceIndex = storedName.lastIndexOf(" ");
  if (lastSpaceIndex === -1) {
    return {
      firstName: storedName.trim(),
      lastName: ""
    };
  }

  return {
    firstName: storedName.substring(0, lastSpaceIndex).trim(),
    lastName: storedName.substring(lastSpaceIndex + 1).trim()
  };
}

/**
 * Combines first and last name into stored format
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Combined name with delimiter (format: "FirstName | LastName")
 */
export function combineToStoredName(firstName: string, lastName: string): string {
  return `${firstName.trim()}${NAME_DELIMITER}${lastName.trim()}`;
}

/**
 * Formats a stored name for display (removes delimiter)
 * Takes only first 2 words from first name part
 * @param storedName - Name from database (format: "FirstName | LastName")
 * @returns Formatted display name
 */
export function formatDisplayName(storedName: string | null | undefined): string {
  if (!storedName) {
    return "";
  }

  if (storedName.includes(NAME_DELIMITER)) {
    const [firstPart, lastPart] = storedName.split(NAME_DELIMITER);
    
    // Get only first 2 words from first name part
    const firstNameWords = firstPart?.trim().split(/\s+/) || [];
    const truncatedFirstName = firstNameWords.slice(0, 2).join(" ");
    
    const lastName = lastPart?.trim() || "";
    
    return `${truncatedFirstName} ${lastName}`.trim();
  }

  // Fallback for names without delimiter - just return as is
  return storedName.trim();
}