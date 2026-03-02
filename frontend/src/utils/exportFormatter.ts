import { User, SkincareProduct, SkincareRoutine, ProductNote, ConcernLevel } from '../backend';
import { skinTypeDescriptions } from './skinTypeDescriptions';

// Temporary type definitions until backend provides these types
type SkinTypeData = {
  answers: bigint[];
  detectedSkinType: string;
  concerns: {
    acne: ConcernLevel;
    pigmentation: ConcernLevel;
    aging: ConcernLevel;
    dryness: ConcernLevel;
    concerns: string[];
  };
  timestamp: bigint;
};

interface ExportData {
  userProfile: User;
  analysisHistory: SkinTypeData[];
  products: SkincareProduct[];
  routines: SkincareRoutine[];
  favorites: string[];
  notes: ProductNote[];
  type: 'results' | 'dashboard';
}

export function generateExportHTML(data: ExportData): string {
  const latestAnalysis = data.analysisHistory[0];
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let content = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>SkinCare Analysis Report - ${data.userProfile.name}</title>
      <style>
        @media print {
          body { margin: 0; padding: 20px; }
          .no-print { display: none; }
          .page-break { page-break-before: always; }
        }
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #064e3b;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        h1 { color: #065f46; font-size: 32px; margin-bottom: 8px; }
        h2 { color: #047857; font-size: 24px; margin-top: 32px; margin-bottom: 16px; border-bottom: 2px solid #d1fae5; padding-bottom: 8px; }
        h3 { color: #059669; font-size: 18px; margin-top: 24px; margin-bottom: 12px; }
        .header { text-align: center; margin-bottom: 40px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; font-weight: 500; }
        .badge-primary { background: #d1fae5; color: #065f46; }
        .product { margin-bottom: 24px; padding: 16px; border: 1px solid #d1fae5; border-radius: 8px; }
        .product-name { font-weight: 600; color: #065f46; margin-bottom: 4px; }
        .product-brand { color: #059669; font-size: 14px; margin-bottom: 8px; }
        .routine-step { margin-bottom: 12px; padding: 12px; background: #f0fdf4; border-radius: 6px; }
        .note { margin-bottom: 16px; padding: 12px; background: #fef3c7; border-radius: 6px; }
        .stars { color: #f59e0b; }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>SkinCare Analysis Report</h1>
        <p><strong>${data.userProfile.name}</strong></p>
        <p>${date}</p>
      </div>
  `;

  if (latestAnalysis) {
    const skinTypeDesc = skinTypeDescriptions[latestAnalysis.detectedSkinType as keyof typeof skinTypeDescriptions];
    if (skinTypeDesc) {
      content += `
        <h2>Current Skin Profile</h2>
        <p><span class="badge badge-primary">${latestAnalysis.detectedSkinType.toUpperCase()} SKIN</span></p>
        <h3>Characteristics</h3>
        <p>${skinTypeDesc.characteristics}</p>
        <h3>Care Tips</h3>
        <ul>
          ${skinTypeDesc.careTips.map((tip) => `<li>${tip}</li>`).join('')}
        </ul>
        <h3>Recommended Ingredients</h3>
        <p>${skinTypeDesc.recommendedIngredients.join(', ')}</p>
      `;
    }
  }

  if (data.type === 'dashboard' && data.analysisHistory.length > 1) {
    content += `
      <div class="page-break"></div>
      <h2>Analysis History</h2>
      ${data.analysisHistory.map((analysis) => {
        const analysisDate = new Date(Number(analysis.timestamp)).toLocaleDateString();
        return `
          <div style="margin-bottom: 16px; padding: 12px; border: 1px solid #d1fae5; border-radius: 6px;">
            <p><strong>${analysisDate}</strong> - ${analysis.detectedSkinType} skin</p>
          </div>
        `;
      }).join('')}
    `;
  }

  if (data.products.length > 0) {
    content += `
      <div class="page-break"></div>
      <h2>Recommended Products</h2>
      ${data.products.map((product) => `
        <div class="product">
          <div class="product-name">${product.name}</div>
          <div class="product-brand">${product.brand}</div>
          <p style="font-size: 14px; color: #059669; margin-bottom: 8px;">${product.description}</p>
          <p style="font-size: 12px; color: #047857;"><strong>Key Ingredients:</strong> ${product.keyIngredients.join(', ')}</p>
        </div>
      `).join('')}
    `;
  }

  if (data.routines.length > 0) {
    content += `
      <div class="page-break"></div>
      <h2>My Routines</h2>
      ${data.routines.map((routine) => `
        <div style="margin-bottom: 24px;">
          <h3>${routine.name}</h3>
          ${routine.steps.sort((a, b) => Number(a.order) - Number(b.order)).map((step) => `
            <div class="routine-step">
              <strong>Step ${Number(step.order)}:</strong> ${step.productName} (Every ${Number(step.frequency)} days)
            </div>
          `).join('')}
        </div>
      `).join('')}
    `;
  }

  if (data.notes.length > 0) {
    content += `
      <div class="page-break"></div>
      <h2>Product Journal</h2>
      ${data.notes.map((note) => `
        <div class="note">
          <div style="font-weight: 600; color: #92400e; margin-bottom: 4px;">${note.productName}</div>
          <div class="stars" style="margin-bottom: 8px;">${'★'.repeat(Number(note.rating))}${'☆'.repeat(5 - Number(note.rating))}</div>
          ${note.notes ? `<p style="font-size: 14px; margin-bottom: 8px;"><strong>Notes:</strong> ${note.notes}</p>` : ''}
          ${note.experience ? `<p style="font-size: 14px;"><strong>Experience:</strong> ${note.experience}</p>` : ''}
        </div>
      `).join('')}
    `;
  }

  content += `
    </body>
    </html>
  `;

  return content;
}
