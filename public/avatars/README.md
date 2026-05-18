# Dev-supplied avatars

Pictures students can pick from in **Edit Profile**. Users cannot upload
their own — only avatars listed in the catalog are selectable.

## Adding a picture

1. Drop the file in this folder, e.g. `public/avatars/einstein.png`
   (square images, ~256×256+, PNG/JPG/WEBP).
2. Add an entry to `IMAGE_AVATARS` in [`src/lib/avatars.js`](../../src/lib/avatars.js):

   ```js
   const IMAGE_AVATARS = [
     { id: 'einstein', label: 'Einstein', src: '/avatars/einstein.png' },
   ].map((a) => ({ ...a, kind: 'image' }))
   ```

`id` is what gets stored on `students.avatar`, so keep it stable — don't
rename an `id` that students may already have selected.

The built-in science glyph avatars need no files; they live entirely in
`src/lib/avatars.js`.
