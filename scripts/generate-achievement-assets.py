"""Rebuild the hand-authored vector medal collection (no external dependencies)."""
from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parents[1] / 'public' / 'achievements'
ROOT.mkdir(parents=True, exist_ok=True)

# Large, distinctive silhouettes remain legible at notification size.
GLYPHS = {
 'quiz': '<path d="M48 38h32v19c0 22-32 22-32 0z"/><path d="M48 43H38v10q0 12 15 12m27-22h10v10q0 12-15 12M64 74v10m-12 0h24"/><path d="m57 53 5 5 10-12" stroke="#fff"/>',
 'streak': '<path d="M65 30c8 18 24 21 24 39a25 25 0 0 1-50 0c0-10 7-19 14-25l2 18c10-8 12-19 10-32z"/><path d="M61 67h10l-8 17" stroke="#fff"/>',
 'science': '<path d="m43 39 21-9 21 9v24c0 15-21 25-21 25S43 78 43 63z"/><path d="M58 45v14l-8 15h28l-8-15V45m-15 0h18m-18 22h18" stroke="#fff"/>',
 'speed': '<circle cx="64" cy="62" r="24"/><path d="M57 30h14m-7 0v8m19 5 5-5M38 55H28m10 12H24"/><path d="m67 43-12 22h11l-5 17 15-25H65z" fill="#fff" stroke="none"/>',
 'perfect': '<path d="m64 30 10 18 21 4-15 16 3 22-19-10-19 10 3-22-15-16 21-4z"/><path d="m53 61 8 8 15-17" stroke="#fff"/>',
 'book': '<path d="M64 45c-11-9-22-10-29-7v40c10-3 20-1 29 7 9-8 19-10 29-7V38c-7-3-18-2-29 7z"/><path d="M64 45v40M43 49l12 4m-12 7 12 4m18-11 12-4m-12 15 12-4" stroke="#fff"/>',
 'target': '<circle cx="60" cy="65" r="27"/><circle cx="60" cy="65" r="17"/><circle cx="60" cy="65" r="6" fill="#fff"/><path d="m60 65 29-30m-10 3 1 10 11 1" stroke="#fff"/>',
 'crown': '<path d="m35 46 15 10 14-23 14 23 15-10-7 36H42z"/><path d="M44 72h40" stroke="#fff"/><circle cx="64" cy="62" r="4" fill="#fff"/>',
 'dna': '<path d="M48 32c0 28 32 30 32 60M80 32c0 28-32 30-32 60M50 40h28M55 51h18M55 73h18M50 84h28"/>',
 'atom': '<ellipse cx="64" cy="62" rx="32" ry="12"/><ellipse cx="64" cy="62" rx="32" ry="12" transform="rotate(60 64 62)"/><ellipse cx="64" cy="62" rx="32" ry="12" transform="rotate(120 64 62)"/><circle cx="64" cy="62" r="6" fill="#fff"/>',
 'earth': '<circle cx="64" cy="62" r="29"/><path d="m48 39 12 7-3 12-12 2 5 13 11 1 4 15m17-49-12 14 7 9 14-2" stroke="#fff"/>',
 'rise': '<path d="M37 87V72h12v15m9 0V59h12v28m9 0V44h12v43M35 60l20-17 11 5 21-19m-14 0h14v14"/>',
 'compass': '<circle cx="64" cy="62" r="29"/><path d="m76 44-6 24-18 12 6-24z" fill="#fff"/><path d="M64 29v7m0 52v7M31 62h7m52 0h7"/>',
 'eclipse': '<circle cx="64" cy="62" r="27" fill="#f8fafc"/><circle cx="75" cy="53" r="25" fill="#172033" stroke="#172033"/><path d="M36 35v10m-5-5h10m43 38v10m-5-5h10"/>',
 'matter': '<path d="m37 49 13-8 13 8v17l-13 8-13-8zM37 49l13 8 13-8M50 57v17"/><path d="M77 46c0 0-13 17-13 24a13 13 0 0 0 26 0c0-7-13-24-13-24z" fill="#67e8f9"/><circle cx="75" cy="34" r="4"/><circle cx="90" cy="42" r="3"/>',
 'detective': '<path d="M43 35h18m-14 0v19L36 74q-3 8 6 8h26q8 0 5-8L58 54V35M42 66h24"/><circle cx="76" cy="53" r="16" fill="#134e4a"/><path d="m87 66 11 16m-30-29 6 6 10-12" stroke="#fff"/>',
 'cell': '<path d="M64 44C45 22 26 48 37 72c8 17 20 10 27 5 7 5 19 12 27-5 11-24-8-50-27-28z"/><path d="m47 53 10 14m0-14L47 67m24-14 10 14m0-14L71 67" stroke="#fff"/>',
 'rabbit': '<path d="M49 53c-20-38-1-39 8-7m10 0c10-39 28-31 12 8"/><path d="M88 68c0 16-11 22-25 22S39 82 39 69c0-15 12-25 25-25s24 10 24 24z"/><circle cx="54" cy="64" r="2" fill="#fff"/><circle cx="75" cy="64" r="2" fill="#fff"/><path d="m61 74 4 3 4-3" stroke="#fff"/>',
 'fox': '<path d="m36 33 25 15h7l24-15-4 38-24 19-24-19z"/><path d="m40 60 24 20 24-20M50 56l5 3m18 0 5-3" stroke="#fff"/><path d="m59 77 5 7 5-7z" fill="#fff"/>',
 'mushroom': '<path d="M34 65c2-44 58-44 60 0zM57 65l-3 24h20l-3-24"/><circle cx="51" cy="53" r="4" fill="#fff"/><circle cx="72" cy="45" r="4" fill="#fff"/><circle cx="81" cy="57" r="3" fill="#fff"/><path d="m32 76 8 9 9-2m-11 4-1-11m48 2 8-7-1-9m2 10-11-2"/>',
 'seismic': '<path d="M33 77h62M39 76V44h18v32m14 0V33h18v43M31 60h17l7-12 9 24 9-17h24"/>',
 'shelter': '<path d="m34 53 30-24 30 24M41 50v35h46V50"/><path d="m64 48 15 6v12c0 12-15 18-15 18s-15-6-15-18V54z" fill="#134e4a"/><path d="m56 65 6 6 11-14" stroke="#fff"/>',
 'rescue': '<path d="m64 29 27 12v23c0 16-27 29-27 29S37 80 37 64V41z"/><path d="M57 45h14v12h12v14H71v12H57V71H45V57h12z" fill="#fff" stroke="none"/>',
}

MEDALS = [
 ('first-quiz','First Quiz','quiz','#f59e0b',1), ('seven-day-streak','7-Day Streak','streak','#f97316',2),
 ('science-nerd','Science Nerd','science','#14b8a6',1), ('speed-learner','Speed Learner','speed','#facc15',2),
 ('perfect-score','Perfect Score','perfect','#a78bfa',3), ('bookworm','Bookworm','book','#60a5fa',2),
 ('sharpshooter','Sharpshooter','target','#fb7185',2), ('leaderboard-king','Leaderboard King','crown','#fbbf24',3),
 ('bio-master','Bio Master','dna','#4ade80',3), ('physics-wizard','Physics Wizard','atom','#38bdf8',3),
 ('earth-explorer','Earth Explorer','earth','#a3e635',3), ('on-the-rise','On The Rise','rise','#818cf8',1),
 ('curious-explorer','Curious Explorer','compass','#f472b6',1), ('blacked','BLACKED','eclipse','#cbd5e1',3),
 ('matter-observer','Matter Observer','matter','#38bdf8',1), ('phase-shaper','Phase Shaper','matter','#38bdf8',2),
 ('matter-state-sandbox-complete','State Changer','matter','#38bdf8',3), ('mystery-lab-complete','Lab Detective','detective','#2dd4bf',3),
 ('cell-division-lab-complete','Cell Splitter','cell','#4ade80',1), ('chromosome-keeper','Chromosome Keeper','cell','#4ade80',2),
 ('genome-guardian','Genome Guardian','cell','#4ade80',3), ('meadow-forager','Meadow Forager','rabbit','#a3e635',1),
 ('apex-hunter','Apex Hunter','fox','#fb923c',2), ('circle-of-life','Circle of Life','mushroom','#a3e635',3),
 ('seismic-scout','Seismic Scout','seismic','#fb923c',1), ('quake-survivor','Quake Survivor','shelter','#fb923c',2),
 ('rescue-commander','Rescue Commander','rescue','#fb923c',3),
]

for key, title, glyph, accent, tier in MEDALS:
    metal = ['#cd9363', '#d9e8f4', '#ffd76b'][tier-1]
    wings = '' if tier < 2 else f'<path d="M26 45 8 34l5 38 16 14m73-41 18-11-5 38-16 14" fill="{metal}" stroke="#172033" stroke-width="3"/><path d="m14 47 13 13M17 62l11 10m86-25-13 13m10 2-11 10" stroke="#172033" stroke-width="2"/>'
    crown = '' if tier < 3 else f'<path d="m45 20-3-13 14 6 8-11 8 11 14-6-3 13" fill="{metal}" stroke="#172033" stroke-width="2"/>'
    stars = ''.join(f'<circle cx="{64+(i-(tier-1)/2)*12}" cy="103" r="3" fill="{metal}"/>' for i in range(tier))
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-labelledby="title">
<title id="title">{escape(title)} medal</title>
<defs><linearGradient id="metal" x2="1" y2="1"><stop stop-color="#fff7df"/><stop offset=".45" stop-color="{metal}"/><stop offset="1" stop-color="#8b642e"/></linearGradient><radialGradient id="face"><stop stop-color="{accent}" stop-opacity=".35"/><stop offset="1" stop-color="#172033"/></radialGradient></defs>
<path d="m38 88-9 34 20-9 12 9 6-34m0 0 8 34 12-9 20 9-12-34" fill="{accent}" stroke="#172033" stroke-width="3"/>
{wings}{crown}<path d="M64 17 98 30l10 35-15 31-29 15-29-15-15-31 10-35z" fill="url(#metal)" stroke="#172033" stroke-width="3"/>
<path d="M64 24 92 35l9 29-13 27-24 12-24-12-13-27 9-29z" fill="#172033" stroke="{metal}" stroke-width="1.5"/>
<circle cx="64" cy="62" r="35" fill="url(#face)"/>
<g fill="none" stroke="{accent}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">{GLYPHS[glyph]}</g>
{stars}</svg>'''
    (ROOT / f'{key}.svg').write_text(svg, encoding='utf-8')

# Standalone review sheet doubles as an asset inventory.
cards = ''.join(f'<figure><img src="{key}.svg" alt="{escape(title)}"><figcaption>{escape(title)}</figcaption></figure>' for key,title,*_ in MEDALS)
(ROOT / 'preview.html').write_text(f'<!doctype html><html lang="en"><meta charset="utf-8"><title>SciQuest medal collection</title><style>body{{background:#101827;color:#fff;font:14px system-ui;margin:40px}}main{{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:20px}}figure{{margin:0;text-align:center;padding:16px;background:#1e293b;border-radius:16px}}img{{width:128px;height:128px}}h1{{font-size:28px}}</style><h1>SciQuest · Achievement medals</h1><p>Bronze beginnings. Silver wings. Gold crowns.</p><main>{cards}</main></html>', encoding='utf-8')
print(f'Created {len(MEDALS)} SVG medals and preview.html')
