
## Publishing to GitHub Pages
1. Create a new GitHub repository (e.g. `pomnaths-demo`).
2. Upload all files to the repository root.
3. Go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, click **Save**.
6. Visit `https://<username>.github.io/pomnaths-demo/`.

## Notes
- All content is placeholder / sample data. No real applications or logins are processed.
- Forms are front-end only; they show a success state with an optional prefilled WhatsApp link.
- **Admissions process must be confirmed** with the school and the Department of Education before publishing.
- Event dates are sample only. The Hahenamo countdown uses a sample date (15 October 2025).
- Alumni cards are clearly fictional placeholders.
- Replace `images/` placeholders with real photos when ready.

---

### Self-check (6 lines)
1. No horizontal overflow at 320, 360, 390, 768, 1024, 1440, 1920px — `overflow-x: clip` on body; sun disc uses `clamp()` and its wrapper clips.
2. Mobile nav uses Bootstrap collapse; sticky Apply + WhatsApp bar appears only on phones (≤575.98px).
3. All internal links (`index.html`, `about.html`, `academics.html`, `events.html`, `alumni.html`, `admissions.html`, `gallery.html`, `contact.html`) resolve correctly relative to root.
4. `prefers-reduced-motion` disables quadrant snap, formula marquee, and floating glyphs.
5. One `<h1>` per page, skip link, visible focus rings, ARIA labels on icon buttons, semantic landmarks.
6. Calendar becomes an agenda list below 576px; event category filters work; `.ics` download works; alumni portal is clearly marked demo; admissions process flagged for confirmation.