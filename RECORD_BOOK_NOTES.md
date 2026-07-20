# BGW Record Book — Data and Update Notes

## Included in this build
- 184 total round records
- 152 standard 18-hole classic rounds
- 2,856 hole-score records
- 46 matches
- 18 courses
- 46 record leaderboards across six sections
- 13 historical golfers, including 12 currently active golfers

## Calculation rules
1. Standard scoring records use only rows marked `Classic`.
2. Par-3 and alternate-drive rounds are kept in the source data but excluded from standard 18-hole leaderboards.
3. Career scoring averages and percentage-based career records require at least eight classic rounds.
4. Gross birdies, eagles, pars, bogey avoidance and hole difficulty come from the Hole Scores sheet.
5. Ties use competition ranking: 1, 2, 2, 4.
6. All entries tied at the tenth-ranked value are displayed.
7. Match percentage equals `(wins + 0.5 × ties) ÷ matches`.
8. Thirty-six and 54-hole trip totals use each golfer's lowest two or three classic rounds from that trip because the workbook does not include a reliable round-order field.
9. Championship wins and top-three finishes use the `Place` field in the Rounds sheet.

## Files added or changed
- `recordbook.html`
- `assets/css/recordbook.css`
- `assets/js/recordbook.js`
- `data/bgw-records.json`

## Annual update process
Add the new trip data to the master workbook and regenerate `data/bgw-records.json`. The Record Book page itself does not need to be redesigned when only the data changes.

## Known data notes
- The Rounds sheet contains 184 rows, but only 164 rounds have hole-by-hole data: 152 classic rounds and 12 ten-hole Baths rounds.
- Mountain Top and other alternate-format rounds do not have hole-by-hole records in the supplied workbook.
- AJ Santomuraro appears with several spellings in the workbook; those entries are normalized to `AJ Santomuraro` in the Record Book.
- Mitch Muller is inactive but remains in historical leaderboards where applicable.
