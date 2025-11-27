import { format, toZonedTime } from 'date-fns-tz'

export interface TimezoneOption {
  label: string
  value: string
  offset: string
}

// Get ALL IANA timezones dynamically
export function getAllTimezones(): TimezoneOption[] {
  // Modern browsers support this
  if (typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl) {
    try {
      // @ts-ignore - supportedValuesOf is available in ES2022+
      const allTimezones = Intl.supportedValuesOf('timeZone') as string[]
      
      return allTimezones.map(tz => {
        const offset = getTimezoneOffset(tz)
        return {
          label: formatTimezoneLabel(tz, offset),
          value: tz,
          offset
        }
      }).sort((a, b) => {
        // Sort by offset first, then by name
        const offsetA = parseOffset(a.offset)
        const offsetB = parseOffset(b.offset)
        if (offsetA !== offsetB) return offsetA - offsetB
        return a.label.localeCompare(b.label)
      })
    } catch (e) {
      console.warn('Could not get timezones:', e)
    }
  }
  
  // Fallback to manual list
  return getManualTimezones()
}

// Get timezone offset in format like "+01:00" or "-05:00"
function getTimezoneOffset(timezone: string): string {
  try {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset'
    })
    
    const parts = formatter.formatToParts(now)
    const offsetPart = parts.find(part => part.type === 'timeZoneName')
    
    if (offsetPart?.value && offsetPart.value.startsWith('GMT')) {
      return offsetPart.value.replace('GMT', '')
    }
    
    return '+00:00'
  } catch {
    return '+00:00'
  }
}

// Format timezone label nicely
function formatTimezoneLabel(timezone: string, offset: string): string {
  const city = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone
  return `(GMT${offset}) ${city}`
}

// Parse offset string to minutes for sorting
function parseOffset(offset: string): number {
  if (!offset) return 0
  const sign = offset.startsWith('-') ? -1 : 1
  const [hours, minutes] = offset.replace(/[+-]/, '').split(':').map(Number)
  return sign * (hours * 60 + (minutes || 0))
}

// Get user's current timezone
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'UTC'
  }
}

// Fallback manual list if browser doesn't support supportedValuesOf
function getManualTimezones(): TimezoneOption[] {
  const zones = [
    'Pacific/Midway', 'Pacific/Honolulu', 'America/Anchorage',
    'America/Los_Angeles', 'America/Denver', 'America/Chicago',
    'America/New_York', 'America/Halifax', 'America/Argentina/Buenos_Aires',
    'Atlantic/Azores', 'Europe/London', 'Europe/Lisbon', 'Europe/Paris',
    'Europe/Athens', 'Europe/Moscow', 'Asia/Dubai', 'Asia/Kolkata',
    'Asia/Bangkok', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney',
    'Pacific/Auckland', 'UTC'
  ]
  
  return zones.map(tz => {
    const offset = getTimezoneOffset(tz)
    return {
      label: formatTimezoneLabel(tz, offset),
      value: tz,
      offset
    }
  })
}