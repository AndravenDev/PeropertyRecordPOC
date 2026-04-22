import { createClient } from '@supabase/supabase-js'
import type { Comp } from './types'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_KEY as string

export const supabase = createClient(url, key)

// DB row (snake_case) → Comp (camelCase)
export function rowToComp(row: Record<string, unknown>): Comp {
  return {
    id:               String(row.id),
    propertyName:     (row.property_name       as string | null) ?? null,
    address:          (row.address             as string | null) ?? null,
    city:             (row.city                as string | null) ?? null,
    county:           (row.county              as string | null) ?? null,
    state:            (row.state               as string | null) ?? null,
    zipCode:          (row.zip_code            as string | null) ?? null,
    zoningDescription:(row.zoning_description  as string | null) ?? null,
    seller:           (row.seller              as string | null) ?? null,
    buyer:            (row.buyer               as string | null) ?? null,
    saleDate:         (row.sale_date           as string | null) ?? null,
    salePrice:        row.sale_price  != null ? Number(row.sale_price)  : null,
    acres:            row.acres       != null ? Number(row.acres)       : null,
    units:            row.units       != null ? Number(row.units)       : null,
    saleRemarks:      (row.sale_remarks        as string | null) ?? null,
    propertyRemarks:  (row.property_remarks    as string | null) ?? null,
    latitude:         row.latitude    != null ? Number(row.latitude)    : null,
    longitude:        row.longitude   != null ? Number(row.longitude)   : null,
  }
}

// Comp (camelCase) → DB row (snake_case) for insert/update
export function compToRow(comp: Omit<Comp, 'id'>): Record<string, unknown> {
  return {
    property_name:      comp.propertyName,
    address:            comp.address,
    city:               comp.city,
    county:             comp.county,
    state:              comp.state,
    zip_code:           comp.zipCode,
    zoning_description: comp.zoningDescription,
    seller:             comp.seller,
    buyer:              comp.buyer,
    sale_date:          comp.saleDate   || null,
    sale_price:         comp.salePrice,
    acres:              comp.acres,
    units:              comp.units,
    sale_remarks:       comp.saleRemarks,
    property_remarks:   comp.propertyRemarks,
    latitude:           comp.latitude,
    longitude:          comp.longitude,
  }
}
