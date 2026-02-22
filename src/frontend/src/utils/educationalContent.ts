import { skinTypeDescriptions } from './skinTypeDescriptions';
import { SkinType } from '../backend';

export interface EducationalArticle {
  title: string;
  category: 'skin-types' | 'concerns' | 'ingredients' | 'routines';
  description: string;
  content: string;
}

export const educationalContent: EducationalArticle[] = [
  {
    title: 'Understanding Oily Skin',
    category: 'skin-types',
    description: skinTypeDescriptions[SkinType.oily].tagline,
    content: `${skinTypeDescriptions[SkinType.oily].characteristics}\n\nCare Tips:\n${skinTypeDescriptions[SkinType.oily].careTips.join('\n')}\n\nRecommended Ingredients: ${skinTypeDescriptions[SkinType.oily].recommendedIngredients.join(', ')}`,
  },
  {
    title: 'Understanding Dry Skin',
    category: 'skin-types',
    description: skinTypeDescriptions[SkinType.dry].tagline,
    content: `${skinTypeDescriptions[SkinType.dry].characteristics}\n\nCare Tips:\n${skinTypeDescriptions[SkinType.dry].careTips.join('\n')}\n\nRecommended Ingredients: ${skinTypeDescriptions[SkinType.dry].recommendedIngredients.join(', ')}`,
  },
  {
    title: 'Understanding Combination Skin',
    category: 'skin-types',
    description: skinTypeDescriptions[SkinType.combination].tagline,
    content: `${skinTypeDescriptions[SkinType.combination].characteristics}\n\nCare Tips:\n${skinTypeDescriptions[SkinType.combination].careTips.join('\n')}\n\nRecommended Ingredients: ${skinTypeDescriptions[SkinType.combination].recommendedIngredients.join(', ')}`,
  },
  {
    title: 'Understanding Sensitive Skin',
    category: 'skin-types',
    description: skinTypeDescriptions[SkinType.sensitive].tagline,
    content: `${skinTypeDescriptions[SkinType.sensitive].characteristics}\n\nCare Tips:\n${skinTypeDescriptions[SkinType.sensitive].careTips.join('\n')}\n\nRecommended Ingredients: ${skinTypeDescriptions[SkinType.sensitive].recommendedIngredients.join(', ')}`,
  },
  {
    title: 'Understanding Normal Skin',
    category: 'skin-types',
    description: skinTypeDescriptions[SkinType.normal].tagline,
    content: `${skinTypeDescriptions[SkinType.normal].characteristics}\n\nCare Tips:\n${skinTypeDescriptions[SkinType.normal].careTips.join('\n')}\n\nRecommended Ingredients: ${skinTypeDescriptions[SkinType.normal].recommendedIngredients.join(', ')}`,
  },
  {
    title: 'Managing Acne-Prone Skin',
    category: 'concerns',
    description: 'Learn how to effectively manage and prevent acne breakouts',
    content: 'Acne occurs when hair follicles become clogged with oil and dead skin cells. Key strategies include gentle cleansing, using non-comedogenic products, incorporating salicylic acid or benzoyl peroxide, and avoiding picking or squeezing blemishes. Consistency is crucial for seeing results.',
  },
  {
    title: 'Addressing Hyperpigmentation',
    category: 'concerns',
    description: 'Understand and treat dark spots and uneven skin tone',
    content: 'Hyperpigmentation results from excess melanin production. Effective treatments include vitamin C, niacinamide, alpha arbutin, and retinoids. Always use SPF 30+ daily, as sun exposure worsens pigmentation. Results typically take 8-12 weeks of consistent use.',
  },
  {
    title: 'Anti-Aging Skincare',
    category: 'concerns',
    description: 'Prevent and reduce signs of aging with proper care',
    content: 'Aging signs include fine lines, wrinkles, and loss of elasticity. Key ingredients: retinoids (boost collagen), peptides (support skin structure), antioxidants (protect from damage), and hyaluronic acid (hydration). Sun protection is the most important anti-aging step.',
  },
  {
    title: 'Combating Dryness',
    category: 'concerns',
    description: 'Restore moisture and repair your skin barrier',
    content: 'Dry skin lacks moisture and lipids. Focus on hydrating ingredients (hyaluronic acid, glycerin) and occlusives (ceramides, shea butter) to lock in moisture. Avoid hot water, harsh cleansers, and over-exfoliation. Use a humidifier in dry environments.',
  },
  {
    title: 'Hyaluronic Acid Benefits',
    category: 'ingredients',
    description: 'The ultimate hydration powerhouse for all skin types',
    content: 'Hyaluronic acid is a humectant that can hold up to 1000x its weight in water. It hydrates skin, plumps fine lines, and works for all skin types. Apply to damp skin and seal with moisturizer. Safe for sensitive skin and can be used morning and night.',
  },
  {
    title: 'Retinol: The Gold Standard',
    category: 'ingredients',
    description: 'Understanding retinol for anti-aging and acne',
    content: 'Retinol (vitamin A) increases cell turnover, boosts collagen, and unclogs pores. Start with low concentration (0.25-0.5%) 2-3x weekly. Use at night only, always follow with SPF during the day. May cause initial dryness or purging. Not recommended during pregnancy.',
  },
  {
    title: 'Niacinamide for Everyone',
    category: 'ingredients',
    description: 'A versatile ingredient for multiple skin concerns',
    content: 'Niacinamide (vitamin B3) reduces inflammation, minimizes pores, regulates oil, fades hyperpigmentation, and strengthens the skin barrier. Safe for all skin types, including sensitive. Can be used morning and night. Pairs well with most other ingredients.',
  },
  {
    title: 'Vitamin C Brightening',
    category: 'ingredients',
    description: 'Boost radiance and protect against environmental damage',
    content: 'Vitamin C is a powerful antioxidant that brightens skin, fades dark spots, and protects against free radicals. Use in the morning under SPF for maximum protection. Look for L-ascorbic acid (most potent) or stable derivatives. Store in cool, dark place.',
  },
  {
    title: 'Building a Morning Routine',
    category: 'routines',
    description: 'Start your day with an effective skincare routine',
    content: 'Morning routine order: 1) Gentle cleanser, 2) Toner (optional), 3) Vitamin C serum, 4) Eye cream, 5) Moisturizer, 6) SPF 30+. Keep it simple and consistent. The most important step is sunscreen—apply generously and reapply every 2 hours when outdoors.',
  },
  {
    title: 'Building a Night Routine',
    category: 'routines',
    description: 'Optimize your evening skincare for repair and renewal',
    content: 'Night routine order: 1) Oil cleanser (if wearing makeup/SPF), 2) Water-based cleanser, 3) Exfoliant (2-3x weekly), 4) Treatment serum (retinol, niacinamide), 5) Eye cream, 6) Moisturizer, 7) Face oil (optional). Night is when skin repairs itself—support this process.',
  },
  {
    title: 'The Importance of SPF',
    category: 'routines',
    description: 'Why sunscreen is your most important skincare product',
    content: 'UV radiation causes 80% of visible aging and increases skin cancer risk. Use broad-spectrum SPF 30+ daily, even indoors and on cloudy days. Apply 1/4 teaspoon for face, reapply every 2 hours. Mineral (zinc, titanium) or chemical—both work if used correctly.',
  },
  {
    title: 'Exfoliation Guide',
    category: 'routines',
    description: 'How to safely exfoliate for glowing skin',
    content: 'Exfoliation removes dead skin cells. Physical (scrubs) vs Chemical (AHAs, BHAs). Start 1-2x weekly, increase gradually. AHAs (glycolic, lactic) for dry/aging skin. BHAs (salicylic) for oily/acne-prone. Never over-exfoliate—signs include redness, sensitivity, increased breakouts.',
  },
];
