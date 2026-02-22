interface SeasonalTip {
  title: string;
  tip: string;
}

const seasonalTips: Record<string, SeasonalTip> = {
  winter: {
    title: 'Winter Skincare',
    tip: 'Cold weather can dry out your skin. Use richer moisturizers and do not skip sunscreen—UV rays are present year-round!',
  },
  spring: {
    title: 'Spring Renewal',
    tip: 'Spring is perfect for gentle exfoliation to remove winter buildup. Consider adding a vitamin C serum for brightness.',
  },
  summer: {
    title: 'Summer Protection',
    tip: 'Increase your SPF protection and use lightweight, oil-free products. Stay hydrated and cleanse thoroughly after sun exposure.',
  },
  fall: {
    title: 'Fall Transition',
    tip: 'As humidity drops, transition to more hydrating products. This is a great time to introduce retinol or other active ingredients.',
  },
};

function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

export function getSeasonalTip(): SeasonalTip | null {
  const season = getCurrentSeason();
  return seasonalTips[season] || null;
}
