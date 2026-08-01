# KerjaKink — Asset & Token Handoff

Font: **Poppins** — 400 / 500 / 600 / 700
`https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap`

## Struktur
```
assets/
  logo/
    logo-lockup.svg         Logo utuh (mark + wordmark) untuk latar terang
    logo-lockup-light.svg   Logo utuh untuk latar biru/gelap
    logo-mark.svg           Monogram saja (30x30) — latar terang
    logo-mark-light.svg     Monogram saja — latar gelap
    logo-mark-mono.svg      Monogram satu warna (pakai currentColor)
    favicon.svg             Favicon 32x32, mark putih di kotak primary
  illustration/
    hero-bursa-kerja.svg    Ilustrasi hero landing page (600x480, skalabel)
  icons/                    14 ikon UI 24x24, stroke=currentColor, stroke-width=2
  palette/
    palette-kerjakink.svg   Lembar swatch palet lengkap dengan kode hex
tokens/
  colors.css                CSS custom properties (--kk-*) + interaction states
  colors.json               Token dalam JSON (untuk build tool / Style Dictionary)
  tailwind.config.js        Ekstensi warna & font untuk Tailwind
```

## Catatan implementasi
- Semua ikon memakai `stroke="currentColor"` — warnai lewat CSS `color`.
- `logo-mark-mono.svg` juga `currentColor`, aman untuk state hover/aktif.
- Wordmark pada lockup memakai `<text>` Poppins; jika font belum termuat di
  konteks tertentu (mis. email), pakai versi PNG hasil ekspor atau ubah ke path.
- Radius yang dipakai: 6px (kontrol, badge) dan 10px (kartu). Tidak ada radius > 10px
  kecuali pill/chip (20px) dan avatar (50%).
- Focus ring wajib: `outline: 2px solid #1890FF; outline-offset: 2px;`
