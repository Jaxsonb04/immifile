"use strict";

import InternationalizedDatePackage from "../../optional/internationalized-date.js";
const {
  CalendarDate,
  parseDate
} = InternationalizedDatePackage ?? {};
/**
 * Formats a calendar date as `dd/mm/yyyy` (fixed display for `DateField` input).
 */
export function formatCalendarDateDdMmYyyy(date) {
  const dd = String(date.day).padStart(2, '0');
  const mm = String(date.month).padStart(2, '0');
  const yyyy = String(date.year);
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Strips non-digits and caps at eight digits (ddmmyyyy) for masked entry.
 */
export function extractDateDigits(text) {
  return text.replace(/\D/g, '').slice(0, 8);
}

/**
 * Builds a `dd/mm/yyyy` string from up to eight digits (day, month, year groups).
 *
 * When **typing forward**, inserts a slash as soon as a 2-digit segment is complete (`11` → `11/`,
 * four digits → `dd/mm/`) so separators appear without typing `/`.
 *
 * When **deleting** (shorter raw text or fewer digits than before), formats **without** trailing
 * slashes so the user can backspace through `11/` → `11` → `1` and `11/03/` → `11/03` → … .
 *
 * @param text - Current `TextInput` value (may include `/` or not).
 * @param previousFormatted - Last committed mask string from state; used to detect deletion.
 */
export function formatDigitsToDdMmYyyyMask(text, previousFormatted = '') {
  const d = extractDateDigits(text);
  const prevDigits = extractDateDigits(previousFormatted);
  const isDeletion = text.length < previousFormatted.length || d.length < prevDigits.length;
  if (isDeletion) {
    if (d.length === 0) {
      return '';
    }
    if (d.length === 1) {
      return d;
    }
    if (d.length === 2) {
      return d;
    }
    if (d.length === 3) {
      return `${d.slice(0, 2)}/${d.slice(2)}`;
    }
    if (d.length === 4) {
      return `${d.slice(0, 2)}/${d.slice(2, 4)}`;
    }
    return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  }
  if (d.length === 0) {
    return '';
  }
  if (d.length === 1) {
    return d;
  }
  if (d.length === 2) {
    return `${d}/`;
  }
  if (d.length === 3) {
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  }
  if (d.length === 4) {
    return `${d.slice(0, 2)}/${d.slice(2, 4)}/`;
  }
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/**
 * Parses a strict `dd/mm/yyyy` string (day and month may be one or two digits).
 *
 * @returns `CalendarDate` when valid, otherwise `undefined`.
 */
export function tryParseDdMmYyyy(text) {
  const t = text.trim();
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(t);
  if (!m) {
    return undefined;
  }
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return undefined;
  }
  try {
    return new CalendarDate(year, month, day);
  } catch {
    return undefined;
  }
}

/**
 * Lenient date-string parsing for app code (not used by `DateField` loose mode, which does not parse on blur).
 * Supported inputs:
 *
 * - ISO `yyyy-mm-dd` via `parseDate`
 * - `dd/mm/yyyy` or `dd-mm-yyyy` (day-first)
 * - `yyyy/mm/dd` or `yyyy-mm-dd` with slashes (ISO-style with slashes)
 *
 * Two-digit years are expanded: `00-69` → `2000-2069`, else `1900-1969`.
 *
 * @returns `CalendarDate` when a supported string parses cleanly, otherwise `undefined`.
 */
export function tryParseLooseDateString(text) {
  const t = text.trim();
  if (t === '') {
    return undefined;
  }
  try {
    return parseDate(t);
  } catch {
    // Continue with pattern-based parsing.
  }
  const dmY = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(t);
  if (dmY) {
    const day = Number(dmY[1]);
    const month = Number(dmY[2]);
    const year = Number(dmY[3]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      try {
        return new CalendarDate(year, month, day);
      } catch {
        return undefined;
      }
    }
  }
  const yMd = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(t);
  if (yMd) {
    const year = Number(yMd[1]);
    const month = Number(yMd[2]);
    const day = Number(yMd[3]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      try {
        return new CalendarDate(year, month, day);
      } catch {
        return undefined;
      }
    }
  }
  const twoDigitYear = /^(\d{1,2})[-/](\d{1,2})[-/](\d{2})$/.exec(t);
  if (twoDigitYear) {
    const day = Number(twoDigitYear[1]);
    const month = Number(twoDigitYear[2]);
    let year = Number(twoDigitYear[3]);
    year += year <= 69 ? 2000 : 1900;
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      try {
        return new CalendarDate(year, month, day);
      } catch {
        return undefined;
      }
    }
  }
  return undefined;
}