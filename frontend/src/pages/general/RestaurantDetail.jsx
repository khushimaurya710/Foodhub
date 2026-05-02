import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { RESTAURANT_MENU } from '../../data/restaurants'

const SPICE_COLORS = { None:'#6B7280', Mild:'#10B981', Medium:'#F59E0B', Spicy:'#EF4444' }
const SPICE_LABELS = { None:'🌿 Mild', Mild:'🌱 Mild', Medium:'🌶 Medium', Spicy:'🔥 Spicy' }

/* ─── CSS ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #080705;
  --s1: #100F0C;
  --s2: #181512;
  --s3: #201D18;
  --s4: #2A2620;
  --border: rgba(255,255,255,0.07);
  --border2: rgba(255,255,255,0.13);
  --orange: #FF6B2B;
  --orange-dim: rgba(255,107,43,0.12);
  --orange-glow: rgba(255,107,43,0.28);
  --gold: #E8B84B;
  --green: #4ADE80;
  --text: #F0EAE0;
  --muted: rgba(240,234,224,0.48);
  --dim: rgba(240,234,224,0.22);
  --font-d: 'Syne', sans-serif;
  --font-b: 'DM Sans', sans-serif;
  --ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}

html { font-size: 16px; scroll-behavior: smooth; }

.rp { background: var(--bg); color: var(--text); font-family: var(--font-b); min-height: 100vh; }

/* ── HERO ── */
.rp-hero {
  position: relative; height: 420px; overflow: hidden;
}
.rp-hero-img {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  transform: scale(1.05);
  animation: heroZoom 12s ease-in-out infinite alternate;
}
@keyframes heroZoom { from { transform: scale(1.05); } to { transform: scale(1.12); } }
.rp-hero-shade {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(8,7,5,1) 0%, rgba(8,7,5,0.5) 50%, rgba(8,7,5,0.2) 100%);
}
.rp-hero-shade2 {
  position: absolute; inset: 0;
  background: linear-gradient(to right, rgba(8,7,5,0.7) 0%, transparent 60%);
}

.rp-back {
  position: absolute; top: 1.5rem; left: 1.5rem; z-index: 10;
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: rgba(8,7,5,0.6); border: 1px solid var(--border2);
  color: var(--text); padding: 0.5rem 1rem; border-radius: 100px;
  cursor: pointer; font-family: var(--font-b); font-size: 0.875rem;
  backdrop-filter: blur(10px);
  transition: all 0.25s var(--ease);
}
.rp-back:hover { background: rgba(255,107,43,0.15); border-color: var(--orange); color: var(--orange); transform: translateX(-3px); }

.rp-hero-info {
  position: absolute; bottom: 2.5rem; left: 3rem; z-index: 5;
  animation: fadeUp 0.7s var(--ease) both;
}
@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

.rp-hero-name {
  font-family: var(--font-d); font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800; line-height: 1; letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}
.rp-hero-cuisine { font-size: 0.9rem; color: var(--muted); margin-bottom: 1rem; font-weight: 300; }

.rp-hero-badges {
  display: flex; gap: 0.625rem; flex-wrap: wrap; align-items: center;
}
.rp-badge {
  display: inline-flex; align-items: center; gap: 0.35rem;
  background: rgba(8,7,5,0.65); border: 1px solid var(--border2);
  padding: 0.35rem 0.75rem; border-radius: 100px;
  font-size: 0.78rem; backdrop-filter: blur(8px);
  font-family: var(--font-b);
}
.rp-badge.rating { color: var(--gold); border-color: rgba(232,184,75,0.3); }
.rp-badge.open { color: var(--green); border-color: rgba(74,222,128,0.3); }
.rp-open-dot { width:6px; height:6px; border-radius:50%; background:var(--green); animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.3;transform:scale(0.6);} }

/* ── LAYOUT ── */
.rp-layout {
  max-width: 1200px; margin: 0 auto;
  padding: 0 2rem 8rem;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 2rem;
  align-items: start;
}

/* ── CATEGORY NAV ── */
.rp-catnav {
  position: sticky; top: 0; z-index: 50;
  background: rgba(8,7,5,0.92); border-bottom: 1px solid var(--border);
  backdrop-filter: blur(16px);
  padding: 0 2rem;
}
.rp-catnav-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; gap: 0; overflow-x: auto; scrollbar-width: none;
}
.rp-catnav-inner::-webkit-scrollbar { display:none; }
.cat-tab {
  background: none; border: none; border-bottom: 2px solid transparent;
  color: var(--muted); padding: 1rem 1.25rem;
  cursor: pointer; font-family: var(--font-b); font-size: 0.875rem;
  white-space: nowrap; flex-shrink: 0;
  transition: color 0.2s, border-color 0.2s;
}
.cat-tab:hover { color: var(--text); }
.cat-tab.active { color: var(--orange); border-bottom-color: var(--orange); }

/* ── MENU SECTION ── */
.rp-menu { padding-top: 2rem; }
.rp-section-label {
  font-size: 0.65rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.12em; color: var(--orange); margin-bottom: 0.5rem; display: block;
}
.rp-section-title {
  font-family: var(--font-d); font-size: 1.75rem; font-weight: 800;
  letter-spacing: -0.02em; margin-bottom: 1.5rem;
}

/* ── FOOD CARDS ── */
.food-grid {
  display: flex; flex-direction: column; gap: 1px;
}
.food-row {
  display: flex; align-items: stretch; gap: 0;
  background: var(--s2); border: 1px solid var(--border);
  border-radius: 16px; overflow: hidden;
  transition: all 0.3s var(--ease);
  cursor: pointer; position: relative;
  animation: rowIn 0.5s var(--ease) both;
  margin-bottom: 0.75rem;
}
.food-row:nth-child(1) { animation-delay:0.05s; }
.food-row:nth-child(2) { animation-delay:0.1s; }
.food-row:nth-child(3) { animation-delay:0.15s; }
.food-row:nth-child(4) { animation-delay:0.2s; }
.food-row:nth-child(5) { animation-delay:0.25s; }
.food-row:nth-child(6) { animation-delay:0.3s; }
@keyframes rowIn { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }

.food-row:hover {
  border-color: rgba(255,107,43,0.25);
  background: var(--s3);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,107,43,0.1);
  transform: translateX(4px);
}
.food-row::before {
  content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
  background:var(--orange); transform:scaleY(0); transform-origin:bottom;
  transition:transform 0.3s var(--ease);
}
.food-row:hover::before { transform:scaleY(1); }

.food-img-box {
  width: 130px; height: 130px; flex-shrink: 0;
  position: relative; overflow: hidden;
}
.food-img-box img {
  width:100%; height:100%; object-fit:cover; display:block;
  transition: transform 0.5s var(--ease);
}
.food-row:hover .food-img-box img { transform: scale(1.1); }

.food-badge {
  position: absolute; top: 0.5rem; left: 0.5rem;
  font-size: 0.58rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; padding: 0.2rem 0.5rem;
  border-radius: 4px; color: #fff;
  background: var(--orange);
}
.food-badge.chef { background: #8B5CF6; }

.food-info { flex: 1; padding: 1rem 1.25rem; display: flex; flex-direction: column; justify-content: space-between; }
.food-top-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.3rem; }
.food-name { font-weight: 600; font-size: 0.9375rem; font-family: var(--font-d); line-height: 1.3; }
.food-price { font-family: var(--font-d); font-size: 1.1rem; font-weight: 700; color: var(--text); flex-shrink: 0; }
.food-desc { font-size: 0.78rem; color: var(--muted); line-height: 1.55; margin-bottom: 0.75rem; font-weight: 300; }

.food-meta-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.875rem; flex-wrap: wrap; }
.food-spice { font-size: 0.68rem; font-weight: 500; padding: 0.2rem 0.5rem; border-radius: 100px; }
.food-kcal { font-size: 0.68rem; color: var(--dim); display: flex; align-items: center; gap: 0.2rem; }
.food-nutrition { display:flex; gap:0.875rem; }
.nutr-item { text-align:center; }
.nutr-val { font-size:0.7rem; font-weight:600; color:var(--text); display:block; }
.nutr-lbl { font-size:0.58rem; color:var(--dim); text-transform:uppercase; letter-spacing:0.05em; }

.food-actions { display: flex; align-items: center; gap: 0.625rem; }
.qty-control {
  display: flex; align-items: center; gap: 0;
  background: var(--s4); border: 1px solid var(--border2);
  border-radius: 100px; overflow: hidden;
}
.qty-btn {
  width: 30px; height: 30px; background: none; border: none;
  color: var(--text); cursor: pointer; font-size: 1rem;
  transition: background 0.2s, color 0.2s;
  display: flex; align-items: center; justify-content: center;
}
.qty-btn:hover { background: var(--orange); color: white; }
.qty-num { font-size: 0.875rem; font-weight: 600; min-width: 24px; text-align: center; }

.btn-add {
  display: inline-flex; align-items: center; gap: 0.35rem;
  background: var(--orange-dim); border: 1px solid rgba(255,107,43,0.3);
  color: var(--orange); padding: 0.45rem 1rem;
  border-radius: 100px; cursor: pointer;
  font-family: var(--font-b); font-size: 0.78rem; font-weight: 500;
  transition: all 0.25s var(--ease); white-space: nowrap;
}
.btn-add:hover { background: var(--orange); color: #fff; box-shadow: 0 4px 14px rgba(255,107,43,0.35); transform: scale(1.04); }
.btn-add.in-cart { background: var(--orange); color: #fff; }

.btn-now {
  display: inline-flex; align-items: center; gap: 0.35rem;
  background: var(--s4); border: 1px solid var(--border2);
  color: var(--text); padding: 0.45rem 0.875rem;
  border-radius: 100px; cursor: pointer;
  font-family: var(--font-b); font-size: 0.78rem;
  transition: all 0.25s var(--ease); white-space: nowrap;
}
.btn-now:hover { border-color: var(--border2); background: var(--s4); transform: scale(1.02); }

/* ── STICKY CART ── */
.cart-panel {
  position: sticky; top: 70px;
  background: var(--s2); border: 1px solid var(--border);
  border-radius: 20px; overflow: hidden;
  margin-top: 2rem;
  transition: box-shadow 0.3s;
}
.cart-panel.has-items {
  border-color: rgba(255,107,43,0.2);
  box-shadow: 0 0 0 1px rgba(255,107,43,0.1), 0 20px 40px rgba(0,0,0,0.4);
}
.cart-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.cart-title { font-family: var(--font-d); font-size: 1rem; font-weight: 700; }
.cart-count {
  background: var(--orange); color: #fff;
  width: 22px; height: 22px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; font-weight: 700;
}
.cart-empty {
  padding: 2.5rem 1.5rem; text-align: center;
}
.cart-empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
.cart-empty-text { font-size: 0.875rem; color: var(--muted); }

.cart-items { max-height: 340px; overflow-y: auto; padding: 0.75rem 0; scrollbar-width: thin; scrollbar-color: var(--border2) transparent; }
.cart-item {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.6rem 1.25rem;
  transition: background 0.2s;
}
.cart-item:hover { background: var(--s3); }
.ci-img { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.ci-info { flex: 1; min-width: 0; }
.ci-name { font-size: 0.78rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ci-price { font-size: 0.7rem; color: var(--orange); margin-top: 0.1rem; }
.ci-qty {
  display: flex; align-items: center; gap: 0;
  background: var(--s4); border: 1px solid var(--border);
  border-radius: 100px; overflow: hidden; flex-shrink: 0;
}
.ci-btn {
  width: 24px; height: 24px; background: none; border: none;
  color: var(--text); cursor: pointer; font-size: 0.875rem;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.ci-btn:hover { background: var(--orange); color: white; }
.ci-n { font-size: 0.75rem; font-weight: 600; min-width: 20px; text-align: center; }

.cart-footer { padding: 1rem 1.25rem; border-top: 1px solid var(--border); }
.cart-subtotal {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 0.5rem;
}
.cart-subtotal-label { font-size: 0.78rem; color: var(--muted); }
.cart-subtotal-val { font-family: var(--font-d); font-size: 1.1rem; font-weight: 700; }
.cart-taxes { font-size: 0.68rem; color: var(--dim); margin-bottom: 1rem; }
.btn-checkout {
  width: 100%; padding: 0.9rem;
  background: var(--orange); border: none; color: #fff;
  border-radius: 12px; cursor: pointer;
  font-family: var(--font-d); font-size: 0.9375rem; font-weight: 700;
  transition: all 0.25s var(--ease); position: relative; overflow: hidden;
}
.btn-checkout::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 55%); opacity:0; transition:opacity 0.25s; }
.btn-checkout:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(255,107,43,0.4); }
.btn-checkout:hover::after { opacity:1; }
.btn-checkout:disabled { opacity:0.4; cursor:not-allowed; transform:none; box-shadow:none; }
.btn-clear { width:100%; margin-top:0.5rem; padding:0.5rem; background:none; border:none; color:var(--dim); cursor:pointer; font-size:0.75rem; font-family:var(--font-b); transition:color 0.2s; }
.btn-clear:hover { color:var(--muted); }

/* ── CHECKOUT MODAL ── */
.co-backdrop {
  position: fixed; inset: 0; z-index: 999;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(6px);
  display: flex; align-items: flex-end; justify-content: center;
  animation: fadeIn 0.2s ease both;
}
@keyframes fadeIn { from{opacity:0;}to{opacity:1;} }

.co-sheet {
  background: var(--s2); border: 1px solid var(--border2);
  border-radius: 24px 24px 0 0; width: 100%; max-width: 720px;
  max-height: 92vh; overflow-y: auto;
  animation: sheetUp 0.35s var(--bounce) both;
  scrollbar-width: thin; scrollbar-color: var(--border2) transparent;
}
@keyframes sheetUp { from{transform:translateY(100%);}to{transform:translateY(0);} }

.co-drag { width:40px; height:4px; background:var(--border2); border-radius:2px; margin:1rem auto 0; }
.co-head { display:flex; align-items:center; justify-content:space-between; padding:1.25rem 2rem; border-bottom:1px solid var(--border); }
.co-title { font-family:var(--font-d); font-size:1.25rem; font-weight:800; }
.co-close { width:32px; height:32px; background:var(--s3); border:1px solid var(--border); border-radius:50%; cursor:pointer; color:var(--text); font-size:0.875rem; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
.co-close:hover { background:var(--orange); border-color:var(--orange); }

.co-body { display:grid; grid-template-columns:1fr 1fr; gap:2rem; padding:2rem; }

.co-section-title { font-family:var(--font-d); font-size:0.9375rem; font-weight:700; margin-bottom:1rem; }

/* Order summary */
.co-items { display:flex; flex-direction:column; gap:0.625rem; margin-bottom:1.25rem; }
.co-item { display:flex; align-items:center; gap:0.75rem; padding:0.625rem; background:var(--s3); border-radius:10px; }
.co-item img { width:36px; height:36px; border-radius:6px; object-fit:cover; flex-shrink:0; }
.co-item-info { flex:1; min-width:0; }
.co-item-name { font-size:0.78rem; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.co-item-qty { font-size:0.68rem; color:var(--muted); }
.co-item-price { font-size:0.85rem; font-weight:600; flex-shrink:0; font-family:var(--font-d); }

.co-divider { height:1px; background:var(--border); margin:0.75rem 0; }
.co-total-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem; }
.co-total-lbl { font-size:0.8rem; color:var(--muted); }
.co-total-val { font-family:var(--font-d); font-size:1.3rem; font-weight:800; color:var(--orange); }

/* Payment form */
.co-form { display:flex; flex-direction:column; gap:1rem; }
.co-label { display:flex; flex-direction:column; gap:0.4rem; font-size:0.78rem; color:var(--muted); font-weight:500; text-transform:uppercase; letter-spacing:0.05em; }
.co-input, .co-textarea {
  background: var(--s3); border: 1px solid var(--border2);
  color: var(--text); border-radius: 10px; padding: 0.75rem 1rem;
  font-family: var(--font-b); font-size: 0.9rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none; width: 100%;
}
.co-input:focus, .co-textarea:focus { border-color: var(--orange); box-shadow: 0 0 0 3px rgba(255,107,43,0.12); }
.co-row2 { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
.co-textarea { resize: vertical; min-height: 80px; }
.co-pay-btn {
  width:100%; padding:1rem; background:var(--orange); border:none; color:#fff;
  border-radius:12px; cursor:pointer;
  font-family:var(--font-d); font-size:1rem; font-weight:700;
  transition:all 0.25s var(--ease); position:relative; overflow:hidden;
}
.co-pay-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 55%); opacity:0; transition:opacity 0.25s; }
.co-pay-btn:hover { transform:translateY(-2px); box-shadow:0 12px 30px rgba(255,107,43,0.45); }
.co-pay-btn:hover::after { opacity:1; }
.co-pay-btn:disabled { opacity:0.4; cursor:not-allowed; transform:none; box-shadow:none; }
.co-secure { display:flex; align-items:center; gap:0.4rem; justify-content:center; margin-top:0.5rem; font-size:0.7rem; color:var(--dim); }

/* Mobile cart bar */
.cart-bar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
  background: var(--s2); border-top: 1px solid rgba(255,107,43,0.25);
  padding: 1rem 1.5rem;
  display: none;
  justify-content: space-between; align-items: center;
  backdrop-filter: blur(12px);
  animation: barUp 0.35s var(--bounce) both;
}
@keyframes barUp { from{transform:translateY(100%);}to{transform:translateY(0);} }
.cart-bar-left { display:flex; flex-direction:column; gap:0.15rem; }
.cart-bar-count { font-size:0.75rem; color:var(--muted); }
.cart-bar-total { font-family:var(--font-d); font-size:1.1rem; font-weight:800; }
.cart-bar-btn { background:var(--orange); border:none; color:#fff; padding:0.75rem 1.75rem; border-radius:100px; cursor:pointer; font-family:var(--font-d); font-weight:700; font-size:0.9rem; transition:all 0.25s; }
.cart-bar-btn:hover { box-shadow:0 8px 20px rgba(255,107,43,0.4); }

/* SUCCESS */
.success-overlay {
  position: fixed; inset: 0; z-index: 9999;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease both;
}
.success-card {
  background: var(--s2); border: 1px solid rgba(74,222,128,0.3);
  border-radius: 24px; padding: 3rem 2.5rem; text-align: center; max-width: 380px; width: 90%;
  animation: scaleIn 0.4s var(--bounce) both;
}
@keyframes scaleIn { from{opacity:0;transform:scale(0.8);}to{opacity:1;transform:scale(1);} }
.success-icon { font-size: 3.5rem; margin-bottom: 1rem; }
.success-title { font-family:var(--font-d); font-size:1.5rem; font-weight:800; margin-bottom:0.5rem; }
.success-sub { font-size:0.875rem; color:var(--muted); margin-bottom:2rem; line-height:1.6; }
.success-btn { background:var(--orange); border:none; color:#fff; padding:0.875rem 2rem; border-radius:100px; cursor:pointer; font-family:var(--font-d); font-weight:700; font-size:0.9375rem; transition:all 0.25s; }
.success-btn:hover { box-shadow:0 8px 24px rgba(255,107,43,0.4); transform:translateY(-2px); }

/* Responsive */
@media (max-width: 900px) {
  .rp-layout { grid-template-columns: 1fr; padding: 0 1rem 6rem; }
  .cart-panel { display: none; }
  .cart-bar { display: flex; }
  .rp-hero-info { left: 1.5rem; bottom: 1.5rem; }
  .co-body { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .food-img-box { width: 100px; height: 100px; }
  .food-info { padding: 0.75rem 1rem; }
  .food-nutrition { display: none; }
}
`

export default function RestaurantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const restaurant = RESTAURANT_MENU[id]
  const [cart, setCart] = useState([])
  const [activeCat, setActiveCat] = useState('All')
  const [showCheckout, setShowCheckout] = useState(false)
  const [success, setSuccess] = useState(false)
  const [addedId, setAddedId] = useState(null)

  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart])
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart])

  const getQty = (id) => cart.find(i => i.id === id)?.qty || 0

  const addToCart = (food, e) => {
    e?.stopPropagation()
    setAddedId(food.id)
    setTimeout(() => setAddedId(null), 600)
    setCart(prev => {
      const ex = prev.find(i => i.id === food.id)
      if (ex) return prev.map(i => i.id === food.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...food, qty: 1 }]
    })
  }

  const removeOne = (id, e) => {
    e?.stopPropagation()
    setCart(prev => {
      const ex = prev.find(i => i.id === id)
      if (!ex) return prev
      if (ex.qty === 1) return prev.filter(i => i.id !== id)
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
    })
  }

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const handlePay = (e) => {
    e.preventDefault()
    setShowCheckout(false)
    setSuccess(true)
  }

  const filtered = activeCat === 'All'
    ? restaurant?.foods
    : restaurant?.foods.filter(f => f.cat === activeCat)

  if (!restaurant) return (
    <div style={{ background:'var(--bg)', color:'var(--text)', padding:'4rem 2rem', minHeight:'100vh', fontFamily:'sans-serif' }}>
      <button onClick={() => navigate(-1)} style={{ background:'none', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'0.5rem 1rem', borderRadius:'100px', cursor:'pointer', marginBottom:'1rem' }}>← Back</button>
      <p>Restaurant not found.</p>
    </div>
  )

  return (
    <>
      <style>{CSS}</style>
      <div className="rp">

        {/* HERO */}
        <div className="rp-hero">
          <div className="rp-hero-img" style={{ backgroundImage: `url(${restaurant.heroImage})` }} />
          <div className="rp-hero-shade" /><div className="rp-hero-shade2" />
          <button className="rp-back" onClick={() => navigate(-1)}>← Back</button>
          <div className="rp-hero-info">
            <div className="rp-hero-name">{restaurant.name}</div>
            <div className="rp-hero-cuisine">{restaurant.cuisine} · {restaurant.area}</div>
            <div className="rp-hero-badges">
              <span className="rp-badge rating">★ {restaurant.rating} ({restaurant.reviews} reviews)</span>
              <span className="rp-badge">🕐 {restaurant.eta}</span>
              <span className="rp-badge">{restaurant.costForTwo}</span>
              <span className="rp-badge open"><span className="rp-open-dot" />Open now</span>
            </div>
          </div>
        </div>

        {/* CATEGORY NAV */}
        <div className="rp-catnav">
          <div className="rp-catnav-inner">
            {restaurant.categories.map(c => (
              <button key={c} className={`cat-tab${activeCat === c ? ' active' : ''}`} onClick={() => setActiveCat(c)}>{c}</button>
            ))}
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="rp-layout">

          {/* MENU */}
          <section className="rp-menu">
            <span className="rp-section-label">Menu</span>
            <h2 className="rp-section-title">{activeCat === 'All' ? 'All dishes' : activeCat}</h2>
            <div className="food-grid">
              {filtered.map(food => {
                const qty = getQty(food.id)
                const inCart = qty > 0
                return (
                  <div key={food.id} className="food-row" onClick={() => addToCart(food)}>
                    <div className="food-img-box">
                      <img src={food.image} alt={food.name} loading="lazy" />
                      {food.badge && (
                        <div className={`food-badge${food.badge === "Chef's Pick" ? ' chef' : ''}`}>{food.badge}</div>
                      )}
                    </div>
                    <div className="food-info">
                      <div>
                        <div className="food-top-row">
                          <div className="food-name">{food.name}</div>
                          <div className="food-price">₹{food.price}</div>
                        </div>
                        <div className="food-desc">{food.desc}</div>
                        <div className="food-meta-row">
                          <span className="food-spice" style={{ color: SPICE_COLORS[food.spice], background: `${SPICE_COLORS[food.spice]}18` }}>
                            {SPICE_LABELS[food.spice]}
                          </span>
                          <span className="food-kcal">🔥 {food.nutrition.calories} kcal</span>
                          <div className="food-nutrition">
                            {Object.entries({ P: food.nutrition.protein, C: food.nutrition.carbs, F: food.nutrition.fat }).map(([k,v]) => (
                              <div key={k} className="nutr-item">
                                <span className="nutr-val">{v}</span>
                                <span className="nutr-lbl">{k}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="food-actions" onClick={e => e.stopPropagation()}>
                        {inCart ? (
                          <div className="qty-control">
                            <button className="qty-btn" onClick={e => removeOne(food.id, e)}>−</button>
                            <span className="qty-num">{qty}</span>
                            <button className="qty-btn" onClick={e => addToCart(food, e)}>+</button>
                          </div>
                        ) : (
                          <button className={`btn-add${addedId === food.id ? ' in-cart' : ''}`} onClick={e => addToCart(food, e)}>
                            {addedId === food.id ? '✓ Added' : '+ Add'}
                          </button>
                        )}
                        <button className="btn-now" onClick={e => { addToCart(food, e); setShowCheckout(true) }}>
                          Order now
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* CART PANEL */}
          <aside>
            <div className={`cart-panel${cart.length > 0 ? ' has-items' : ''}`}>
              <div className="cart-header">
                <span className="cart-title">Your Cart</span>
                {cart.length > 0 && <span className="cart-count">{cartCount}</span>}
              </div>
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">🛒</div>
                  <div className="cart-empty-text">Your cart is empty. Add something delicious!</div>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <img className="ci-img" src={item.image} alt={item.name} />
                        <div className="ci-info">
                          <div className="ci-name">{item.name}</div>
                          <div className="ci-price">₹{item.price * item.qty}</div>
                        </div>
                        <div className="ci-qty">
                          <button className="ci-btn" onClick={() => removeOne(item.id)}>−</button>
                          <span className="ci-n">{item.qty}</span>
                          <button className="ci-btn" onClick={() => addToCart(item)}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="cart-footer">
                    <div className="cart-subtotal">
                      <span className="cart-subtotal-label">Subtotal</span>
                      <span className="cart-subtotal-val">₹{total}</span>
                    </div>
                    <div className="cart-taxes">+ ₹{Math.round(total * 0.05)} taxes &amp; fees</div>
                    <button className="btn-checkout" onClick={() => setShowCheckout(true)}>
                      Proceed to checkout →
                    </button>
                    <button className="btn-clear" onClick={() => setCart([])}>Clear cart</button>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>

        {/* MOBILE CART BAR */}
        {cart.length > 0 && (
          <div className="cart-bar">
            <div className="cart-bar-left">
              <span className="cart-bar-count">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
              <span className="cart-bar-total">₹{total}</span>
            </div>
            <button className="cart-bar-btn" onClick={() => setShowCheckout(true)}>Checkout →</button>
          </div>
        )}

        {/* CHECKOUT MODAL */}
        {showCheckout && (
          <div className="co-backdrop" onClick={e => e.target === e.currentTarget && setShowCheckout(false)}>
            <div className="co-sheet">
              <div className="co-drag" />
              <div className="co-head">
                <span className="co-title">Checkout</span>
                <button className="co-close" onClick={() => setShowCheckout(false)}>✕</button>
              </div>
              <div className="co-body">
                {/* ORDER SUMMARY */}
                <div>
                  <div className="co-section-title">Order summary</div>
                  <div className="co-items">
                    {cart.map(item => (
                      <div key={item.id} className="co-item">
                        <img src={item.image} alt={item.name} />
                        <div className="co-item-info">
                          <div className="co-item-name">{item.name}</div>
                          <div className="co-item-qty">× {item.qty}</div>
                        </div>
                        <div className="co-item-price">₹{item.price * item.qty}</div>
                      </div>
                    ))}
                  </div>
                  <div className="co-divider" />
                  <div className="co-total-row"><span className="co-total-lbl">Subtotal</span><span style={{fontSize:'0.875rem',fontFamily:'var(--font-d)'}}>₹{total}</span></div>
                  <div className="co-total-row"><span className="co-total-lbl">Taxes &amp; fees (5%)</span><span style={{fontSize:'0.875rem',fontFamily:'var(--font-d)'}}>₹{Math.round(total*0.05)}</span></div>
                  <div className="co-total-row"><span className="co-total-lbl">Delivery</span><span style={{fontSize:'0.875rem',fontFamily:'var(--font-d)',color:'var(--green)'}}>Free</span></div>
                  <div className="co-divider" />
                  <div className="co-total-row">
                    <span style={{fontFamily:'var(--font-d)',fontWeight:700}}>Total</span>
                    <span className="co-total-val">₹{total + Math.round(total*0.05)}</span>
                  </div>
                </div>

                {/* PAYMENT FORM */}
                <form className="co-form" onSubmit={handlePay}>
                  <div className="co-section-title">Payment details</div>
                  <label className="co-label">
                    Card number
                    <input className="co-input" type="text" inputMode="numeric" placeholder="4242 4242 4242 4242" required />
                  </label>
                  <div className="co-row2">
                    <label className="co-label">Expiry<input className="co-input" type="text" placeholder="MM/YY" required /></label>
                    <label className="co-label">CVV<input className="co-input" type="password" inputMode="numeric" maxLength={4} placeholder="•••" required /></label>
                  </div>
                  <label className="co-label">
                    Delivery address
                    <textarea className="co-textarea" rows={3} placeholder="Flat / building, street, landmark, city" required />
                  </label>
                  <button type="submit" className="co-pay-btn">
                    Pay ₹{total + Math.round(total*0.05)} securely
                  </button>
                  <div className="co-secure">🔒 256-bit SSL encrypted · Demo only, no real charge</div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="success-overlay">
            <div className="success-card">
              <div className="success-icon">🎉</div>
              <div className="success-title">Order placed!</div>
              <div className="success-sub">Your food is being prepared. Estimated delivery in {restaurant.eta}. You'll get a confirmation shortly.</div>
              <button className="success-btn" onClick={() => { setSuccess(false); setCart([]); navigate(-1) }}>Back to home</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}