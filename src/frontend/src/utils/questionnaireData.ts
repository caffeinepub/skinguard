export interface Question {
  question: string;
  description: string;
  options: string[];
}

export const questions: Question[] = [
  {
    question: 'How does your skin feel a few hours after cleansing?',
    description: 'Think about your skin in its natural state, without any products applied.',
    options: [
      'Very oily and shiny all over',
      'Oily in the T-zone (forehead, nose, chin)',
      'Comfortable and balanced',
      'Tight, dry, or flaky',
    ],
  },
  {
    question: 'How would you describe your pore size?',
    description: 'Look closely at your skin, especially on your nose and cheeks.',
    options: [
      'Large and visible, especially on nose and cheeks',
      'Medium-sized, visible in T-zone',
      'Small and barely visible',
      'Very small, almost invisible',
    ],
  },
  {
    question: 'How does your skin typically feel?',
    description: 'Consider the overall texture and comfort of your skin.',
    options: [
      'Rough, flaky, or tight',
      'Dry in some areas, normal in others',
      'Smooth and comfortable',
      'Oily and slick',
    ],
  },
  {
    question: 'How does your skin react to new products?',
    description: 'Think about your experience when trying new skincare or makeup.',
    options: [
      'Often gets red, itchy, or irritated',
      'Sometimes reacts, but not always',
      'Rarely has any negative reactions',
      'Never has problems with new products',
    ],
  },
  {
    question: 'How often do you experience breakouts?',
    description: 'Consider acne, pimples, or blemishes on your face.',
    options: [
      'Frequently, especially in the T-zone',
      'Occasionally, usually hormonal',
      'Rarely have breakouts',
      'Almost never break out',
    ],
  },
  {
    question: 'How does your skin feel by midday?',
    description: 'Think about how your skin changes throughout the day.',
    options: [
      'Very dry and needs moisturizer',
      'Slightly dry in some areas',
      'Comfortable and unchanged',
      'Oily and needs blotting',
    ],
  },
  {
    question: 'How would you describe your acne concerns?',
    description: 'Consider the frequency and severity of breakouts, pimples, and blemishes.',
    options: [
      'No acne concerns',
      'Occasional breakouts or minor blemishes',
      'Frequent breakouts or moderate acne',
      'Severe or persistent acne',
    ],
  },
  {
    question: 'Do you have pigmentation concerns?',
    description: 'Think about dark spots, uneven skin tone, or hyperpigmentation.',
    options: [
      'No pigmentation issues',
      'Mild dark spots or slight unevenness',
      'Moderate hyperpigmentation or noticeable dark spots',
      'Significant pigmentation issues or melasma',
    ],
  },
  {
    question: 'What are your aging concerns?',
    description: 'Consider fine lines, wrinkles, and loss of firmness.',
    options: [
      'No aging concerns',
      'Fine lines starting to appear',
      'Visible wrinkles and some loss of firmness',
      'Deep wrinkles and significant loss of firmness',
    ],
  },
  {
    question: 'How would you describe your skin dryness?',
    description: 'Think about overall hydration, flakiness, and tightness.',
    options: [
      'No dryness issues',
      'Mild dryness or occasional tightness',
      'Moderate dryness with some flaking',
      'Severe dryness with persistent flaking',
    ],
  },
];
