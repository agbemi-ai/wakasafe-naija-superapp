# WakaSafe feature cleanup and NAFDAC Verify

## User-facing changes
- Remove the retired tools and Health Tracker from the visible feature list and navigation; keep Settings available separately.
- Simplify Home to the final nine-item list, using the user's choice of which named feature to omit.
- Replace Drug Info with NAFDAC Verify: one TYPE field for product name plus NAFDAC number, and one SNAP camera flow with text recognition.
- Use the same three-result display for both paths, then show the requested NAFDAC information, reporting action, and explanation.

## Technical details
- Keep the feature catalog as the source for Home and the feature menu; remove retired route files and preserve Settings as an auxiliary page.
- Query NAFDAC's public Greenbook from a server function, matching both the product name and number; classify a product as banned only when an official status or alert supports it.
- The official NAPAMS form is CAPTCHA-gated and Greenbook covers only some categories. Clearly disclose coverage and link users to the official source instead of inventing verification results.
- Use browser-side OCR for Snap, add route-specific metadata, and validate the typed lookup, camera path, Home count, and retired navigation.