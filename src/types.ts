export interface Comp {
  [key: string]: unknown
  id: string
  propertyName: string | null
  address: string | null
  city: string | null
  county: string | null
  state: string | null
  zipCode: string | null
  zoningDescription: string | null
  seller: string | null
  buyer: string | null
  saleDate: string | null
  salePrice: number | null
  acres: number | null
  units: number | null
  saleRemarks: string | null
  propertyRemarks: string | null
  latitude: number | null
  longitude: number | null
}

export interface FieldDef {
  key: string
  label: string
  type: 'text' | 'money' | 'number' | 'int' | 'date'
  col: boolean
  pk?: boolean
  short?: boolean
  derived?: boolean
}

export interface Filter {
  field: string
  op: string
  val: string
  val2?: string
}

export interface SortState {
  key: string
  dir: 'asc' | 'desc'
}

export type ToastKind = 'ok' | 'warn' | 'err'

export interface ToastItem {
  id: string
  msg: string
  kind: ToastKind
}

export type ModalState =
  | { mode: 'add' }
  | { mode: 'edit'; comp: Comp }
  | null
