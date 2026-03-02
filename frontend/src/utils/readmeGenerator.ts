export function generateReadmeContent(): string {
  return `# Skin Analysis Platform - DBMS Project

A comprehensive skincare analysis and recommendation platform built on the Internet Computer blockchain, demonstrating advanced database management concepts and distributed systems architecture.

## 🎯 Project Overview

This application provides personalized skincare recommendations based on user questionnaires, ingredient analysis, and product compatibility scoring. It showcases a complete DBMS implementation using Motoko on the Internet Computer.

## 🏗️ Database Architecture

### Technology Stack
- **Backend**: Motoko (Internet Computer's native language)
- **Frontend**: React + TypeScript + Tailwind CSS
- **Database**: Stable storage on Internet Computer canisters
- **Authentication**: Internet Identity (decentralized identity)

### Database Schema

#### Core Entities

**Users**
- Principal ID (Primary Key)
- Name
- Age
- Email (Optional)

**Skin Type Data**
- User Principal (Foreign Key)
- Detected Skin Type (oily, dry, combination, sensitive, normal)
- Concerns (acne, pigmentation, aging, dryness with severity levels)
- Questionnaire Answers (array of responses)
- Timestamp

**Products**
- Product Name (Primary Key)
- Brand
- Description
- Suitable Skin Types (array)
- Key Ingredients (array)
- Category (cleanser, moisturizer, serum, sunscreen, treatment)
- Price Range (low, medium, high)
- Concerns Addressed (array)

**Ingredients**
- Ingredient Name (Primary Key)
- Safety Classification (safe, conditional, risky, harmful)
- Description
- Suitable Skin Types (array)
- Concern Flags (acne-prone, sensitive, clog-prone)

**User Favorites**
- User Principal (Foreign Key)
- Product Names (list)

**Skincare Routines**
- User Principal (Foreign Key)
- Routine Name
- Steps (ordered list with product name, order, frequency)

**Product Notes**
- User Principal (Foreign Key)
- Product Name
- Rating (1-5)
- Notes
- Experience Description

### DBMS Concepts Implemented

1. **Data Persistence**: Stable storage using Motoko's stable variables
2. **Relationships**: One-to-many (User → Analysis History, User → Favorites)
3. **Indexing**: Hash-based lookups using Map data structures
4. **Queries**: Complex filtering and recommendation algorithms
5. **Transactions**: Atomic operations for data consistency
6. **Access Control**: Role-based permissions (admin, user, guest)
7. **Data Integrity**: Type safety and validation at backend level

## 🔐 Authorization System

The platform implements role-based access control:
- **Admin**: Can seed data, manage products and ingredients
- **User**: Can access personalized features, save data
- **Guest**: Limited read-only access

## 🚀 Key Features

### 1. Skin Type Detection
- 10-question comprehensive questionnaire
- Algorithm-based skin type classification
- Concern level assessment (acne, pigmentation, aging, dryness)

### 2. Product Recommendations
- Personalized suggestions based on skin type and concerns
- Category-based filtering (cleansers, moisturizers, serums, etc.)
- Price range considerations

### 3. Ingredient Analysis
- Safety classification system
- Compatibility scoring with user's skin type
- Concern warnings for problematic ingredients

### 4. Product Suitability Checker
- Autocomplete product search
- Detailed compatibility analysis
- Scientific reasoning explanations
- Alternative product suggestions

### 5. User Data Management
- Analysis history tracking
- Favorite products
- Custom skincare routines
- Product notes and ratings
- Data export functionality

## 📊 Database Operations

### CREATE Operations
- User profile creation
- Skin analysis records
- Favorite products
- Skincare routines
- Product notes

### READ Operations
- User profile retrieval
- Analysis history queries
- Product recommendations (filtered by skin type and concerns)
- Ingredient information lookup
- Favorites and routines listing

### UPDATE Operations
- User profile updates
- Routine modifications

### DELETE Operations
- Routine removal
- Favorite removal

### Complex Queries
- Product comparison (multi-product analysis)
- Ingredient compatibility scoring
- Personalized recommendations with multiple filters
- Progress metrics calculation

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- DFX (Internet Computer SDK)
- pnpm package manager

### Installation Steps

1. **Clone the repository**
\`\`\`bash
git clone <your-repo-url>
cd skin-analysis-platform
\`\`\`

2. **Install dependencies**
\`\`\`bash
cd frontend
pnpm install
\`\`\`

3. **Start local Internet Computer replica**
\`\`\`bash
dfx start --background
\`\`\`

4. **Deploy canisters**
\`\`\`bash
dfx deploy
\`\`\`

5. **Start development server**
\`\`\`bash
cd frontend
pnpm start
\`\`\`

6. **Access the application**
Open http://localhost:3000 in your browser

## 🌐 Deployment to Internet Computer

### Production Deployment

1. **Build the project**
\`\`\`bash
dfx build --network ic
\`\`\`

2. **Deploy to mainnet**
\`\`\`bash
dfx deploy --network ic
\`\`\`

3. **Get canister URLs**
\`\`\`bash
dfx canister --network ic id frontend
dfx canister --network ic id backend
\`\`\`

Your application will be accessible at:
\`https://<frontend-canister-id>.icp0.io\`

## 📁 Project Structure

\`\`\`
skin-analysis-platform/
├── backend/
│   ├── main.mo                 # Main backend canister
│   └── ingredient-store.mo     # Ingredient data module
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   └── App.tsx            # Main app component
│   ├── package.json
│   └── tailwind.config.js
└── dfx.json                   # DFX configuration
\`\`\`

## 🔍 Backend API Endpoints

### User Management
- \`updateUserProfileIntro(name, age, email)\`: Create/update user profile
- \`getUserProfileIntro()\`: Retrieve user profile

### Product Operations
- \`getPersonalizedRecommendations(skinType, concerns)\`: Get product recommendations
- \`searchProductByName(name)\`: Search for specific product
- \`getAllProductNames()\`: Get all product names for autocomplete
- \`compareProducts(productNames, skinType)\`: Compare multiple products

### Ingredient Operations
- \`analyzeIngredients(names, skinType)\`: Analyze ingredient list
- \`getAllIngredients()\`: Get complete ingredient database
- \`getIngredient(name)\`: Get specific ingredient info
- \`calculateProductCompatibilityScore(results)\`: Calculate compatibility score

### User Data Operations
- \`addFavorite(productName)\`: Add product to favorites
- \`removeFavorite(productName)\`: Remove from favorites
- \`getFavorites()\`: Get user's favorite products
- \`saveRoutine(routine)\`: Save skincare routine
- \`deleteRoutine(name)\`: Delete routine
- \`getRoutines()\`: Get user's routines
- \`addProductNote(note)\`: Add product note
- \`getProductNotes()\`: Get user's product notes

### Product Suitability
- \`evaluateProductSuitability(productName, skinType, concerns)\`: Evaluate product suitability

## 🎓 Educational Value

This project demonstrates:
- **Database Design**: Normalized schema with proper relationships
- **Data Modeling**: Complex data structures for skincare domain
- **Query Optimization**: Efficient filtering and recommendation algorithms
- **Access Control**: Role-based security implementation
- **Data Integrity**: Type-safe operations and validation
- **Distributed Systems**: Blockchain-based data persistence
- **API Design**: RESTful-style canister methods

## 👥 Contributors

[Your Name] - Database Management Systems Project

## 📄 License

This project is created for educational purposes as part of a DBMS course.

## 🙏 Acknowledgments

- Built on the Internet Computer platform
- Powered by Motoko programming language
- UI components from shadcn/ui
- Developed with caffeine.ai

---

**Note**: This is a student project demonstrating DBMS concepts. The skincare recommendations are for educational purposes only and should not replace professional dermatological advice.
`;
}
