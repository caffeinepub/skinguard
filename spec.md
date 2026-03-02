# Specification

## Summary
**Goal:** Fix incorrect ingredient safety classifications, expand the ingredient database, add a compatibility rate score, and update the UI to accurately display per-ingredient safety verdicts.

**Planned changes:**
- Fix backend safety classification logic so harmful/irritating ingredients (alcohol, ethanol, sodium lauryl sulfate, sodium laureth sulfate, fragrance, parabens, formaldehyde, etc.) are correctly classified as harmful or irritants instead of suitable.
- Expand the ingredient database to at least 60 common skincare ingredients, each with accurate safety classifications (harmful, caution, or beneficial), descriptions, suitable skin types, and concern tags.
- Add a compatibility rate score (0–100%) computed from the ratio and severity of harmful vs. beneficial ingredients in a submitted product, displayed with a qualitative label (e.g., "Compatibility Rate: 72% — Moderate").
- Update the `ProductSuitabilityCheckerPage` and `IngredientAnalysis` frontend components to display color-coded badges: green for "Good for Skin", yellow for "Caution", and red for "Bad for Skin / Avoid".
- Ensure the `IngredientDetailModal` reflects the corrected classifications for all updated ingredients.

**User-visible outcome:** Users who check ingredients like alcohol or sodium lauryl sulfate will now see accurate "Bad for Skin" or "Irritant" results with red badges, beneficial ingredients will show green badges, and an overall compatibility rate score will be displayed after each product analysis.
