# Profile picture personalization

Open **Profile → Personalize** beneath the picture, or **Edit Profile**. Choose a character, science icon, existing picture, or initial; choose a background; add up to six stickers. Select stickers to drag, move with arrow keys, resize, rotate, bring forward, or remove. Save Changes persists the whole design; Cancel and Close discard the draft.

## Database rollout

Apply `supabase/migrations/20260908010000_avatar_personalization.sql` through the project's normal Supabase migration workflow before enabling saves. It adds `students.avatar_style`, validates the JSON, and retains the existing student ownership policies. `supabase/schema.sql` includes the same definition for fresh installations. No live database was changed by this implementation.

Old avatar IDs remain valid. Reads fall back to the old columns if the migration is not installed yet. Saving then displays an availability message and retains the draft rather than pretending it succeeded.

## What to check

1. Sign in as a student and open Profile → Personalize. Switch between Characters, Science, Pictures, and My initial. The large and small previews should update together.
2. Add two different stickers. Drag with mouse or touch, then select a sticker and use arrow keys or the labeled sliders. Size and rotation should change without moving the underlying portrait. Bring to front should change which overlapping sticker is visible.
3. Add six stickers. Further additions should be disabled with a visible explanation. Remove one and check that adding becomes available again.
4. Cancel an edit and reopen. The last saved picture should remain. Save a new design, reload, and sign out/in. The same arrangement should appear on the profile, desktop navigation, and your leaderboard row (if ranked).
5. Test a narrow phone viewport and dark mode. Controls should remain reachable without horizontal scrolling. Tab should stay in the dialog; Escape should close it and return focus to the opener. Saving should disable editing and closing until it finishes.
6. If the network fails during Save, the dialog should keep its draft and show an error. A success-looking close with no saved design is a bug. As another student, confirm that updating the first student's row is rejected by existing RLS.

These runtime checks are for the developer, per `CLAUDE.md`; no browser harness or screenshots were used for this feature.

## Editing the feature by hand

| Location | What to change |
| --- | --- |
| `src/lib/avatars.js`, `CHARACTER_AVATARS` | Picture IDs, visible names, background token classes, and portrait kind. Keep persisted IDs stable. |
| `src/components/AvatarCharacter.jsx` | The six original character drawings; edit SVG geometry and Tailwind paint tokens. |
| `src/lib/avatar-personalization.js` | Backgrounds, sticker labels/icons, allowed sizes and `MAX_STICKERS`. New persisted sticker/background IDs or changed bounds also need a forward-only SQL migration updating `valid_avatar_style`. |
| `src/components/AvatarEditor.jsx` | Editor labels and handlers. `PREVIEW_SIZE = 224` sets preview width/height in px. The desktop first column is `248px`; larger values give the preview more room and the choices less. |
| `src/components/Avatar.jsx` | Shared picture rendering and sticker outline. `size` controls picture diameter; photo backgrounds use an `84%` inset image to leave a visible frame. |
| `src/pages/ProfilePage.jsx`, `EditProfileModal` | Name fields, Save/Cancel, error messages, modal focus handling, and the Personalize entry button. |
| `src/components/layout/Navbar.jsx` | The compact navigation picture uses `size={32}`. The profile picture uses `size={64}`; leaderboard pictures use `size={32}`. |

Placement controls: the editor uses `gap-6` (24px) between columns, `gap-3` (12px) around the preview, and `gap-2` (8px) between choice buttons. Smaller values tighten spacing; larger values spread items apart. `p-4` (16px) pads sticker controls and `p-6` (24px) pads the modal. The preview's sticky `top-0` pins it at the scroll container's top; increasing top moves it down. `max-h-[90dvh]` caps modal height and enables internal scrolling.

Sticker `x` and `y` are center positions from 0–100%: higher x moves right, higher y moves down. Their width/height are the saved `size` percentage of the picture diameter. `translate(-50%, -50%)` centers each sticker on those coordinates; `rotation` rotates clockwise for positive values. Percentages are intentional so the saved arrangement scales identically between the editor, profile, and leaderboard. Circular bounds prevent stickers from being cropped away.
