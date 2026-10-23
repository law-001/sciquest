import { Lucide } from './shared.jsx';
import { mlAudio } from './audio.js';
import './expedition.css';

const ART = '/games/mystery-lab/art/';

// Every object is an independent sprite. Coordinates belong to the map, not the art.
const scenery = [
  ['tree', 3, 32, 12], ['tree', 15, 28, 9], ['tree', 26, 21, 12],
  ['tree', 35, 12, 10], ['tree', 46, 17, 11], ['tree', 59, 12, 10],
  ['tree', 4, 49, 12], ['tree', 7, 74, 12], ['tree', 16, 92, 13],
  ['tree', 4, 97, 14], ['tree', 28, 99, 10], ['tree', 49, 96, 12],
  ['tree', 96, 17, 11], ['dead-tree', 93, 42, 10], ['dead-tree', 92, 70, 10],
  ['dead-tree', 64, 62, 8], ['dead-tree', 90, 92, 11], ['dead-tree', 70, 96, 8],
  ['bush', 30, 34, 7], ['bush', 10, 64, 7], ['bush', 39, 29, 7],
  ['bush', 52, 80, 7], ['bush', 33, 93, 7], ['bush', 58, 30, 6],
  ['flowers', 12, 33, 4], ['flowers', 31, 58, 4], ['flowers', 14, 77, 4],
  ['flowers', 41, 61, 4], ['flowers', 24, 87, 4],
  ['reeds', 12, 46, 5], ['reeds', 29, 47, 5], ['reeds', 26, 61, 4],
  ['rock', 34, 48, 5], ['rock', 56, 64, 5], ['rock', 88, 55, 6],
  ['rock', 64, 25, 6], ['rock', 85, 90, 5],
  ['dead-plants', 65, 80, 5], ['dead-plants', 83, 85, 4],
  ['dead-plants', 89, 64, 4], ['dead-plants', 70, 49, 4],
];

// Sprite sizes are tied to the map's height, not its width: the map stretches to
// fill whatever card it is in, and sizing by width would magnify every sprite on a
// wide card. The 10/7 keeps the numbers reading as "% of the original 10:7 map".
const spriteWidth = (percent) => `calc(${percent} * 10cqh / 7)`;

export function WorldSprite({ name, className = '', style, ...props }) {
  return <img src={`${ART}${name}.png`} alt="" draggable="false"
    className={`ml-world-sprite ${className}`} style={style} {...props} />;
}

export default function ExpeditionMap({ go, setPond, visited = [], pulse, isDark }) {
  const locations = [
    { id: 'pondB', name: 'Pond B', note: 'Healthy control', asset: 'pond-healthy', x: 21, y: 48, width: 28, label: 61 },
    { id: 'factory', name: 'Maple Factory', note: 'Access restricted', asset: 'factory', x: 79, y: 27, width: 23, label: 42, locked: true },
    { id: 'lab', name: 'Lab Tent', note: 'Test your hypotheses', asset: 'lab-tent', x: 49, y: 43, width: 24, label: 59 },
    { id: 'evidence', name: 'Evidence Board', note: 'Mission HQ', asset: 'evidence-board', x: 36, y: 76, width: 19, label: 90 },
    { id: 'pondA', name: 'Pond A', note: 'Investigate · 5 clues', asset: 'pond-polluted', x: 77, y: 72, width: 29, label: 85 },
  ];

  function visit(id) {
    mlAudio.mapPin(id);
    if (id === 'pondA' || id === 'pondB') { setPond(id === 'pondA' ? 'A' : 'B'); go('observe'); }
    else if (id === 'lab' || id === 'evidence') go(id);
  }

  return <section className="ml-expedition" aria-label="Maple Creek investigation map">
    <div className="ml-map-heading"><span>FIELD SITE / 001</span><h2>Maple Creek</h2><p>Two ponds. One unanswered question.</p></div>
    <div className="ml-compass" aria-hidden="true"><span>N</span><Lucide name="navigation" size={24} /></div>
    <div className="ml-world" data-night={isDark ? 'true' : 'false'}>
      <svg className="ml-terrain" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
        <rect width="1000" height="700" fill="#b9cd8b" />
        <path d="M0 0H600Q540 90 620 180T615 340Q570 430 640 520T660 700H0Z" fill="#a9c783" />
        <path d="M740 0H1000V700H650Q740 570 633 440T715 225Q660 120 740 0" fill="#c6bc8f" />
        <path d="M775 42Q920 10 970 140T866 288Q677 267 689 156T775 42" fill="#b1a78b" />
        <path d="M708 430Q918 389 972 512T824 640Q630 620 633 536T708 430" fill="#b9a57b" />
        <path d="M-20 233Q68 233 125 310T203 401Q239 463 182 525T126 710" fill="none" stroke="#83b9b4" strokeWidth="31" />
        <path d="M-20 233Q68 233 125 310T203 401Q239 463 182 525T126 710" fill="none" stroke="#abd8cd" strokeWidth="16" />
        <g fill="none" stroke="#e4d3a3" strokeWidth="27" strokeLinecap="round">
          <path d="M217 391Q330 473 476 359Q558 310 620 242T771 217" />
          <path d="M486 364Q572 430 648 481T781 539" />
          <path d="M481 374Q464 477 361 562Q297 607 278 714" />
        </g>
        <path d="M808 217Q875 315 817 412L799 460" fill="none" stroke="#777568" strokeWidth="11" />
        <path d="M808 217Q875 315 817 412L799 460" fill="none" stroke="#969485" strokeWidth="4" />
        <g fill="#94b577">{Array.from({ length: 32 }, (_, i) => <path key={i} d={`M${(i * 173 + 40) % 950} ${(i * 97 + 130) % 680}l-4 -9 7 5 4 -8 1 12Z`} />)}</g>
        <g transform="translate(173 479) rotate(28)"><rect width="60" height="27" rx="3" fill="#ae8556" />{[10, 22, 34, 46].map(x => <path key={x} d={`M${x} 0V27`} stroke="#ddbd81" strokeWidth="3" />)}</g>
      </svg>
      <div className="ml-scenery" aria-hidden="true">
        {scenery.map(([name, x, y, width], i) => <WorldSprite key={i} name={name} style={{ left: `${x}%`, top: `${y}%`, width: spriteWidth(width) }} />)}
      </div>
      {locations.map(l => <button key={l.id} type="button" disabled={l.locked}
        aria-label={`${l.name}: ${l.note}${visited.includes(l.id) ? ', visited' : ''}`}
        className={`ml-location ${pulse === l.id ? 'is-current' : ''} ${visited.includes(l.id) ? 'is-visited' : ''}`}
        style={{ left: `${l.x}%`, top: `${l.y}%`, width: spriteWidth(l.width) }}
        onClick={() => visit(l.id)}>
        <WorldSprite name={l.asset} />
        <span className="ml-location-label"><span className="ml-location-name">
          {visited.includes(l.id) ? <Lucide name="check" size={13} /> : l.locked ? <Lucide name="lock" size={12} /> : <span className="ml-location-dot" />}
          {l.name}</span><small>{l.note}</small></span>
      </button>)}
      <WorldSprite name="fish" className="ml-map-prop ml-water-life" style={{ left: '20%', top: '48%', width: spriteWidth(3) }} />
      <WorldSprite name="fish" className="ml-map-prop" style={{ left: '25%', top: '51%', width: spriteWidth(2.5) }} />
      <WorldSprite name="debris" className="ml-map-prop" style={{ left: '77%', top: '72%', width: spriteWidth(5) }} />
      <div className="ml-smoke" aria-hidden="true"><i /><i /><i /></div>
    </div>
    <div className="ml-map-legend"><span><i /> Control habitat</span><span><i /> Affected habitat</span><span>Select a landmark to explore</span></div>
  </section>;
}
