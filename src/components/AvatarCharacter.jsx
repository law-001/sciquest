// Original vector portraits. All paints use the project's Tailwind palette.
export function AvatarCharacter({ character }) {
  const eyes = <g className="fill-stone-900"><circle cx="39" cy="52" r="4" /><circle cx="61" cy="52" r="4" /></g>;
  return <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
    {character === 'robot' && <>
      <path d="M50 18V8" className="stroke-stone-700" strokeWidth="4" /><circle cx="50" cy="8" r="5" className="fill-amber-300" />
      <rect x="17" y="31" width="66" height="51" rx="15" className="fill-teal-100 stroke-teal-700" strokeWidth="3" />
      <rect x="25" y="40" width="50" height="24" rx="9" className="fill-stone-800" /><g className="fill-amber-300"><circle cx="37" cy="52" r="5" /><circle cx="63" cy="52" r="5" /></g>
      <path d="M41 72h18" className="stroke-teal-700" strokeWidth="4" strokeLinecap="round" />
    </>}
    {character === 'cat' && <>
      <path d="M22 46 18 17 43 30h14l25-13-4 29v23q-28 27-56 0z" className="fill-orange-200 stroke-orange-700" strokeWidth="3" />
      <path d="m25 25 12 8-10 7m48-15-12 8 10 7" className="fill-rose-300" />{eyes}
      <path d="m46 64 4 4 4-4M50 68v6m-27-15 14 3m-14 9 14-2m40-10-14 3m14 9-14-2" className="stroke-orange-800" fill="none" strokeWidth="2.5" strokeLinecap="round" />
    </>}
    {character === 'frog' && <>
      <ellipse cx="50" cy="61" rx="34" ry="27" className="fill-lime-300" />
      <g className="fill-lime-300"><circle cx="29" cy="36" r="16" /><circle cx="71" cy="36" r="16" /></g>
      <g className="fill-white"><circle cx="29" cy="36" r="10" /><circle cx="71" cy="36" r="10" /></g><g className="fill-stone-900"><circle cx="31" cy="37" r="4" /><circle cx="69" cy="37" r="4" /></g>
      <path d="M31 63q19 17 38 0" className="stroke-emerald-800" fill="none" strokeWidth="3" strokeLinecap="round" />
    </>}
    {character === 'astronaut' && <>
      <path d="M20 100V84q30-23 60 0v16" className="fill-orange-400" />
      <circle cx="50" cy="47" r="35" className="fill-stone-100 stroke-stone-300" strokeWidth="3" />
      <rect x="21" y="27" width="58" height="39" rx="18" className="fill-teal-900" />
      <path d="M30 43q4-9 13-9" className="stroke-teal-200" fill="none" strokeWidth="4" strokeLinecap="round" />
      <path d="m62 38 3 6 6 3-6 3-3 6-3-6-6-3 6-3z" className="fill-amber-200" />
    </>}
    {character === 'owl' && <>
      <path d="M19 20 39 31h22l20-11-3 48q-28 38-56 0z" className="fill-amber-700" />
      <g className="fill-amber-100"><circle cx="34" cy="49" r="18" /><circle cx="66" cy="49" r="18" /></g>
      <g className="fill-stone-900"><circle cx="35" cy="48" r="6" /><circle cx="65" cy="48" r="6" /></g>
      <path d="m43 60 7 11 7-11" className="fill-orange-400" /><path d="m38 78 6 5m12 0 6-5" className="stroke-amber-200" strokeWidth="3" />
    </>}
    {character === 'sun' && <>
      <g className="stroke-amber-200" strokeWidth="7" strokeLinecap="round"><path d="M50 9v9m0 64v9M9 50h9m64 0h9M21 21l7 7m44 44 7 7m0-58-7 7M28 72l-7 7" /></g>
      <circle cx="50" cy="50" r="29" className="fill-amber-300" />{eyes}<path d="M40 64q10 10 20 0" className="stroke-orange-800" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>}
  </svg>;
}
