# Boys Golf Weekend Website — v1.0

This repository contains the complete static Boys Golf Weekend website. It is designed for GitHub Pages and uses plain HTML, CSS, and JavaScript.

## Publishing to GitHub Pages

1. Delete the existing website files from the repository, while keeping the repository itself.
2. Upload **the contents of this ZIP**, not the outer `BGW-Website-v1.0` folder.
3. Commit the uploaded files to the branch used by GitHub Pages.
4. In **Settings → Pages**, use:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
5. Open **Actions** and confirm the latest Pages deployment has a green checkmark.
6. Hard-refresh the published site after deployment.

The repository root should contain `index.html`, `styles.css`, `script.js`, and the folders `assets`, `players`, `results`, `trips`, and `locations`.

## Main Pages

- `index.html` — homepage
- `crew.html` — player directory
- `trip-2026.html` — current trip
- `future-locations.html` — future destination candidates
- `trip-history.html` — trip history and course rankings
- `results-stats.html` — results hub
- `recordbook.html` — BGW record book
- `merch.html` — merchandise page

## Competition Center

The Ryder Cup-style Competition Center is located at `results/team-match-results.html`.

Supporting files:

- `assets/data/competition-data.js`
- `assets/js/competition-center.js`
- `assets/css/competition-center.css`

The included data contains the corrected official Net Championship standings and tied-place labels. Third-place points are split when necessary, and overall team totals are recalculated accordingly.

## Player Profiles

Player pages are stored in `players/`. The profiles include career statistics, handicap history, and trophy cases. BGW Bingo and Personal Best scorecards have intentionally been removed from the profiles and from the final asset package.

## Updating the Site

### Images

Keep images in the existing asset folders and preserve filenames referenced by the HTML.

### Competition data

Update `assets/data/competition-data.js` when adding matches, sessions, teams, or a new trip year. Preserve the existing object structure so the Competition Center continues to render correctly.

### Navigation

The site uses relative links. When adding a page inside a subfolder, links back to root-level pages should begin with `../`.

## Troubleshooting

- **Old version still showing:** hard-refresh or open a private browser window.
- **404 page:** confirm the ZIP contents were uploaded to the repository root without an extra outer folder.
- **Missing styles or images:** filenames and folder names are case-sensitive on GitHub Pages.
- **No deployment:** check **Actions → pages build and deployment**.
- **Competition Center is blank:** confirm all three Competition Center support files are present in their exact paths.

## Access Gate

The client-side site password remains `BGW`. This is a convenience gate, not secure authentication; all files published through GitHub Pages remain publicly retrievable.
