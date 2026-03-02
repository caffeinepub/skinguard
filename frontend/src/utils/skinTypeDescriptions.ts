import { SkinType } from '../backend';

interface SkinTypeDescription {
  tagline: string;
  characteristics: string;
  careTips: string[];
  recommendedIngredients: string[];
}

export const skinTypeDescriptions: Record<SkinType, SkinTypeDescription> = {
  [SkinType.oily]: {
    tagline: 'Shine bright, but keep it balanced',
    characteristics:
      'Your skin produces excess sebum, leading to a shiny appearance, especially in the T-zone. You may have enlarged pores and are prone to breakouts and blackheads. However, oily skin tends to age more slowly due to natural moisture retention.',
    careTips: [
      'Cleanse twice daily with a gentle, oil-free cleanser',
      'Use lightweight, non-comedogenic moisturizers',
      'Apply oil-free sunscreen daily',
      'Use clay masks weekly to control excess oil',
      'Avoid heavy, oil-based products',
    ],
    recommendedIngredients: [
      'Salicylic Acid',
      'Niacinamide',
      'Tea Tree Oil',
      'Witch Hazel',
      'Clay',
      'Zinc',
    ],
  },
  [SkinType.dry]: {
    tagline: 'Nourish and hydrate for a healthy glow',
    characteristics:
      'Your skin lacks moisture and natural oils, often feeling tight, rough, or flaky. You may notice fine lines more prominently and experience dullness. Dry skin can be sensitive to environmental factors and harsh products.',
    careTips: [
      'Use a gentle, creamy cleanser that doesn\'t strip natural oils',
      'Apply rich, hydrating moisturizers immediately after cleansing',
      'Use a humidifier in dry environments',
      'Avoid hot water and harsh soaps',
      'Apply face oils or overnight masks for extra hydration',
    ],
    recommendedIngredients: [
      'Hyaluronic Acid',
      'Ceramides',
      'Glycerin',
      'Shea Butter',
      'Squalane',
      'Vitamin E',
    ],
  },
  [SkinType.combination]: {
    tagline: 'Balance is key for your unique skin',
    characteristics:
      'Your skin exhibits characteristics of both oily and dry skin types. Typically, your T-zone (forehead, nose, chin) is oily with visible pores, while your cheeks and other areas are normal to dry. This requires a balanced approach to skincare.',
    careTips: [
      'Use different products for different zones if needed',
      'Choose lightweight, balanced moisturizers',
      'Use gentle cleansers that don\'t over-dry or over-moisturize',
      'Apply targeted treatments to specific areas',
      'Consider multi-masking for different zones',
    ],
    recommendedIngredients: [
      'Niacinamide',
      'Hyaluronic Acid',
      'Salicylic Acid (T-zone)',
      'Glycerin',
      'Green Tea Extract',
      'Aloe Vera',
    ],
  },
  [SkinType.sensitive]: {
    tagline: 'Gentle care for delicate skin',
    characteristics:
      'Your skin is easily irritated and reactive to products, weather, or environmental factors. You may experience redness, itching, burning, or stinging. Sensitive skin requires extra care and gentle, fragrance-free products.',
    careTips: [
      'Patch test all new products before full application',
      'Choose fragrance-free, hypoallergenic products',
      'Avoid harsh exfoliants and strong active ingredients',
      'Use mineral-based sunscreens',
      'Keep your routine simple with minimal products',
    ],
    recommendedIngredients: [
      'Centella Asiatica',
      'Colloidal Oatmeal',
      'Chamomile',
      'Allantoin',
      'Ceramides',
      'Panthenol',
    ],
  },
  [SkinType.normal]: {
    tagline: 'Maintain your naturally balanced complexion',
    characteristics:
      'Your skin is well-balanced with minimal concerns. You have small pores, good circulation, a smooth texture, and no severe sensitivity. Your skin is neither too oily nor too dry, and you rarely experience breakouts.',
    careTips: [
      'Maintain a consistent, simple skincare routine',
      'Protect your skin with daily SPF',
      'Stay hydrated and maintain a healthy lifestyle',
      'Use gentle products to preserve your skin\'s balance',
      'Incorporate antioxidants for prevention',
    ],
    recommendedIngredients: [
      'Vitamin C',
      'Vitamin E',
      'Hyaluronic Acid',
      'Niacinamide',
      'Green Tea Extract',
      'Peptides',
    ],
  },
};
