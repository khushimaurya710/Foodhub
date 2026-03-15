import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

/* ─── Real dish data — prices from Zomato/Swiggy listings ─── */
const DISHES = [
  {
    id: 1,
    name: 'Hyderabadi Dum Biryani',
    restaurant: 'Paradise Kitchen',
    category: 'Biryani',
    price: 349,
    originalPrice: 420,
    rating: 4.8,
    orders: '9.1Cr+',
    eta: '28 min',
    tag: '#1 in India',
    tagColor: '#FF6B2B',
    image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 2,
    name: 'Margherita Wood-Fire Pizza',
    restaurant: 'La Piazza',
    category: 'Pizza',
    price: 299,
    originalPrice: 380,
    rating: 4.5,
    orders: '5.8Cr+',
    eta: '22 min',
    tag: '#2 Most Ordered',
    tagColor: '#E8B84B',
    image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 3,
    name: 'Classic Smash Burger',
    restaurant: 'Urban Burger Co.',
    category: 'Burger',
    price: 229,
    originalPrice: 280,
    rating: 4.4,
    orders: '2.3Cr+',
    eta: '20 min',
    tag: 'Trending',
    tagColor: '#6ECFBA',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 4,
    name: 'Butter Chicken + Naan',
    restaurant: 'Punjabi Dhaba',
    category: 'North Indian',
    price: 389,
    originalPrice: 460,
    rating: 4.7,
    orders: '4.5Cr+',
    eta: '30 min',
    tag: 'Fan Favourite',
    tagColor: '#E84A7F',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 5,
    name: 'Masala Dosa',
    restaurant: 'Saravana Bhavan',
    category: 'South Indian',
    price: 149,
    originalPrice: 180,
    rating: 4.6,
    orders: '2.3Cr+',
    eta: '18 min',
    tag: 'Breakfast Hit',
    tagColor: '#8B5CF6',
    image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 6,
    name: 'Peri Peri Noodle Bowl',
    restaurant: 'Wok & Roll',
    category: 'Noodles',
    price: 199,
    originalPrice: 250,
    rating: 4.3,
    orders: '4.5Cr+',
    eta: '25 min',
    tag: 'Spicy Pick',
    tagColor: '#EF4444',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🍽️' },
  { id: 'Biryani', label: 'Biryani', icon: '🍖' },
  { id: 'Pizza', label: 'Pizza', icon: '🍕' },
  { id: 'Burger', label: 'Burger', icon: '🍔' },
  { id: 'North Indian', label: 'North Indian', icon: '🫕' },
  { id: 'South Indian', label: 'South Indian', icon: '🥘' },
  { id: 'Noodles', label: 'Noodles', icon: '🍜' },
]

const MARQUEE = [
  '🔥 9 Crore Biryanis Ordered in 2024',
  '⭐ Avg Rating 4.6 Across Partners',
  '⚡ Delivery in Under 30 Minutes',
  '🍕 5.8 Crore Pizzas Delivered',
  '📱 Order Via Short Food Reels',
  '🎉 180+ Partner Restaurants',
]

const STATS = [
  { num: '9Cr+', label: 'Biryanis delivered' },
  { num: '180+', label: 'Partner restaurants' },
  { num: '4.8★', label: 'Average rating' },
  { num: '28min', label: 'Avg delivery time' },
]

const FEATURES = [
  { icon: '▶', title: 'Short food reels', desc: 'Watch 15-second dish previews before ordering. No more mystery food.' },
  { icon: '⚡', title: 'Under 30 minutes', desc: 'Real-time tracking and 180+ local partners mean your food arrives fast.' },
  { icon: '★', title: 'Curated quality', desc: 'Every partner is vetted. Average rating of 4.6 across the platform.' },
  { icon: '♥', title: 'Save your cravings', desc: 'Like and bookmark dishes to your personal feed. Order when ready.' },
]

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #080705;
  --surface: #100F0C;
  --surface2: #181512;
  --surface3: #201D18;
  --border: rgba(255,255,255,0.07);
  --border2: rgba(255,255,255,0.14);
  --orange: #FF6B2B;
  --orange-glow: rgba(255,107,43,0.22);
  --orange-dim: rgba(255,107,43,0.1);
  --gold: #E8B84B;
  --green: #4ADE80;
  --text: #F0EAE0;
  --muted: rgba(240,234,224,0.45);
  --dim: rgba(240,234,224,0.22);
  --font-d: 'Syne', sans-serif;
  --font-b: 'DM Sans', sans-serif;
  --ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}

html { font-size: 16px; scroll-behavior: smooth; }

.lp { background: var(--bg); color: var(--text); font-family: var(--font-b); overflow-x: hidden; }

/* NAV */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.1rem 3rem;
  transition: background 0.4s, border-color 0.4s, backdrop-filter 0.4s;
  border-bottom: 1px solid transparent;
}
.nav.on {
  background: rgba(8,7,5,0.9);
  border-color: var(--border);
  backdrop-filter: blur(18px);
}
.logo { font-family: var(--font-d); font-size: 1.5rem; font-weight: 800; color: var(--text); text-decoration: none; letter-spacing: -0.01em; }
.logo em { color: var(--orange); font-style: normal; }
.nav-mid { display: flex; gap: 2.5rem; }
.nav-a { font-size: 0.875rem; color: var(--muted); text-decoration: none; transition: color 0.2s; }
.nav-a:hover { color: var(--text); }
.nav-r { display: flex; gap: 0.75rem; align-items: center; }

.btn-g {
  background: none; border: 1px solid var(--border2); color: var(--text);
  padding: 0.5rem 1.2rem; border-radius: 100px; cursor: pointer;
  font-family: var(--font-b); font-size: 0.8rem;
  transition: all 0.25s var(--ease);
}
.btn-g:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.28); transform: translateY(-1px); }

.btn-o {
  background: var(--orange); border: none; color: #fff;
  padding: 0.5rem 1.3rem; border-radius: 100px; cursor: pointer;
  font-family: var(--font-b); font-size: 0.8rem; font-weight: 500;
  transition: all 0.25s var(--ease); position: relative; overflow: hidden;
}
.btn-o::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%); opacity: 0; transition: opacity 0.25s; }
.btn-o:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 24px rgba(255,107,43,0.38); }
.btn-o:hover::after { opacity: 1; }

/* HERO */
.hero {
  min-height: 100vh; padding-top: 5rem;
  display: grid; grid-template-columns: 55% 1fr;
  position: relative; overflow: hidden;
}
.glow1 {
  position: absolute; top: -5%; right: -5%; width: 65%; height: 90%;
  background: radial-gradient(ellipse at center, rgba(255,107,43,0.1) 0%, transparent 65%);
  pointer-events: none;
}
.glow2 {
  position: absolute; bottom: 0; left: 5%; width: 45%; height: 60%;
  background: radial-gradient(ellipse at center, rgba(232,184,75,0.055) 0%, transparent 65%);
  pointer-events: none;
}

.hero-l {
  display: flex; flex-direction: column; justify-content: center;
  padding: 4rem 3rem; position: relative; z-index: 2;
}

.eyebrow {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: var(--orange-dim); border: 1px solid rgba(255,107,43,0.25);
  color: var(--orange); padding: 0.3rem 0.9rem;
  border-radius: 100px; font-size: 0.68rem; font-weight: 500;
  letter-spacing: 0.08em; text-transform: uppercase;
  margin-bottom: 2rem; width: fit-content;
  animation: fsu 0.6s var(--ease) both;
}
.edot {
  width: 5px; height: 5px; border-radius: 50%; background: var(--orange);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.3; transform:scale(0.6); } }

.h1 {
  font-family: var(--font-d); font-size: clamp(3.5rem, 6.5vw, 6.5rem);
  font-weight: 800; line-height: 0.9; letter-spacing: -0.02em;
  margin-bottom: 1.75rem;
  animation: fsu 0.7s 0.1s var(--ease) both;
}
.h1-small { font-size: clamp(0.875rem, 1.4vw, 1.25rem); font-weight: 300; color: var(--muted); letter-spacing: 0.18em; text-transform: uppercase; font-family: var(--font-b); display: block; margin-bottom: 0.4rem; }
.h1-outline { color: transparent; -webkit-text-stroke: 2px var(--orange); }

.hero-sub { font-size: 1.0625rem; color: var(--muted); line-height: 1.7; max-width: 440px; margin-bottom: 2.5rem; font-weight: 300; animation: fsu 0.7s 0.2s var(--ease) both; }

.hero-ctas { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-bottom: 3.5rem; animation: fsu 0.7s 0.3s var(--ease) both; }

.btn-reel {
  display: inline-flex; align-items: center; gap: 0.75rem;
  background: var(--orange); color: #fff;
  border: none; padding: 1rem 2.25rem;
  border-radius: 100px; cursor: pointer;
  font-family: var(--font-b); font-size: 1rem; font-weight: 500;
  transition: all 0.3s var(--bounce); position: relative; overflow: hidden;
}
.btn-reel::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%); }
.btn-reel:hover { transform: scale(1.06) translateY(-2px); box-shadow: 0 16px 40px rgba(255,107,43,0.42); }
.pcircle { width: 32px; height: 32px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ptri { width: 0; height: 0; border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 11px solid white; margin-left: 2px; }

.btn-ol {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: none; border: 1px solid var(--border2); color: var(--text);
  padding: 1rem 1.75rem; border-radius: 100px; cursor: pointer;
  font-family: var(--font-b); font-size: 1rem;
  transition: all 0.25s var(--ease);
}
.btn-ol:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.3); transform: translateY(-2px); }

.stats-row { display: flex; gap: 2.5rem; padding-top: 2.5rem; border-top: 1px solid var(--border); animation: fsu 0.7s 0.4s var(--ease) both; }
.sv { font-family: var(--font-d); font-size: 1.75rem; font-weight: 800; line-height: 1; }
.sl { font-size: 0.68rem; color: var(--muted); margin-top: 0.3rem; text-transform: uppercase; letter-spacing: 0.07em; }

/* HERO RIGHT */
.hero-r {
  display: flex; align-items: center; justify-content: center;
  padding: 3rem 2rem; position: relative; z-index: 2;
  animation: fadeIn 1s 0.3s both;
}
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

.food-stack { position: relative; width: 280px; height: 400px; }

.fc {
  position: absolute; width: 220px; height: 265px;
  border-radius: 22px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 32px 64px rgba(0,0,0,0.65);
  cursor: pointer;
  transition: transform 0.4s var(--ease);
}
.fc:nth-child(1) { top: 0; left: 40px; transform: rotate(-4deg); animation: fa 6s ease-in-out infinite; }
.fc:nth-child(2) { top: 70px; right: 0; transform: rotate(3deg); animation: fb 7s 1s ease-in-out infinite; }
.fc:nth-child(3) { bottom: 0; left: 20px; transform: rotate(-2deg); animation: fc2 5s 2s ease-in-out infinite; }
.fc:hover { transform: rotate(0deg) scale(1.07) !important; z-index: 10; }
.fc img { width:100%; height:100%; object-fit:cover; display:block; }
.fc-ov { position:absolute; bottom:0; left:0; right:0; padding:0.75rem; background:linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%); }
.fc-name { font-size:0.7rem; font-weight:500; color:#fff; }
.fc-price { font-size:0.7rem; color:var(--orange); font-weight:600; margin-top:0.1rem; }

@keyframes fa { 0%,100% { transform:rotate(-4deg) translateY(0); } 50% { transform:rotate(-4deg) translateY(-12px); } }
@keyframes fb { 0%,100% { transform:rotate(3deg) translateY(0); } 50% { transform:rotate(3deg) translateY(-9px); } }
@keyframes fc2 { 0%,100% { transform:rotate(-2deg) translateY(0); } 50% { transform:rotate(-2deg) translateY(-14px); } }

.badge {
  position: absolute;
  background: var(--surface3); border: 1px solid var(--border2);
  border-radius: 12px; padding: 0.5rem 0.8rem;
  display: flex; align-items: center; gap: 0.5rem;
  white-space: nowrap; box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}
.badge em { font-size:1rem; font-style:normal; }
.badge strong { display:block; font-size:0.7rem; font-weight:500; color:var(--text); }
.badge span { font-size:0.6rem; color:var(--muted); }

@keyframes fsu { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

/* MARQUEE */
.mq { border-top:1px solid var(--border); border-bottom:1px solid var(--border); background:var(--surface); padding:0.75rem 0; overflow:hidden; }
.mq-track { display:flex; gap:3rem; animation:mq 32s linear infinite; width:max-content; }
.mq-track:hover { animation-play-state:paused; }
@keyframes mq { from { transform:translateX(0); } to { transform:translateX(-50%); } }
.mq-item { font-size:0.79rem; color:var(--muted); white-space:nowrap; display:flex; align-items:center; gap:0.4rem; }
.mq-sep { color:var(--orange); font-size:0.45rem; }

/* CATEGORIES */
.cat-sec { padding:4rem 3rem; background:var(--surface); }
.sec-lbl { font-size:0.65rem; font-weight:600; text-transform:uppercase; letter-spacing:0.12em; color:var(--orange); margin-bottom:0.75rem; display:block; }
.sec-title { font-family:var(--font-d); font-size:clamp(2rem,4vw,3.25rem); font-weight:800; line-height:1; letter-spacing:-0.02em; }
.cat-row { display:flex; gap:0.75rem; overflow-x:auto; padding-bottom:0.25rem; scrollbar-width:none; margin-top:1.75rem; }
.cat-row::-webkit-scrollbar { display:none; }
.chip {
  display:flex; align-items:center; gap:0.45rem;
  background:var(--surface2); border:1px solid var(--border);
  color:var(--text); padding:0.6rem 1.2rem;
  border-radius:100px; cursor:pointer; font-family:var(--font-b); font-size:0.875rem;
  white-space:nowrap; flex-shrink:0;
  transition:all 0.25s var(--ease);
}
.chip:hover, .chip.on { border-color:var(--orange); background:var(--orange-dim); color:#FF8C5A; transform:translateY(-3px); }

/* DISHES */
.dishes-sec { padding:5rem 3rem; }
.dishes-hd { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:2.5rem; }
.dishes-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; }

.dcard {
  background:var(--surface2); border:1px solid var(--border);
  border-radius:20px; overflow:hidden; cursor:pointer;
  transition:transform 0.35s var(--ease), border-color 0.3s, box-shadow 0.35s;
  position:relative;
}
.dcard:hover { transform:translateY(-8px); border-color:rgba(255,255,255,0.16); box-shadow:0 24px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,107,43,0.14); }

.dimg-wrap { position:relative; overflow:hidden; height:200px; }
.dimg { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.55s var(--ease); }
.dcard:hover .dimg { transform:scale(1.08); }

.dtag { position:absolute; top:0.75rem; left:0.75rem; padding:0.22rem 0.6rem; border-radius:100px; font-size:0.62rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:#fff; }

.dsave {
  position:absolute; top:0.75rem; right:0.75rem;
  width:30px; height:30px; background:rgba(0,0,0,0.55); border:none; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; font-size:0.85rem; color:white;
  opacity:0; transform:translateY(-4px);
  transition:opacity 0.25s, transform 0.25s, background 0.2s;
}
.dcard:hover .dsave { opacity:1; transform:translateY(0); }
.dsave:hover { background:var(--orange) !important; transform:scale(1.12) translateY(0) !important; }

.dbody { padding:1.1rem; }
.dtop { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:0.25rem; }
.dname { font-weight:500; font-size:0.9375rem; line-height:1.3; }
.drating { display:flex; align-items:center; gap:0.2rem; font-size:0.75rem; font-weight:500; flex-shrink:0; }
.dstar { color:var(--gold); }
.drest { font-size:0.7rem; color:var(--muted); margin-bottom:0.75rem; }
.dbot { display:flex; align-items:center; justify-content:space-between; }
.dprice-block { display:flex; align-items:baseline; gap:0.35rem; }
.dprice { font-family:var(--font-d); font-size:1.3rem; font-weight:700; }
.dorig { font-size:0.72rem; color:var(--dim); text-decoration:line-through; }
.ddisc { font-size:0.62rem; font-weight:600; color:var(--green); background:rgba(74,222,128,0.1); padding:0.15rem 0.4rem; border-radius:4px; }
.dadd {
  background:var(--orange-dim); border:1px solid rgba(255,107,43,0.3);
  color:var(--orange); padding:0.4rem 1rem; border-radius:100px; cursor:pointer;
  font-family:var(--font-b); font-size:0.75rem; font-weight:500;
  transition:all 0.25s var(--ease);
}
.dadd:hover { background:var(--orange); color:#fff; transform:scale(1.06); box-shadow:0 4px 14px rgba(255,107,43,0.32); }
.deta { font-size:0.65rem; color:var(--muted); display:flex; align-items:center; gap:0.3rem; margin-top:0.6rem; border-top:1px solid var(--border); padding-top:0.6rem; }

/* FEATURES */
.feat-sec { padding:5rem 3rem; background:var(--surface); position:relative; overflow:hidden; }
.feat-sec::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(to right, transparent, rgba(255,107,43,0.4), transparent); }
.feat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1.25rem; margin-top:3rem; }
.fcard {
  padding:1.75rem 1.5rem; background:var(--surface2); border:1px solid var(--border);
  border-radius:20px; transition:all 0.3s var(--ease); position:relative; overflow:hidden;
}
.fcard::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:var(--orange); transform:scaleX(0); transform-origin:left; transition:transform 0.4s var(--ease); }
.fcard:hover { transform:translateY(-6px); border-color:rgba(255,107,43,0.2); box-shadow:0 20px 40px rgba(0,0,0,0.45); }
.fcard:hover::after { transform:scaleX(1); }
.ficon { width:46px; height:46px; background:var(--orange-dim); border:1px solid rgba(255,107,43,0.2); border-radius:13px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; margin-bottom:1.25rem; }
.ftitle { font-weight:500; font-size:0.9375rem; margin-bottom:0.4rem; }
.fdesc { font-size:0.8rem; color:var(--muted); line-height:1.6; }

/* FOOTER */
.footer {
  border-top:1px solid var(--border); padding:2.5rem 3rem;
  display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.5rem;
}
.flinks { display:flex; gap:2rem; }
.flink { font-size:0.8rem; color:var(--muted); text-decoration:none; transition:color 0.2s; }
.flink:hover { color:var(--text); }

/* Responsive */
@media (max-width:960px) {
  .hero { grid-template-columns:1fr; }
  .hero-r { display:none; }
  .nav { padding:1rem 1.5rem; }
  .nav-mid { display:none; }
  .hero-l { padding:3rem 1.5rem; }
  .dishes-grid { grid-template-columns:repeat(2,1fr); }
  .feat-grid { grid-template-columns:repeat(2,1fr); }
  .dishes-sec, .cat-sec, .feat-sec, .footer { padding-left:1.5rem; padding-right:1.5rem; }
}
@media (max-width:580px) {
  .dishes-grid { grid-template-columns:1fr; }
  .feat-grid { grid-template-columns:1fr; }
  .stats-row { gap:1.5rem; flex-wrap:wrap; }
}
`

export default function Landing() {
  const navigate = useNavigate()
  const [activeCat, setActiveCat] = useState('all')
  const [scrolled, setScrolled] = useState(false)
  const [saved, setSaved] = useState(new Set())
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const userFlag = window.localStorage.getItem('fh_user_logged_in') === 'true'
    setLoggedIn(userFlag)
  }, [])

  const filtered = activeCat === 'all' ? DISHES : DISHES.filter(d => d.category === activeCat)
  const disc = (p, o) => Math.round((1 - p / o) * 100)
  const toggleSave = (e, id) => {
    e.stopPropagation()
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="lp">

        {/* NAV */}
        <nav className={`nav${scrolled ? ' on' : ''}`}>
          <a href="/" className="logo">Food<em>Hub</em></a>
          <div className="nav-mid">
            <a href="#dishes" className="nav-a">Menu</a>
            <a href="#features" className="nav-a">How it works</a>
            <Link to="/food-partner/register" className="nav-a">Partner with us</Link>
          </div>
          <div className="nav-r">
            <button className="btn-g" onClick={() => navigate(loggedIn ? '/feed' : '/user/login')}>
              {loggedIn ? 'Go to feed' : 'Sign in'}
            </button>
            {!loggedIn && (
              <button className="btn-o" onClick={() => navigate('/user/register')}>Get started</button>
            )}
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="glow1" /><div className="glow2" />
          <div className="hero-l">
            <div className="eyebrow"><div className="edot" />Live in Lucknow &amp; 50+ cities</div>
            <h1 className="h1">
              <span className="h1-small">India's favourite way to</span>
              ORDER<br /><span className="h1-outline">GREAT FOOD</span>
            </h1>
            <p className="hero-sub">Scroll short food reels, discover trending dishes from 180+ restaurant partners, and get hot meals at your door in under 30 minutes.</p>
            <div className="hero-ctas">
              <button className="btn-reel" onClick={() => navigate('/feed')}>
                <span className="pcircle"><span className="ptri" /></span>
                Watch Food Reels
              </button>
              <button className="btn-ol" onClick={() => navigate('/user/register')}>Browse menu →</button>
            </div>
            <div className="stats-row">
              {STATS.map(s => (
                <div key={s.num}><div className="sv">{s.num}</div><div className="sl">{s.label}</div></div>
              ))}
            </div>
          </div>

          {/* Floating food cards */}
          <div className="hero-r">
            <div className="food-stack">
              {[DISHES[0], DISHES[1], DISHES[3]].map((d, i) => (
                <div key={d.id} className="fc">
                  <img src={d.image} alt={d.name} />
                  <div className="fc-ov">
                    <div className="fc-name">{d.name}</div>
                    <div className="fc-price">₹{d.price}</div>
                  </div>
                </div>
              ))}
              <div className="badge" style={{ position:'absolute', bottom:'30px', right:'-28px' }}>
                <em>🔥</em>
                <div><strong>9Cr+ Biryanis</strong><span>Most ordered 2024</span></div>
              </div>
              <div className="badge" style={{ position:'absolute', top:'16px', left:'-46px', animationDelay:'0.2s' }}>
                <em>⚡</em>
                <div><strong>28 min avg</strong><span>Delivery time</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="mq">
          <div className="mq-track">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} className="mq-item">{item}<span className="mq-sep">◆</span></span>
            ))}
          </div>
        </div>

        {/* CATEGORIES */}
        <section className="cat-sec">
          <span className="sec-lbl">Browse by craving</span>
          <h2 className="sec-title">What are you craving?</h2>
          <div className="cat-row">
            {CATEGORIES.map(c => (
              <button key={c.id} className={`chip${activeCat === c.id ? ' on' : ''}`} onClick={() => setActiveCat(c.id)}>
                <span>{c.icon}</span>{c.label}
              </button>
            ))}
          </div>
        </section>

        {/* DISHES */}
        <section id="dishes" className="dishes-sec">
          <div className="dishes-hd">
            <div>
              <span className="sec-lbl">Trending now</span>
              <h2 className="sec-title">What's hot today</h2>
            </div>
            <button className="btn-g" onClick={() => navigate('/feed')}>View all →</button>
          </div>
          <div className="dishes-grid">
            {filtered.map(dish => {
              const targetId =
                dish.category === 'Biryani' || dish.category === 'North Indian'
                  ? 1
                  : dish.category === 'Pizza'
                  ? 2
                  : 3
              return (
              <div
                key={dish.id}
                className="dcard"
                onClick={() => navigate(`/restaurants/${targetId}`)}
              >
                <div className="dimg-wrap">
                  <img src={dish.image} alt={dish.name} className="dimg" loading="lazy" />
                  <div className="dtag" style={{ background: dish.tagColor }}>{dish.tag}</div>
                  <button className="dsave" onClick={e => toggleSave(e, dish.id)}>
                    {saved.has(dish.id) ? '♥' : '♡'}
                  </button>
                </div>
                <div className="dbody">
                  <div className="dtop">
                    <div className="dname">{dish.name}</div>
                    <div className="drating"><span className="dstar">★</span>{dish.rating}</div>
                  </div>
                  <div className="drest">{dish.restaurant} · {dish.orders} orders</div>
                  <div className="dbot">
                    <div className="dprice-block">
                      <span className="dprice">₹{dish.price}</span>
                      <span className="dorig">₹{dish.originalPrice}</span>
                      <span className="ddisc">{disc(dish.price, dish.originalPrice)}% off</span>
                    </div>
                    <button className="dadd" onClick={e => { e.stopPropagation(); navigate('/user/register') }}>+ Add</button>
                  </div>
                  <div className="deta"><span>🕐</span>{dish.eta} delivery</div>
                </div>
              </div>
            )})}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="feat-sec">
          <span className="sec-lbl">Why FoodHub</span>
          <h2 className="sec-title">Built different</h2>
          <p style={{ fontSize:'1rem', color:'var(--muted)', marginTop:'0.875rem', fontWeight:300 }}>The only food app where you watch before you eat.</p>
          <div className="feat-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="fcard">
                <div className="ficon">{f.icon}</div>
                <div className="ftitle">{f.title}</div>
                <div className="fdesc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <a href="/" className="logo">Food<em>Hub</em></a>
          <div className="flinks">
            <Link to="/user/register" className="flink">Create account</Link>
            <Link to="/food-partner/register" className="flink">Partner with us</Link>
            <a href="#" className="flink">About</a>
            <a href="#" className="flink">Contact</a>
          </div>
          <button className="btn-reel" onClick={() => navigate('/feed')} style={{ padding:'0.6rem 1.4rem', fontSize:'0.875rem' }}>
            <span className="pcircle" style={{ width:24, height:24 }}><span className="ptri" style={{ borderLeftWidth:9, borderTopWidth:5, borderBottomWidth:5 }} /></span>
            Watch Reels
          </button>
        </footer>
      </div>
    </>
  )
}