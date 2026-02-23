import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface HighlightedIngredient {
    name: string;
    reason: string;
    classification: IngredientSafety;
}
export interface ExplanatoryPanel {
    highlightedIngredients: Array<HighlightedIngredient>;
    suggestedAlternatives: Array<string>;
    scientificReasoning: string;
}
export interface SkincareRoutine {
    name: string;
    steps: Array<RoutineStep>;
}
export interface SkincareProduct {
    suitableSkinTypes: Array<SkinType>;
    name: string;
    description: string;
    concerns: Array<string>;
    priceRange: PriceRange;
    category: ProductCategory;
    brand: string;
    keyIngredients: Array<string>;
}
export interface User {
    age: bigint;
    name: string;
    email?: string;
}
export interface RoutineStep {
    order: bigint;
    productName: string;
    frequency: bigint;
}
export interface ProductNote {
    productName: string;
    experience: string;
    notes: string;
    rating: bigint;
}
export interface SuitabilityResult {
    explanation: ExplanatoryPanel;
    suitability: ProductSuitability;
}
export interface IngredientAnalysisResult {
    isCompatible: boolean;
    safetyClassification: IngredientSafety;
    explanation: string;
    ingredientName: string;
    concernWarnings: boolean;
}
export interface SkinConcerns {
    aging: ConcernLevel;
    acne: ConcernLevel;
    concerns: Array<string>;
    pigmentation: ConcernLevel;
    dryness: ConcernLevel;
}
export interface ProductCompatibilityScore {
    verdict: Variant_fair_good_poor_unsafe_excellent;
    score: bigint;
}
export interface IngredientInfo {
    suitableSkinTypes: Array<SkinType>;
    isAcneProneConcern: boolean;
    isClogProneConcern: boolean;
    safetyClassification: IngredientSafety;
    name: string;
    description: string;
    isSensitiveConcern: boolean;
}
export enum ConcernLevel {
    low = "low",
    high = "high",
    none = "none",
    medium = "medium"
}
export enum IngredientSafety {
    safe = "safe",
    conditional = "conditional",
    harmful = "harmful",
    risky = "risky"
}
export enum PriceRange {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum ProductCategory {
    sunscreen = "sunscreen",
    cleanser = "cleanser",
    treatment = "treatment",
    serum = "serum",
    moisturizer = "moisturizer"
}
export enum ProductSuitability {
    caution = "caution",
    suitable = "suitable",
    not_recommended = "not_recommended"
}
export enum SkinType {
    dry = "dry",
    combination = "combination",
    normal = "normal",
    oily = "oily",
    sensitive = "sensitive"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_fair_good_poor_unsafe_excellent {
    fair = "fair",
    good = "good",
    poor = "poor",
    unsafe = "unsafe",
    excellent = "excellent"
}
export interface backendInterface {
    addFavorite(productName: string): Promise<void>;
    addProductNote(note: ProductNote): Promise<void>;
    analyzeIngredients(ingredientNames: Array<string>, userSkinType: SkinType): Promise<Array<IngredientAnalysisResult>>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateProductCompatibilityScore(results: Array<IngredientAnalysisResult>): Promise<ProductCompatibilityScore>;
    compareProducts(productNames: Array<string>, userSkinType: SkinType): Promise<{
        products: Array<SkincareProduct>;
        analysis: Array<IngredientAnalysisResult>;
    }>;
    deleteRoutine(routineName: string): Promise<void>;
    evaluateProductSuitability(productName: string, userSkinType: SkinType, arg2: SkinConcerns): Promise<SuitabilityResult>;
    getAllIngredients(): Promise<Array<IngredientInfo>>;
    getAllProductNames(): Promise<Array<string>>;
    getCallerUserRole(): Promise<UserRole>;
    getFavorites(): Promise<Array<string>>;
    getIngredient(name: string): Promise<IngredientInfo | null>;
    getMyRecordCount(): Promise<bigint>;
    getPersonalizedRecommendations(userSkinType: SkinType, concerns: SkinConcerns): Promise<Array<SkincareProduct>>;
    getProductNotes(): Promise<Array<ProductNote>>;
    getRoutines(): Promise<Array<SkincareRoutine>>;
    getStoreCount(): Promise<bigint>;
    getUserProfileIntro(): Promise<User>;
    isCallerAdmin(): Promise<boolean>;
    removeFavorite(productName: string): Promise<void>;
    saveProduct(product: SkincareProduct): Promise<void>;
    saveRoutine(routine: SkincareRoutine): Promise<void>;
    searchProductByName(productName: string): Promise<SkincareProduct | null>;
    seedIngredients(): Promise<void>;
    setSkincareProducts(products: Array<SkincareProduct>): Promise<void>;
    updateUserProfileIntro(name: string, age: bigint, email: string | null): Promise<User>;
}
