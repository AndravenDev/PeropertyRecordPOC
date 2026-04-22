import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import './App.css'
import {
  FIELDS, FIELD_MAP, COL_DEFS, SEED,
  fmtMoney, fmtNum, fmtInt, fmtDate,
  computeDerived, getView, uid, csvExport, STORAGE_KEY,
} from './data'
import type { Comp, Filter, SortState, ToastItem, ToastKind, ModalState } from './types'

// ─── Icons ────────────────────────────────────────────────────────────────────
const IcoSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
  </svg>
)
const IcoFilter = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M3 5h18M6 12h12M10 19h4"/>
  </svg>
)
const IcoExport = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14"/>
  </svg>
)
const IcoPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M12 5v14M5 12h14"/>
  </svg>
)
const IcoClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M6 6l12 12M18 6l-12 12"/>
  </svg>
)
const IcoEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h8M4 20v-4L16 4l4 4L8 20H4z"/>
  </svg>
)
const IcoTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"/>
  </svg>
)
const IcoTable = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="40" height="40">
    <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M8 5v14"/>
  </svg>
)
const IcoCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13l4 4L19 7"/>
  </svg>
)

// ─── Toasts ───────────────────────────────────────────────────────────────────
function Toasts({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="toasts">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.kind}`}>
          <IcoCheck />{t.msg}
        </div>
      ))}
    </div>
  )
}

// ─── Filter Popover ───────────────────────────────────────────────────────────
const TEXT_OPS: [string, string][] = [
  ['contains', 'contains'], ['equals', 'equals'], ['starts', 'starts with'],
  ['notEmpty', 'has value'], ['empty', 'is empty'],
]
const NUM_OPS: [string, string][] = [
  ['eq', '='], ['gt', '>'], ['lt', '<'], ['gte', '≥'], ['lte', '≤'],
  ['between', 'between'], ['notEmpty', 'has value'], ['empty', 'is empty'],
]
const DATE_OPS: [string, string][] = [
  ['eq', 'on'], ['gt', 'after'], ['lt', 'before'],
  ['between', 'between'], ['notEmpty', 'has value'], ['empty', 'is empty'],
]

function FilterPopover({
  anchor, onClose, onApply,
}: {
  anchor: { top: number; left: number }
  onClose: () => void
  onApply: (f: Filter) => void
}) {
  const [field, setField] = useState(FIELDS[0].key)
  const [op, setOp] = useState('')
  const [val, setVal] = useState('')
  const [val2, setVal2] = useState('')

  const fd = FIELD_MAP[field]
  const ops = fd.type === 'text' ? TEXT_OPS : fd.type === 'date' ? DATE_OPS : NUM_OPS

  useEffect(() => {
    setOp(ops[0][0])
    setVal('')
    setVal2('')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field])

  useEffect(() => {
    setVal('')
    setVal2('')
  }, [op])

  const inputType = fd.type === 'date' ? 'date' : fd.type === 'text' ? 'text' : 'number'
  const showVal = !['notEmpty', 'empty'].includes(op)
  const showVal2 = op === 'between'

  return (
    <>
      <div className="popover-scrim" onClick={onClose} />
      <div className="popover" style={{ top: anchor.top, left: anchor.left }}>
        <h4>Filter records</h4>
        <div className="row">
          <select value={field} onChange={e => setField(e.target.value)}>
            {FIELDS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
          </select>
          <select value={op} onChange={e => setOp(e.target.value)}>
            {ops.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        {(showVal || showVal2) && (
          <div className="row">
            {showVal && (
              <input
                type={inputType}
                value={val}
                onChange={e => setVal(e.target.value)}
                placeholder="Value"
                autoFocus
              />
            )}
            {showVal2 && (
              <input
                type={inputType}
                value={val2}
                onChange={e => setVal2(e.target.value)}
                placeholder="Max"
              />
            )}
          </div>
        )}
        <div className="foot">
          <button className="btn sm ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn sm primary"
            onClick={() => { onApply({ field, op, val, val2 }); onClose() }}
          >
            Apply
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Modal (Add / Edit) ───────────────────────────────────────────────────────
type FormValues = Record<string, string>

const EMPTY_FORM: FormValues = {
  propertyName: '', zoningDescription: '', address: '', city: '',
  county: '', state: '', zipCode: '', latitude: '', longitude: '',
  seller: '', buyer: '', saleDate: '', salePrice: '', acres: '', units: '',
  saleRemarks: '', propertyRemarks: '',
}

function compToForm(c: Comp): FormValues {
  return {
    propertyName:      c.propertyName      ?? '',
    zoningDescription: c.zoningDescription ?? '',
    address:           c.address           ?? '',
    city:              c.city              ?? '',
    county:            c.county            ?? '',
    state:             c.state             ?? '',
    zipCode:           c.zipCode           ?? '',
    latitude:          c.latitude  != null ? String(c.latitude)  : '',
    longitude:         c.longitude != null ? String(c.longitude) : '',
    seller:            c.seller            ?? '',
    buyer:             c.buyer             ?? '',
    saleDate:          c.saleDate          ?? '',
    salePrice:         c.salePrice != null ? String(c.salePrice) : '',
    acres:             c.acres     != null ? String(c.acres)     : '',
    units:             c.units     != null ? String(c.units)     : '',
    saleRemarks:       c.saleRemarks       ?? '',
    propertyRemarks:   c.propertyRemarks   ?? '',
  }
}

function CompModal({
  modalState, onClose, onSave,
}: {
  modalState: ModalState
  onClose: () => void
  onSave: (data: Omit<Comp, 'id'>, id?: string) => void
}) {
  const [form, setForm] = useState<FormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [formError, setFormError] = useState('')
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!modalState) return
    if (modalState.mode === 'edit') {
      setForm(compToForm(modalState.comp))
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
    setFormError('')
    setTimeout(() => firstInputRef.current?.focus(), 60)
  }, [modalState])

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let v = e.target.value
    if (key === 'state') v = v.toUpperCase()
    setForm(f => ({ ...f, [key]: v }))
  }

  const sp = parseFloat(form.salePrice) || 0
  const ac = parseFloat(form.acres) || 0
  const un = parseFloat(form.units) || 0
  const derivedPPA = sp > 0 && ac > 0 ? Math.round(sp / ac).toLocaleString('en-US') : ''
  const derivedPPU = sp > 0 && un > 0 ? Math.round(sp / un).toLocaleString('en-US') : ''

  function handleSave() {
    const required = ['propertyName', 'address', 'city', 'state']
    const errs: Record<string, boolean> = {}
    for (const k of required) {
      if (!form[k].trim()) errs[k] = true
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setFormError('Please fill required fields.')
      return
    }
    setErrors({})
    setFormError('')
    const data: Omit<Comp, 'id'> = {
      propertyName:      form.propertyName.trim()      || null,
      zoningDescription: form.zoningDescription.trim() || null,
      address:           form.address.trim()           || null,
      city:              form.city.trim()              || null,
      county:            form.county.trim()            || null,
      state:             form.state.trim().toUpperCase() || null,
      zipCode:           form.zipCode.trim()           || null,
      latitude:          form.latitude  ? parseFloat(form.latitude)  : null,
      longitude:         form.longitude ? parseFloat(form.longitude) : null,
      seller:            form.seller.trim()            || null,
      buyer:             form.buyer.trim()             || null,
      saleDate:          form.saleDate                 || null,
      salePrice:         form.salePrice ? parseFloat(String(form.salePrice).replace(/[,$]/g, '')) : null,
      acres:             form.acres  ? parseFloat(form.acres)  : null,
      units:             form.units  ? parseInt(form.units, 10) : null,
      saleRemarks:       form.saleRemarks.trim()       || null,
      propertyRemarks:   form.propertyRemarks.trim()   || null,
    }
    const id = modalState?.mode === 'edit' ? modalState.comp.id : undefined
    onSave(data, id)
  }

  if (!modalState) return null

  const isEdit = modalState.mode === 'edit'
  const title  = isEdit ? 'Edit comp' : 'Add comp'
  const sub    = isEdit
    ? `Editing "${modalState.comp.propertyName || 'record'}"`
    : 'Enter the property details. Fields marked * are required.'

  return (
    <div className="modal-scrim" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" role="dialog" aria-labelledby="modal-title">
        <div className="modal-head">
          <h2 id="modal-title">{title}</h2>
          <span className="sub">{sub}</span>
          <div className="spacer" />
          <button className="btn ghost" onClick={onClose} aria-label="Close"><IcoClose /></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">

            <div className="form-section-title">Property</div>
            <div className={`field col-2${errors.propertyName ? ' has-error' : ''}`}>
              <label>Property Name *</label>
              <input ref={firstInputRef} value={form.propertyName} onChange={set('propertyName')} placeholder="e.g. Maple Ridge Apartments" />
            </div>
            <div className="field col-2">
              <label>Zoning Description</label>
              <input value={form.zoningDescription} onChange={set('zoningDescription')} placeholder="e.g. R-4 Multi-family" />
            </div>

            <div className={`field col-2${errors.address ? ' has-error' : ''}`}>
              <label>Address *</label>
              <input value={form.address} onChange={set('address')} placeholder="1200 W Main St" />
            </div>
            <div className={`field col-2${errors.city ? ' has-error' : ''}`}>
              <label>City / Municipality *</label>
              <input value={form.city} onChange={set('city')} placeholder="Boulder" />
            </div>

            <div className="field">
              <label>County</label>
              <input value={form.county} onChange={set('county')} placeholder="Boulder" />
            </div>
            <div className={`field${errors.state ? ' has-error' : ''}`}>
              <label>State *</label>
              <input value={form.state} onChange={set('state')} maxLength={2} placeholder="CO" style={{ textTransform: 'uppercase' }} />
            </div>
            <div className="field">
              <label>Zip Code</label>
              <input value={form.zipCode} onChange={set('zipCode')} placeholder="80301" />
            </div>
            <div className="field">
              <label>Lat / Lng</label>
              <div className="latlong-wrap">
                <input
                  className="mono"
                  value={form.latitude}
                  onChange={set('latitude')}
                  placeholder="40.0150"
                  inputMode="decimal"
                />
                <input
                  className="mono"
                  value={form.longitude}
                  onChange={set('longitude')}
                  placeholder="-105.2705"
                  inputMode="decimal"
                />
              </div>
            </div>

            <div className="form-section-title">Transaction</div>
            <div className="field">
              <label>Seller</label>
              <input value={form.seller} onChange={set('seller')} placeholder="Meridian Holdings LLC" />
            </div>
            <div className="field">
              <label>Buyer</label>
              <input value={form.buyer} onChange={set('buyer')} placeholder="Aspen Capital Partners" />
            </div>
            <div className="field">
              <label>Sale Date</label>
              <input type="date" value={form.saleDate} onChange={set('saleDate')} />
            </div>
            <div className="field">
              <label>Sale Price</label>
              <div className="prefix">
                <span className="p">$</span>
                <input className="mono" value={form.salePrice} onChange={set('salePrice')} inputMode="decimal" placeholder="0" />
              </div>
            </div>

            <div className="field">
              <label>Number of Acres</label>
              <input className="mono" value={form.acres} onChange={set('acres')} inputMode="decimal" placeholder="0.00" />
            </div>
            <div className="field">
              <label>Number of Units</label>
              <input className="mono" value={form.units} onChange={set('units')} inputMode="numeric" placeholder="0" />
            </div>
            <div className="field">
              <label>
                Price / Acre{' '}
                <span className="hint" style={{ textTransform: 'none' }}>auto</span>
              </label>
              <div className="prefix">
                <span className="p">$</span>
                <input className="readonly-input" value={derivedPPA} readOnly tabIndex={-1} />
              </div>
            </div>
            <div className="field">
              <label>
                Price / Unit{' '}
                <span className="hint" style={{ textTransform: 'none' }}>auto</span>
              </label>
              <div className="prefix">
                <span className="p">$</span>
                <input className="readonly-input" value={derivedPPU} readOnly tabIndex={-1} />
              </div>
            </div>

            <div className="form-section-title">Remarks</div>
            <div className="field col-2">
              <label>Sale Remarks</label>
              <textarea value={form.saleRemarks} onChange={set('saleRemarks')} placeholder="Arm's-length transaction, financed via…" />
            </div>
            <div className="field col-2">
              <label>Property Remarks</label>
              <textarea value={form.propertyRemarks} onChange={set('propertyRemarks')} placeholder="Class B garden-style, built 1998, …" />
            </div>

          </div>
        </div>
        <div className="modal-foot">
          <span style={{ color: 'var(--danger)', fontSize: 11 }}>{formError}</span>
          <div className="spacer" />
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={handleSave}>Save comp</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
  const [rows, setRows] = useState<Comp[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    return SEED.map(r => ({ id: uid(), ...r } as Comp))
  })
  const [sort, setSort] = useState<SortState>({ key: 'saleDate', dir: 'desc' })
  const [filters, setFilters] = useState<Filter[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [modal, setModal] = useState<ModalState>(null)
  const [popoverAnchor, setPopoverAnchor] = useState<{ top: number; left: number } | null>(null)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // Persist to localStorage whenever rows change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)) } catch {}
  }, [rows])

  const view = useMemo(() => getView(rows, search, filters, sort), [rows, search, filters, sort])

  // ─ Toast helper
  const toast = useCallback((msg: string, kind: ToastKind = 'ok') => {
    const id = uid()
    setToasts(t => [...t, { id, msg, kind }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800)
  }, [])

  // ─ Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setModal(null); setPopoverAnchor(null) }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') { e.preventDefault(); setModal({ mode: 'add' }) }
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') { e.preventDefault(); handleExport() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view])

  // ─ Save (add/edit)
  function handleSave(data: Omit<Comp, 'id'>, editId?: string) {
    if (editId) {
      setRows(rs => rs.map(r => r.id === editId ? ({ id: editId, ...data } as Comp) : r))
      toast(`Updated "${data.propertyName}"`, 'ok')
    } else {
      setRows(rs => [({ id: uid(), ...data } as Comp), ...rs])
      toast(`Added "${data.propertyName}"`, 'ok')
    }
    setModal(null)
  }

  // ─ Delete single
  function handleDelete(id: string) {
    const r = rows.find(x => x.id === id)
    if (!r) return
    if (!window.confirm(`Delete "${r.propertyName}"? This cannot be undone.`)) return
    setRows(rs => rs.filter(x => x.id !== id))
    setSelected(s => { const ns = new Set(s); ns.delete(id); return ns })
    toast('Record deleted', 'warn')
  }

  // ─ Delete selected
  function handleDeleteSelected() {
    const n = selected.size
    if (n === 0) return
    if (!window.confirm(`Delete ${n} record${n === 1 ? '' : 's'}? This cannot be undone.`)) return
    setRows(rs => rs.filter(r => !selected.has(r.id)))
    setSelected(new Set())
    toast(`${n} record${n === 1 ? '' : 's'} deleted`, 'warn')
  }

  // ─ Export
  function handleExport() {
    if (view.length === 0) { toast('No rows to export', 'warn'); return }
    csvExport(view)
    toast(`Exported ${view.length} rows`, 'ok')
  }

  // ─ Reset
  function handleReset() {
    if (!window.confirm('Reset to seed data? This will replace all current records.')) return
    const fresh = SEED.map(r => ({ id: uid(), ...r } as Comp))
    setRows(fresh)
    setSelected(new Set())
    setFilters([])
    setSearch('')
    toast('Data reset to seed', 'ok')
  }

  // ─ Sorting
  function handleSort(key: string) {
    setSort(s => s.key === key
      ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
      : { key, dir: 'asc' }
    )
  }

  // ─ Selection helpers
  const visibleSelected = view.filter(r => selected.has(r.id)).length
  const allSelected = view.length > 0 && visibleSelected === view.length
  const someSelected = visibleSelected > 0 && visibleSelected < view.length

  const ckAllRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ckAllRef.current) {
      ckAllRef.current.indeterminate = someSelected
    }
  }, [someSelected])

  function handleSelectAll(checked: boolean) {
    setSelected(s => {
      const ns = new Set(s)
      if (checked) view.forEach(r => ns.add(r.id))
      else view.forEach(r => ns.delete(r.id))
      return ns
    })
  }

  function handleSelectRow(id: string, checked: boolean) {
    setSelected(s => {
      const ns = new Set(s)
      checked ? ns.add(id) : ns.delete(id)
      return ns
    })
  }

  // ─ Filter chip labels
  const OP_LABELS: Record<string, string> = {
    contains: 'contains', equals: '=', starts: 'starts',
    notEmpty: 'has value', empty: 'is empty',
    eq: '=', gt: '>', lt: '<', gte: '≥', lte: '≤', between: 'between',
  }

  // ─ Summary stats
  const totalVal   = view.reduce((s, r) => s + (Number(r.salePrice) || 0), 0)
  const totalUnits = view.reduce((s, r) => s + (Number(r.units) || 0), 0)
  const avgAcres   = view.length ? view.reduce((s, r) => s + (Number(r.acres) || 0), 0) / view.length : 0

  // ─ Cell renderer
  function cellContent(r: Comp, fkey: string) {
    const f = FIELD_MAP[fkey]
    if (!f) return null
    const d = computeDerived(r)
    const v = f.derived ? (d as Record<string, unknown>)[fkey] : (r as Record<string, unknown>)[fkey]

    if (fkey === 'propertyName') return (
      <>
        <div>{r.propertyName || '—'}</div>
        <div className="sub mono">
          {r.latitude ? Number(r.latitude).toFixed(4) : '—'}, {r.longitude ? Number(r.longitude).toFixed(4) : '—'}
        </div>
      </>
    )
    if (fkey === 'address') {
      const loc = [r.city, r.state].filter(Boolean).join(', ')
      return (
        <>
          <div>{r.address || '—'}</div>
          <div className="sub">{loc}{r.zipCode ? ` · ${r.zipCode}` : ''}</div>
        </>
      )
    }
    if (fkey === 'city')              return r.city || '—'
    if (fkey === 'state')             return <span className="tag mono">{r.state || '—'}</span>
    if (fkey === 'zoningDescription') return r.zoningDescription ? <span className="tag">{r.zoningDescription}</span> : '—'
    if (f.type === 'money')           return <span className="mono">{fmtMoney(v as number)}</span>
    if (f.type === 'number')          return <span className="mono">{fmtNum(v as number)}</span>
    if (f.type === 'int')             return <span className="mono">{fmtInt(v as number)}</span>
    if (f.type === 'date')            return <span className="mono">{fmtDate(v as string)}</span>
    return String(v ?? '—')
  }

  return (
    <div className="app">

      {/* ── Top bar ── */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" />
          <div className="brand-name">Comps</div>
          <div className="brand-sub">Property Records · POC</div>
        </div>
        <div className="spacer" />
        <div className="meta">Connected to <b>localStorage</b> · ready</div>
      </header>

      {/* ── Toolbar ── */}
      <div className="toolbar">
        <div className="search">
          <IcoSearch />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, address, seller, buyer…"
          />
        </div>
        <button
          className="btn"
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            setPopoverAnchor({ top: rect.bottom + 6, left: Math.max(10, rect.left) })
          }}
        >
          <IcoFilter /> Add filter
        </button>
        <div className="divider" />
        <button className="btn" onClick={handleExport}><IcoExport /> Export CSV</button>
        <div className="spacer" />
        <button className="btn ghost" onClick={handleReset}>Reset data</button>
        <button className="btn primary" onClick={() => setModal({ mode: 'add' })}>
          <IcoPlus /> Add comp
        </button>
      </div>

      {/* ── Filter chips ── */}
      <div className="filter-bar">
        <span className="label">Filters</span>
        {filters.map((f, i) => {
          const fd = FIELD_MAP[f.field]
          const opLbl = OP_LABELS[f.op] ?? f.op
          const valLbl = ['notEmpty', 'empty'].includes(f.op) ? '' : f.op === 'between' ? `${f.val} – ${f.val2}` : f.val
          return (
            <span key={i} className="chip">
              <span className="k">{fd?.label}</span>
              {' '}{opLbl}{' '}
              {valLbl && <b>{valLbl}</b>}
              <button
                title="Remove"
                onClick={() => setFilters(fs => fs.filter((_, j) => j !== i))}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6l12 12M18 6L6 18"/>
                </svg>
              </button>
            </span>
          )
        })}
        <button
          className="filter-add"
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            setPopoverAnchor({ top: rect.bottom + 6, left: Math.max(10, rect.left) })
          }}
        >
          + Filter
        </button>
      </div>

      {/* ── Table ── */}
      <main>
        <div className="panel">
          <div className="table-wrap">
            <table className="comps">
              <thead>
                <tr>
                  <th style={{ width: 28, paddingLeft: 16 }}>
                    <input
                      ref={ckAllRef}
                      type="checkbox"
                      className="ck"
                      checked={allSelected}
                      onChange={e => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  {COL_DEFS.map(f => {
                    const isNum = f.type === 'money' || f.type === 'number' || f.type === 'int'
                    const sorted = sort.key === f.key
                    const ind = sorted ? (sort.dir === 'asc' ? '▲' : '▼') : '↕'
                    return (
                      <th
                        key={f.key}
                        className={`${isNum ? 'num' : ''} ${sorted ? 'sorted' : ''}`}
                        data-key={f.key}
                      >
                        <span className="th-inner" onClick={() => handleSort(f.key)}>
                          <span>{f.label}</span>
                          <span className="sort-ind">{ind}</span>
                        </span>
                      </th>
                    )
                  })}
                  <th className="actions" />
                </tr>
              </thead>
              <tbody>
                {view.map(r => {
                  const sel = selected.has(r.id)
                  return (
                    <tr
                      key={r.id}
                      className={sel ? 'selected' : ''}
                      onDoubleClick={() => setModal({ mode: 'edit', comp: r })}
                    >
                      <td style={{ paddingLeft: 16, width: 28 }}>
                        <input
                          type="checkbox"
                          className="ck row-ck"
                          checked={sel}
                          onChange={e => handleSelectRow(r.id, e.target.checked)}
                        />
                      </td>
                      {COL_DEFS.map(f => {
                        const isNum = f.type === 'money' || f.type === 'number' || f.type === 'int'
                        return (
                          <td
                            key={f.key}
                            className={[
                              isNum ? 'num' : '',
                              f.key === 'propertyName' ? 'name' : '',
                              f.key === 'address' ? 'addr' : '',
                            ].filter(Boolean).join(' ')}
                          >
                            {cellContent(r, f.key)}
                          </td>
                        )
                      })}
                      <td className="actions">
                        <div className="row-actions">
                          <button title="Edit" onClick={() => setModal({ mode: 'edit', comp: r })}>
                            <IcoEdit />
                          </button>
                          <button title="Delete" className="del" onClick={() => handleDelete(r.id)}>
                            <IcoTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {view.length === 0 && (
              <div className="empty">
                <IcoTable />
                <h3>No records match your filters</h3>
                <p>Try clearing filters or adding a new comparable.</p>
                <button
                  className="btn primary"
                  onClick={() => { setFilters([]); setSearch('') }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* ── Footer bar ── */}
          <div className="footer-bar">
            <span><b>{view.length}</b> of <b>{rows.length}</b> records</span>
            <span className={`selection-bar${selected.size > 0 ? ' show' : ''}`}>
              <span>{selected.size} selected</span>
              <button
                className="btn sm"
                style={{ background: 'transparent', border: '1px solid rgba(90,90,42,.3)', color: 'var(--accent)' }}
                onClick={() => setSelected(new Set())}
              >
                Clear
              </button>
              <button className="btn sm danger" onClick={handleDeleteSelected}>
                <IcoTrash /> Delete
              </button>
            </span>
            <div className="spacer" />
            <span className="mono" style={{ fontSize: 12 }}>
              Σ {fmtMoney(totalVal)} · {totalUnits.toLocaleString()} units · avg {fmtNum(avgAcres, 2)} ac
            </span>
          </div>
        </div>
      </main>

      {/* ── Modal ── */}
      <CompModal
        modalState={modal}
        onClose={() => setModal(null)}
        onSave={handleSave}
      />

      {/* ── Filter popover ── */}
      {popoverAnchor && (
        <FilterPopover
          anchor={popoverAnchor}
          onClose={() => setPopoverAnchor(null)}
          onApply={f => setFilters(fs => [...fs, f])}
        />
      )}

      {/* ── Toasts ── */}
      <Toasts toasts={toasts} />

    </div>
  )
}

export default App
