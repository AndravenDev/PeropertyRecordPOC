import type { FieldDef, Comp, Filter, SortState } from './types'

export const FIELDS: FieldDef[] = [
  { key: 'propertyName',      label: 'Property Name',     type: 'text',   col: true,  pk: true },
  { key: 'address',           label: 'Address',           type: 'text',   col: true },
  { key: 'city',              label: 'City/Municipality', type: 'text',   col: true },
  { key: 'county',            label: 'County',            type: 'text',   col: false },
  { key: 'state',             label: 'State',             type: 'text',   col: true,  short: true },
  { key: 'zipCode',           label: 'Zip Code',          type: 'text',   col: false },
  { key: 'zoningDescription', label: 'Zoning',            type: 'text',   col: true },
  { key: 'seller',            label: 'Seller',            type: 'text',   col: false },
  { key: 'buyer',             label: 'Buyer',             type: 'text',   col: false },
  { key: 'saleDate',          label: 'Sale Date',         type: 'date',   col: true },
  { key: 'salePrice',         label: 'Sale Price',        type: 'money',  col: true },
  { key: 'acres',             label: 'Acres',             type: 'number', col: true },
  { key: 'units',             label: 'Units',             type: 'int',    col: true },
  { key: 'pricePerAcre',      label: 'Price / Acre',      type: 'money',  col: true,  derived: true },
  { key: 'pricePerUnit',      label: 'Price / Unit',      type: 'money',  col: true,  derived: true },
  { key: 'saleRemarks',       label: 'Sale Remarks',      type: 'text',   col: false },
  { key: 'propertyRemarks',   label: 'Property Remarks',  type: 'text',   col: false },
  { key: 'latitude',          label: 'Latitude',          type: 'number', col: false },
  { key: 'longitude',         label: 'Longitude',         type: 'number', col: false },
]

export const FIELD_MAP: Record<string, FieldDef> = Object.fromEntries(
  FIELDS.map(f => [f.key, f])
)

export const COL_DEFS = FIELDS.filter(f => f.col)

export const SEED: Omit<Comp, 'id'>[] = [
  { propertyName: 'Maple Ridge Apartments', address: '1200 W Main St', city: 'Boulder', county: 'Boulder', state: 'CO', zipCode: '80301', zoningDescription: 'R-4 Multi-family', seller: 'Meridian Holdings LLC', buyer: 'Aspen Capital Partners', saleDate: '2025-08-14', salePrice: 18750000, acres: 3.4, units: 84, saleRemarks: "Arm's-length, conventional financing.", propertyRemarks: 'Class B garden-style, built 1998, renovated 2019.', latitude: 40.0150, longitude: -105.2705 },
  { propertyName: 'Cedar Point Plaza', address: '455 N Commerce Blvd', city: 'Fort Collins', county: 'Larimer', state: 'CO', zipCode: '80525', zoningDescription: 'C-G Commercial', seller: 'Cedar Point LP', buyer: 'Horizon Retail Trust', saleDate: '2025-06-02', salePrice: 9250000, acres: 2.1, units: 22, saleRemarks: 'All-cash transaction, 30-day close.', propertyRemarks: 'Strip retail center, anchored by regional grocer.', latitude: 40.5853, longitude: -105.0844 },
  { propertyName: 'Westwind Industrial', address: '3821 Factory Rd', city: 'Commerce City', county: 'Adams', state: 'CO', zipCode: '80022', zoningDescription: 'I-2 Heavy Industrial', seller: 'Westwind Industrial LLC', buyer: 'BlackRidge Logistics', saleDate: '2025-03-19', salePrice: 32400000, acres: 12.8, units: 4, saleRemarks: 'Sale-leaseback with 15yr NNN.', propertyRemarks: 'Four-building logistics park, 320k sqft total.', latitude: 39.8083, longitude: -104.9339 },
  { propertyName: 'The Orchard Lofts', address: '77 Apple St', city: 'Denver', county: 'Denver', state: 'CO', zipCode: '80205', zoningDescription: 'U-MX-3 Mixed Use', seller: 'Orchard LP', buyer: 'Summit Residential', saleDate: '2024-11-28', salePrice: 14900000, acres: 0.9, units: 52, saleRemarks: 'Off-market transaction.', propertyRemarks: 'Adaptive reuse, former cannery, 2021 conversion.', latitude: 39.7617, longitude: -104.9816 },
  { propertyName: 'Bluebird Mobile Home Park', address: '210 County Rd 34', city: 'Longmont', county: 'Boulder', state: 'CO', zipCode: '80504', zoningDescription: 'MH Manufactured Housing', seller: 'Bluebird Holdings', buyer: 'RV Communities Inc.', saleDate: '2025-01-10', salePrice: 6400000, acres: 8.5, units: 68, saleRemarks: 'Seller financing, 5yr balloon.', propertyRemarks: 'Stabilized park, 96% occupancy.', latitude: 40.1672, longitude: -105.1019 },
  { propertyName: 'Foothills Office Park', address: '2900 Valmont Rd', city: 'Boulder', county: 'Boulder', state: 'CO', zipCode: '80301', zoningDescription: 'BC-1 Business', seller: 'Foothills Realty Trust', buyer: 'Granite Office LLC', saleDate: '2025-09-22', salePrice: 21500000, acres: 4.7, units: 3, saleRemarks: 'Competitive bid, 6 offers.', propertyRemarks: 'Three Class A office buildings, 84% leased.', latitude: 40.0273, longitude: -105.2427 },
  { propertyName: 'Tallgrass Ranch (Raw Land)', address: 'CR 42 & Hwy 287', city: 'Berthoud', county: 'Larimer', state: 'CO', zipCode: '80513', zoningDescription: 'A-1 Agricultural', seller: 'Kessler Family Trust', buyer: 'Tallgrass Land Co.', saleDate: '2024-12-05', salePrice: 4200000, acres: 142, units: null, saleRemarks: 'Development play, annex pending.', propertyRemarks: 'Irrigated pasture, water rights included.', latitude: 40.3083, longitude: -105.0811 },
  { propertyName: 'Crescent Self-Storage', address: '1501 E Prospect', city: 'Fort Collins', county: 'Larimer', state: 'CO', zipCode: '80525', zoningDescription: 'C-C Community Commercial', seller: 'Crescent Storage LLC', buyer: 'Vault Portfolio Fund III', saleDate: '2025-05-07', salePrice: 11800000, acres: 3.2, units: 612, saleRemarks: 'Portfolio acquisition, 1 of 4.', propertyRemarks: 'Climate-controlled units, built 2015.', latitude: 40.5736, longitude: -105.0472 },
  { propertyName: 'Harbor Walk Condos', address: '88 Marina Way', city: 'Grand Lake', county: 'Grand', state: 'CO', zipCode: '80447', zoningDescription: 'R-3 Resort Residential', seller: 'Harbor Walk LP', buyer: 'Alpine Resort Holdings', saleDate: '2025-07-18', salePrice: 8600000, acres: 1.6, units: 24, saleRemarks: 'Bulk sale of remaining developer units.', propertyRemarks: 'Lakefront, HOA-managed, short-term rental friendly.', latitude: 40.2525, longitude: -105.8228 },
  { propertyName: 'Copper Canyon Retail', address: '1820 S Broadway', city: 'Englewood', county: 'Arapahoe', state: 'CO', zipCode: '80113', zoningDescription: 'MU-B Mixed Use', seller: 'Copper Canyon Realty', buyer: 'Broadway Retail LLC', saleDate: '2025-02-25', salePrice: 5350000, acres: 0.7, units: 8, saleRemarks: '1031 exchange buyer.', propertyRemarks: 'Small-bay retail, national credit tenants.', latitude: 39.6466, longitude: -104.9881 },
  { propertyName: 'Pine Hollow Townhomes', address: '455 Pine Ln', city: 'Golden', county: 'Jefferson', state: 'CO', zipCode: '80401', zoningDescription: 'R-2 Residential', seller: 'Pine Hollow LLC', buyer: 'Caldera Capital', saleDate: '2024-10-14', salePrice: 12200000, acres: 2.8, units: 36, saleRemarks: 'Marketed by broker, 45-day DD.', propertyRemarks: '2018 construction, stabilized.', latitude: 39.7555, longitude: -105.2211 },
  { propertyName: 'Gateway Medical Plaza', address: '700 Medical Dr', city: 'Aurora', county: 'Arapahoe', state: 'CO', zipCode: '80012', zoningDescription: 'MO Medical Office', seller: 'Gateway Medical Group', buyer: 'HealthCore REIT', saleDate: '2025-04-30', salePrice: 27800000, acres: 3.9, units: 14, saleRemarks: 'Institutional buyer, all-cash.', propertyRemarks: 'Class A MOB, 100% leased, WALT 8.2yr.', latitude: 39.7294, longitude: -104.8319 },
]

export const fmtMoney = (v: number | null | undefined): string =>
  v == null ? '—' : '$' + Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })

export const fmtNum = (v: number | null | undefined, d = 2): string =>
  v == null ? '—' : Number(v).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })

export const fmtInt = (v: number | null | undefined): string =>
  v == null ? '—' : Number(v).toLocaleString('en-US')

export const fmtDate = (v: string | null | undefined): string => {
  if (!v) return '—'
  const d = new Date(v)
  if (isNaN(d.getTime())) return v
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
}

export function computeDerived(r: Comp): { pricePerAcre: number | null; pricePerUnit: number | null } {
  const sp = Number(r.salePrice)
  const ac = Number(r.acres)
  const un = Number(r.units)
  return {
    pricePerAcre: sp > 0 && ac > 0 ? Math.round(sp / ac) : null,
    pricePerUnit: sp > 0 && un > 0 ? Math.round(sp / un) : null,
  }
}

function passesFilter(r: Comp, f: Filter): boolean {
  const fd = FIELD_MAP[f.field]
  let v: unknown = (r as Record<string, unknown>)[f.field]
  if (fd?.derived) {
    v = computeDerived(r)[f.field as 'pricePerAcre' | 'pricePerUnit']
  }
  if (!fd) return true
  if (fd.type === 'text' || fd.type === 'date') {
    const s = (v ?? '').toString().toLowerCase()
    const q = (f.val ?? '').toString().toLowerCase()
    switch (f.op) {
      case 'contains': return s.includes(q)
      case 'equals':   return s === q
      case 'starts':   return s.startsWith(q)
      case 'notEmpty': return s.length > 0
      case 'empty':    return s.length === 0
    }
  } else {
    const n = Number(v)
    const a = Number(f.val)
    const b = Number(f.val2)
    if (v == null || v === '' || isNaN(n)) return f.op === 'empty'
    switch (f.op) {
      case 'eq':      return n === a
      case 'gt':      return n > a
      case 'lt':      return n < a
      case 'gte':     return n >= a
      case 'lte':     return n <= a
      case 'between': return n >= Math.min(a, b) && n <= Math.max(a, b)
      case 'notEmpty':return true
      case 'empty':   return false
    }
  }
  return true
}

export function getView(rows: Comp[], search: string, filters: Filter[], sort: SortState): Comp[] {
  let result = rows.slice()
  if (search.trim()) {
    const q = search.toLowerCase()
    result = result.filter(r =>
      ['propertyName', 'address', 'city', 'county', 'seller', 'buyer', 'zoningDescription', 'zipCode', 'state']
        .some(k => ((r as Record<string, unknown>)[k] ?? '').toString().toLowerCase().includes(q))
    )
  }
  for (const f of filters) result = result.filter(r => passesFilter(r, f))
  const { key, dir } = sort
  const fd = FIELD_MAP[key]
  result.sort((a, b) => {
    const va: unknown = fd?.derived
      ? computeDerived(a)[key as 'pricePerAcre' | 'pricePerUnit']
      : (a as Record<string, unknown>)[key]
    const vb: unknown = fd?.derived
      ? computeDerived(b)[key as 'pricePerAcre' | 'pricePerUnit']
      : (b as Record<string, unknown>)[key]
    if (fd?.type === 'money' || fd?.type === 'number' || fd?.type === 'int') {
      const na = va == null || va === '' ? -Infinity : Number(va)
      const nb = vb == null || vb === '' ? -Infinity : Number(vb)
      return dir === 'asc' ? na - nb : nb - na
    }
    if (fd?.type === 'date') {
      const da = va ? new Date(va as string).getTime() : 0
      const db = vb ? new Date(vb as string).getTime() : 0
      return dir === 'asc' ? da - db : db - da
    }
    const sa = (va ?? '').toString().toLowerCase()
    const sb = (vb ?? '').toString().toLowerCase()
    if (sa < sb) return dir === 'asc' ? -1 : 1
    if (sa > sb) return dir === 'asc' ? 1 : -1
    return 0
  })
  return result
}

export function uid(): string {
  return 'c_' + Math.random().toString(36).slice(2, 10)
}

export function csvExport(rows: Comp[]): void {
  const escape = (v: unknown): string => {
    if (v == null) return ''
    const s = String(v)
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const headers = FIELDS.map(f => f.label)
  const lines = [headers.map(escape).join(',')]
  for (const r of rows) {
    const d = computeDerived(r)
    const vals = FIELDS.map(f => f.derived ? (d as Record<string, unknown>)[f.key] : (r as Record<string, unknown>)[f.key])
    lines.push(vals.map(escape).join(','))
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comps_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
