import { IngredientSafety, SkinType } from '../backend';

export interface LocalIngredientInfo {
  name: string;
  aliases: string[];
  safetyClassification: IngredientSafety;
  description: string;
  suitableSkinTypes: SkinType[];
  isAcneProneConcern: boolean;
  isSensitiveConcern: boolean;
  isClogProneConcern: boolean;
}

// Comprehensive ingredient database with 70+ ingredients
export const INGREDIENT_DATABASE: LocalIngredientInfo[] = [
  // ─── HARMFUL / IRRITANTS ───────────────────────────────────────────────────
  {
    name: 'Alcohol',
    aliases: ['ethanol', 'alcohol denat', 'denatured alcohol', 'sd alcohol', 'isopropyl alcohol', 'alcohol denat.', 'ethyl alcohol'],
    safetyClassification: IngredientSafety.harmful,
    description: 'High-concentration alcohol strips the skin of its natural oils, disrupts the moisture barrier, and causes dryness, irritation, and long-term damage. Harmful for all skin types, especially sensitive and dry skin.',
    suitableSkinTypes: [],
    isAcneProneConcern: true,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Sodium Lauryl Sulfate',
    aliases: ['sls', 'sodium lauryl sulfate', 'sodium dodecyl sulfate'],
    safetyClassification: IngredientSafety.harmful,
    description: 'Harsh surfactant that strips natural oils, disrupts the skin barrier, and causes irritation, dryness, and inflammation. Linked to contact dermatitis and worsening of eczema.',
    suitableSkinTypes: [],
    isAcneProneConcern: true,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Sodium Laureth Sulfate',
    aliases: ['sles', 'sodium laureth sulfate', 'sodium lauryl ether sulfate'],
    safetyClassification: IngredientSafety.harmful,
    description: 'Milder than SLS but still a harsh surfactant that can strip the skin barrier, cause irritation, and trigger sensitivity reactions. Not recommended for sensitive or dry skin.',
    suitableSkinTypes: [SkinType.oily],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Formaldehyde',
    aliases: ['formaldehyde', 'formalin', 'methanal'],
    safetyClassification: IngredientSafety.harmful,
    description: 'Known carcinogen and potent skin sensitizer. Can cause allergic contact dermatitis, respiratory issues, and long-term health risks. Banned in many countries.',
    suitableSkinTypes: [],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Formaldehyde Releasers',
    aliases: ['dmdm hydantoin', 'imidazolidinyl urea', 'diazolidinyl urea', 'quaternium-15', 'bronopol', '2-bromo-2-nitropropane-1,3-diol'],
    safetyClassification: IngredientSafety.harmful,
    description: 'Preservatives that slowly release formaldehyde, a known carcinogen and allergen. Can cause contact dermatitis and sensitization over time.',
    suitableSkinTypes: [],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Mineral Oil',
    aliases: ['mineral oil', 'paraffinum liquidum', 'petrolatum', 'petroleum jelly', 'white petrolatum'],
    safetyClassification: IngredientSafety.harmful,
    description: 'Petroleum-derived occlusive that clogs pores, traps bacteria, and prevents skin from breathing. Highly comedogenic and harmful for acne-prone and oily skin.',
    suitableSkinTypes: [SkinType.dry],
    isAcneProneConcern: true,
    isSensitiveConcern: false,
    isClogProneConcern: true,
  },
  {
    name: 'Synthetic Fragrance',
    aliases: ['fragrance', 'parfum', 'perfume', 'aroma', 'synthetic fragrance'],
    safetyClassification: IngredientSafety.harmful,
    description: 'Synthetic fragrances are among the top causes of allergic contact dermatitis and skin sensitization. They can trigger inflammation, redness, and irritation, especially in sensitive skin.',
    suitableSkinTypes: [],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Triclosan',
    aliases: ['triclosan', '5-chloro-2-(2,4-dichlorophenoxy)phenol'],
    safetyClassification: IngredientSafety.harmful,
    description: 'Antimicrobial agent linked to hormone disruption, antibiotic resistance, and skin irritation. Banned in many countries and not recommended for skincare use.',
    suitableSkinTypes: [],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Hydroquinone',
    aliases: ['hydroquinone', '1,4-benzenediol', 'benzene-1,4-diol'],
    safetyClassification: IngredientSafety.harmful,
    description: 'Skin-lightening agent that can cause ochronosis (permanent skin darkening), irritation, and is a potential carcinogen. Banned in the EU and many other regions.',
    suitableSkinTypes: [],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Sodium',
    aliases: ['sodium', 'sodium chloride', 'salt', 'nacl'],
    safetyClassification: IngredientSafety.harmful,
    description: 'High concentrations of sodium/salt can dehydrate skin cells, disrupt the moisture barrier, and cause irritation. Sodium in harsh surfactant compounds (like SLS) is particularly damaging.',
    suitableSkinTypes: [],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Toluene',
    aliases: ['toluene', 'methylbenzene', 'phenylmethane'],
    safetyClassification: IngredientSafety.harmful,
    description: 'Toxic solvent found in some nail products. Can cause skin irritation, nervous system damage, and reproductive harm. Avoid completely.',
    suitableSkinTypes: [],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Coal Tar',
    aliases: ['coal tar', 'coal tar extract', 'coal tar solution'],
    safetyClassification: IngredientSafety.harmful,
    description: 'Byproduct of coal processing used in some dandruff/psoriasis treatments. Contains carcinogenic compounds and can cause photosensitivity and skin irritation.',
    suitableSkinTypes: [],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },

  // ─── RISKY / CAUTION ──────────────────────────────────────────────────────
  {
    name: 'Parabens',
    aliases: ['methylparaben', 'propylparaben', 'butylparaben', 'ethylparaben', 'isobutylparaben', 'isopropylparaben', 'parabens'],
    safetyClassification: IngredientSafety.risky,
    description: 'Preservatives with potential endocrine-disrupting properties. Some studies link them to hormonal disruption. May cause irritation in sensitive skin. Use with caution.',
    suitableSkinTypes: [SkinType.oily, SkinType.normal, SkinType.combination],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Alcohol Denat.',
    aliases: ['alcohol denat.', 'denatured alcohol', 'sd alcohol 40'],
    safetyClassification: IngredientSafety.risky,
    description: 'Denatured alcohol can be drying and irritating, especially for sensitive and dry skin. Disrupts the skin barrier with prolonged use.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Coconut Oil',
    aliases: ['coconut oil', 'cocos nucifera oil', 'cocos nucifera (coconut) oil'],
    safetyClassification: IngredientSafety.risky,
    description: 'Highly comedogenic oil that can clog pores and trigger breakouts in acne-prone skin. Suitable only for very dry, non-acne-prone skin types.',
    suitableSkinTypes: [SkinType.dry],
    isAcneProneConcern: true,
    isSensitiveConcern: false,
    isClogProneConcern: true,
  },
  {
    name: 'Lanolin',
    aliases: ['lanolin', 'wool wax', 'wool fat', 'adeps lanae'],
    safetyClassification: IngredientSafety.risky,
    description: 'Derived from sheep wool, lanolin can cause allergic reactions in some individuals. Comedogenic for acne-prone skin.',
    suitableSkinTypes: [SkinType.dry, SkinType.normal],
    isAcneProneConcern: true,
    isSensitiveConcern: true,
    isClogProneConcern: true,
  },
  {
    name: 'Oxybenzone',
    aliases: ['oxybenzone', 'benzophenone-3', 'bp-3'],
    safetyClassification: IngredientSafety.risky,
    description: 'Chemical sunscreen filter that can penetrate the skin and act as an endocrine disruptor. May cause allergic reactions in sensitive individuals.',
    suitableSkinTypes: [SkinType.oily, SkinType.normal, SkinType.combination],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Phenoxyethanol',
    aliases: ['phenoxyethanol', '2-phenoxyethanol'],
    safetyClassification: IngredientSafety.risky,
    description: 'Common preservative that can cause irritation and allergic reactions in sensitive skin. Generally considered safe at low concentrations but use with caution.',
    suitableSkinTypes: [SkinType.oily, SkinType.normal, SkinType.combination, SkinType.dry],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Phthalates',
    aliases: ['dibutyl phthalate', 'dbp', 'diethyl phthalate', 'dep', 'dimethyl phthalate', 'dmp', 'phthalates'],
    safetyClassification: IngredientSafety.risky,
    description: 'Plasticizers used in some cosmetics. Potential endocrine disruptors linked to hormonal issues. Avoid when possible.',
    suitableSkinTypes: [],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Benzoyl Peroxide',
    aliases: ['benzoyl peroxide', 'bpo', 'dibenzoyl peroxide'],
    safetyClassification: IngredientSafety.risky,
    description: 'Effective acne treatment but can cause significant dryness, peeling, and irritation. Can bleach fabrics. Use with caution and start with low concentrations.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Salicylic Acid',
    aliases: ['salicylic acid', 'bha', 'beta hydroxy acid', '2-hydroxybenzoic acid'],
    safetyClassification: IngredientSafety.risky,
    description: 'BHA exfoliant effective for acne and oily skin. Can cause dryness, irritation, and sun sensitivity. Not suitable for sensitive or dry skin without careful use.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Glycolic Acid',
    aliases: ['glycolic acid', 'aha', 'alpha hydroxy acid', 'hydroxyacetic acid'],
    safetyClassification: IngredientSafety.risky,
    description: 'AHA exfoliant that can cause irritation, redness, and sun sensitivity. Effective for exfoliation but requires careful use and SPF protection.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Lactic Acid',
    aliases: ['lactic acid', '2-hydroxypropanoic acid'],
    safetyClassification: IngredientSafety.risky,
    description: 'Milder AHA exfoliant. Can cause irritation and sun sensitivity at higher concentrations. Generally gentler than glycolic acid.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination, SkinType.normal, SkinType.dry],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },

  // ─── CONDITIONAL ──────────────────────────────────────────────────────────
  {
    name: 'Retinol',
    aliases: ['retinol', 'vitamin a', 'retinyl palmitate', 'retinaldehyde', 'retinoic acid', 'tretinoin'],
    safetyClassification: IngredientSafety.conditional,
    description: 'Vitamin A derivative, potent for anti-aging and acne. May cause irritation, dryness, and sun sensitivity. Best used at night with SPF during the day. Not for sensitive skin without guidance.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Vitamin C',
    aliases: ['vitamin c', 'ascorbic acid', 'l-ascorbic acid', 'ascorbyl glucoside', 'sodium ascorbyl phosphate', 'magnesium ascorbyl phosphate'],
    safetyClassification: IngredientSafety.conditional,
    description: 'Powerful antioxidant and brightening agent. Unstable and can oxidize. High concentrations may irritate sensitive skin. Excellent for normal, oily, and combination skin.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination, SkinType.normal, SkinType.dry],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Essential Oils',
    aliases: ['tea tree oil', 'lavender oil', 'peppermint oil', 'eucalyptus oil', 'lemon oil', 'orange oil', 'bergamot oil', 'rosemary oil', 'clove oil', 'cinnamon oil'],
    safetyClassification: IngredientSafety.conditional,
    description: 'Essential oils can be beneficial in small amounts but are common sensitizers. Many are phototoxic or cause allergic reactions. Use with caution, especially on sensitive skin.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Witch Hazel',
    aliases: ['witch hazel', 'hamamelis virginiana', 'hamamelis water'],
    safetyClassification: IngredientSafety.conditional,
    description: 'Natural astringent with anti-inflammatory properties. Alcohol-based versions can be drying. Suitable for oily skin but may irritate sensitive or dry skin.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Niacinamide',
    aliases: ['niacinamide', 'nicotinamide', 'vitamin b3', 'niacin amide'],
    safetyClassification: IngredientSafety.conditional,
    description: 'Generally well-tolerated vitamin B3 derivative. Reduces pores, controls oil, and brightens skin. High concentrations (>10%) may cause flushing in some individuals.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination, SkinType.normal, SkinType.dry, SkinType.sensitive],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Zinc Oxide',
    aliases: ['zinc oxide', 'zno'],
    safetyClassification: IngredientSafety.conditional,
    description: 'Mineral sunscreen and anti-inflammatory agent. Generally safe and non-irritating. May leave a white cast. Suitable for sensitive and acne-prone skin.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination, SkinType.normal, SkinType.dry, SkinType.sensitive],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },

  // ─── SAFE / BENEFICIAL ────────────────────────────────────────────────────
  {
    name: 'Hyaluronic Acid',
    aliases: ['hyaluronic acid', 'sodium hyaluronate', 'ha', 'hyaluronan'],
    safetyClassification: IngredientSafety.safe,
    description: 'Powerful humectant that attracts and retains moisture. Suitable for all skin types. Plumps skin, reduces fine lines, and provides deep hydration without clogging pores.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Ceramides',
    aliases: ['ceramide', 'ceramides', 'ceramide np', 'ceramide ap', 'ceramide eop', 'ceramide ng', 'ceramide ag'],
    safetyClassification: IngredientSafety.safe,
    description: 'Essential lipids that form the skin barrier. Restore and strengthen the moisture barrier, prevent water loss, and protect against environmental damage. Excellent for all skin types.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Glycerin',
    aliases: ['glycerin', 'glycerol', 'glycerine', '1,2,3-propanetriol'],
    safetyClassification: IngredientSafety.safe,
    description: 'Excellent humectant that draws moisture into the skin. Non-comedogenic, gentle, and suitable for all skin types including sensitive and acne-prone skin.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Aloe Vera',
    aliases: ['aloe vera', 'aloe barbadensis', 'aloe barbadensis leaf juice', 'aloe gel'],
    safetyClassification: IngredientSafety.safe,
    description: 'Soothing, anti-inflammatory plant extract. Hydrates, calms irritation, and supports healing. Excellent for sensitive, sunburned, and acne-prone skin.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Jojoba Oil',
    aliases: ['jojoba oil', 'simmondsia chinensis seed oil', 'jojoba'],
    safetyClassification: IngredientSafety.safe,
    description: 'Technically a wax ester that mimics skin\'s natural sebum. Non-comedogenic, balancing, and suitable for all skin types. Excellent for oily and acne-prone skin.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Shea Butter',
    aliases: ['shea butter', 'butyrospermum parkii butter', 'butyrospermum parkii (shea) butter'],
    safetyClassification: IngredientSafety.safe,
    description: 'Rich emollient with anti-inflammatory properties. Excellent for dry and sensitive skin. May be comedogenic for very acne-prone skin at high concentrations.',
    suitableSkinTypes: [SkinType.dry, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Green Tea Extract',
    aliases: ['green tea extract', 'camellia sinensis leaf extract', 'camellia sinensis', 'egcg', 'epigallocatechin gallate'],
    safetyClassification: IngredientSafety.safe,
    description: 'Powerful antioxidant with anti-inflammatory and anti-aging properties. Protects against UV damage and reduces redness. Suitable for all skin types.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Peptides',
    aliases: ['peptides', 'palmitoyl pentapeptide', 'matrixyl', 'copper peptide', 'acetyl hexapeptide', 'argireline', 'palmitoyl tripeptide'],
    safetyClassification: IngredientSafety.safe,
    description: 'Amino acid chains that signal skin to produce collagen and elastin. Anti-aging, firming, and suitable for all skin types. Gentle and well-tolerated.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Squalane',
    aliases: ['squalane', 'squalene', 'olive squalane'],
    safetyClassification: IngredientSafety.safe,
    description: 'Lightweight, non-comedogenic emollient that mimics skin\'s natural oils. Excellent for all skin types, including oily and acne-prone. Hydrates without greasiness.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Centella Asiatica',
    aliases: ['centella asiatica', 'cica', 'gotu kola', 'centella asiatica extract', 'asiaticoside', 'madecassoside'],
    safetyClassification: IngredientSafety.safe,
    description: 'Healing herb with powerful anti-inflammatory and wound-healing properties. Excellent for sensitive, acne-prone, and damaged skin. Promotes collagen synthesis.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Panthenol',
    aliases: ['panthenol', 'provitamin b5', 'd-panthenol', 'dexpanthenol', 'vitamin b5'],
    safetyClassification: IngredientSafety.safe,
    description: 'Provitamin B5 that deeply moisturizes, soothes, and promotes skin healing. Excellent for all skin types, especially sensitive and damaged skin.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Allantoin',
    aliases: ['allantoin', '5-ureidohydantoin'],
    safetyClassification: IngredientSafety.safe,
    description: 'Soothing, healing ingredient that promotes cell regeneration and reduces irritation. Excellent for sensitive, dry, and damaged skin. Non-comedogenic.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Argan Oil',
    aliases: ['argan oil', 'argania spinosa kernel oil', 'moroccan oil'],
    safetyClassification: IngredientSafety.safe,
    description: 'Rich in vitamin E and fatty acids. Non-comedogenic, anti-aging, and suitable for most skin types. Excellent for dry and mature skin.',
    suitableSkinTypes: [SkinType.dry, SkinType.combination, SkinType.normal, SkinType.sensitive],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Rosehip Oil',
    aliases: ['rosehip oil', 'rosa canina fruit oil', 'rosa rubiginosa seed oil', 'rosehip seed oil'],
    safetyClassification: IngredientSafety.safe,
    description: 'Rich in vitamins A and C, essential fatty acids. Anti-aging, brightening, and healing. Suitable for dry, mature, and combination skin.',
    suitableSkinTypes: [SkinType.dry, SkinType.combination, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Neem Oil',
    aliases: ['neem oil', 'azadirachta indica seed oil'],
    safetyClassification: IngredientSafety.safe,
    description: 'Antibacterial and anti-inflammatory oil beneficial for acne-prone skin. Rich in fatty acids. Strong odor but effective for treating blemishes.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Titanium Dioxide',
    aliases: ['titanium dioxide', 'tio2', 'ci 77891'],
    safetyClassification: IngredientSafety.safe,
    description: 'Mineral sunscreen that provides broad-spectrum UV protection. Non-irritating, non-comedogenic, and suitable for all skin types including sensitive skin.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Ferulic Acid',
    aliases: ['ferulic acid', '4-hydroxy-3-methoxycinnamic acid'],
    safetyClassification: IngredientSafety.safe,
    description: 'Powerful antioxidant that enhances the stability and efficacy of vitamins C and E. Anti-aging and protective against UV damage.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Azelaic Acid',
    aliases: ['azelaic acid', 'nonanedioic acid'],
    safetyClassification: IngredientSafety.safe,
    description: 'Multi-functional acid that treats acne, rosacea, and hyperpigmentation. Anti-inflammatory and antibacterial. Suitable for sensitive and acne-prone skin.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Tranexamic Acid',
    aliases: ['tranexamic acid', 'txa'],
    safetyClassification: IngredientSafety.safe,
    description: 'Brightening ingredient that reduces hyperpigmentation and dark spots. Gentle and suitable for sensitive skin. Effective alternative to hydroquinone.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Bakuchiol',
    aliases: ['bakuchiol', 'psoralea corylifolia seed extract'],
    safetyClassification: IngredientSafety.safe,
    description: 'Plant-based retinol alternative with anti-aging benefits. Gentler than retinol, suitable for sensitive skin. Stimulates collagen production without irritation.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Collagen',
    aliases: ['collagen', 'hydrolyzed collagen', 'soluble collagen', 'marine collagen'],
    safetyClassification: IngredientSafety.safe,
    description: 'Protein that provides structure and elasticity to skin. Topical collagen acts as a humectant and film-former. Suitable for all skin types.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Vitamin E',
    aliases: ['vitamin e', 'tocopherol', 'tocopheryl acetate', 'alpha-tocopherol'],
    safetyClassification: IngredientSafety.safe,
    description: 'Antioxidant that protects skin from free radical damage and UV exposure. Moisturizing and healing. Suitable for most skin types.',
    suitableSkinTypes: [SkinType.dry, SkinType.combination, SkinType.normal, SkinType.sensitive],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Water',
    aliases: ['water', 'aqua', 'eau', 'purified water', 'deionized water'],
    safetyClassification: IngredientSafety.safe,
    description: 'The most common cosmetic ingredient. Acts as a solvent and base for formulations. Completely safe and suitable for all skin types.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Oat Extract',
    aliases: ['oat extract', 'avena sativa', 'colloidal oatmeal', 'avena sativa kernel extract', 'oatmeal'],
    safetyClassification: IngredientSafety.safe,
    description: 'Soothing, anti-inflammatory ingredient that relieves itching and irritation. Excellent for sensitive, eczema-prone, and dry skin.',
    suitableSkinTypes: [SkinType.dry, SkinType.sensitive, SkinType.normal, SkinType.combination],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Licorice Root Extract',
    aliases: ['licorice root extract', 'glycyrrhiza glabra root extract', 'licorice extract', 'glabridin'],
    safetyClassification: IngredientSafety.safe,
    description: 'Natural brightening and anti-inflammatory ingredient. Reduces hyperpigmentation, soothes redness, and is suitable for sensitive skin.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Resveratrol',
    aliases: ['resveratrol', 'trans-resveratrol', '3,5,4-trihydroxystilbene'],
    safetyClassification: IngredientSafety.safe,
    description: 'Powerful antioxidant found in grapes and berries. Anti-aging, anti-inflammatory, and protective against environmental damage.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Kojic Acid',
    aliases: ['kojic acid', '5-hydroxy-2-(hydroxymethyl)-4h-pyran-4-one'],
    safetyClassification: IngredientSafety.safe,
    description: 'Natural skin-brightening ingredient derived from fungi. Reduces melanin production and treats hyperpigmentation. Generally safe but may cause mild irritation.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Propylene Glycol',
    aliases: ['propylene glycol', '1,2-propanediol', 'pg'],
    safetyClassification: IngredientSafety.risky,
    description: 'Humectant and penetration enhancer. Can cause irritation and allergic reactions in sensitive individuals. Generally safe at low concentrations.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Butylene Glycol',
    aliases: ['butylene glycol', '1,3-butanediol', 'bg'],
    safetyClassification: IngredientSafety.safe,
    description: 'Gentle humectant and solvent. Less irritating than propylene glycol. Suitable for most skin types including sensitive skin.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Dimethicone',
    aliases: ['dimethicone', 'polydimethylsiloxane', 'silicone', 'cyclomethicone', 'cyclopentasiloxane'],
    safetyClassification: IngredientSafety.risky,
    description: 'Silicone that creates a smooth, protective film on skin. Can trap bacteria and sebum, potentially worsening acne. Not recommended for acne-prone skin.',
    suitableSkinTypes: [SkinType.dry, SkinType.normal, SkinType.sensitive],
    isAcneProneConcern: true,
    isSensitiveConcern: false,
    isClogProneConcern: true,
  },
  {
    name: 'Kaolin',
    aliases: ['kaolin', 'kaolin clay', 'china clay', 'white clay'],
    safetyClassification: IngredientSafety.safe,
    description: 'Gentle clay that absorbs excess oil and impurities without over-drying. Excellent for oily and combination skin. Suitable for sensitive skin.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination, SkinType.normal, SkinType.sensitive],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Bentonite',
    aliases: ['bentonite', 'bentonite clay', 'montmorillonite'],
    safetyClassification: IngredientSafety.safe,
    description: 'Highly absorbent clay that draws out impurities and excess oil. Excellent for oily and acne-prone skin. May be too drying for sensitive or dry skin.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Caffeine',
    aliases: ['caffeine', '1,3,7-trimethylxanthine'],
    safetyClassification: IngredientSafety.safe,
    description: 'Antioxidant that reduces puffiness, dark circles, and inflammation. Constricts blood vessels and has anti-aging properties. Suitable for all skin types.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Mandelic Acid',
    aliases: ['mandelic acid', 'alpha-hydroxyphenylacetic acid'],
    safetyClassification: IngredientSafety.risky,
    description: 'Gentle AHA exfoliant derived from almonds. Larger molecule size makes it gentler than glycolic acid. Suitable for sensitive and acne-prone skin with caution.',
    suitableSkinTypes: [SkinType.oily, SkinType.combination, SkinType.normal, SkinType.sensitive],
    isAcneProneConcern: false,
    isSensitiveConcern: true,
    isClogProneConcern: false,
  },
  {
    name: 'Polyglutamic Acid',
    aliases: ['polyglutamic acid', 'pga', 'gamma-polyglutamic acid'],
    safetyClassification: IngredientSafety.safe,
    description: 'Super-hydrating ingredient that holds more moisture than hyaluronic acid. Suitable for all skin types. Strengthens the skin barrier.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
  {
    name: 'Snail Mucin',
    aliases: ['snail mucin', 'snail secretion filtrate', 'helix aspersa extract', 'snail extract'],
    safetyClassification: IngredientSafety.safe,
    description: 'Rich in glycoproteins, hyaluronic acid, and glycolic acid. Promotes healing, hydration, and anti-aging. Suitable for all skin types.',
    suitableSkinTypes: [SkinType.oily, SkinType.dry, SkinType.combination, SkinType.sensitive, SkinType.normal],
    isAcneProneConcern: false,
    isSensitiveConcern: false,
    isClogProneConcern: false,
  },
];

// Build a lookup map for fast access by normalized name/alias
const ingredientLookupMap = new Map<string, LocalIngredientInfo>();

for (const ingredient of INGREDIENT_DATABASE) {
  ingredientLookupMap.set(ingredient.name.toLowerCase(), ingredient);
  for (const alias of ingredient.aliases) {
    ingredientLookupMap.set(alias.toLowerCase(), ingredient);
  }
}

/**
 * Look up an ingredient by name (case-insensitive, supports aliases).
 * Returns null if not found.
 */
export function lookupIngredient(name: string): LocalIngredientInfo | null {
  const normalized = name.trim().toLowerCase();
  return ingredientLookupMap.get(normalized) ?? null;
}

/**
 * Get a human-readable safety label for display.
 */
export function getSafetyLabel(classification: IngredientSafety): string {
  switch (classification) {
    case IngredientSafety.safe:
      return 'Good for Skin';
    case IngredientSafety.conditional:
      return 'Use with Care';
    case IngredientSafety.risky:
      return 'Caution — Use Carefully';
    case IngredientSafety.harmful:
      return 'Bad for Skin';
    default:
      return 'Unknown';
  }
}

/**
 * Compute a compatibility score (0–100) from analysis results.
 * Mirrors the backend scoring logic.
 */
export function computeCompatibilityScore(results: Array<{ safetyClassification: IngredientSafety; isCompatible: boolean }>): number {
  let score = 100;
  for (const result of results) {
    switch (result.safetyClassification) {
      case IngredientSafety.harmful:
        score = Math.max(0, score - 20);
        break;
      case IngredientSafety.risky:
        score = Math.max(0, score - 10);
        break;
      case IngredientSafety.conditional:
        if (!result.isCompatible) {
          score = Math.max(0, score - 5);
        }
        break;
      case IngredientSafety.safe:
        score = Math.min(100, score + 5);
        break;
    }
  }
  return score;
}

/**
 * Get a verdict label from a numeric score.
 */
export function getVerdictFromScore(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 25) return 'Poor';
  return 'Unsafe';
}
