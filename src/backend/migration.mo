import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";
import IngredientStore "ingredient-store";

module {
  type OldActor = {
    skinTypeStore : Map.Map<Principal, [SkinTypeData]>;
    userProfiles : Map.Map<Principal, UserProfile>;
    favorites : Map.Map<Principal, List.List<Text>>;
    routines : Map.Map<Principal, List.List<SkincareRoutine>>;
    productNotes : Map.Map<Principal, List.List<ProductNote>>;
    ingredientStore : IngredientStore.IngredientStore;
    productStore : Map.Map<Text, SkincareProduct>;
    productSuitabilityStore : Map.Map<Text, SuitabilityResult>;
    skincareProducts : [SkincareProduct];
  };

  type NewActor = {
    skinTypeStore : Map.Map<Principal, [SkinTypeData]>;
    userProfiles : Map.Map<Principal, UserProfile>;
    favorites : Map.Map<Principal, List.List<Text>>;
    routines : Map.Map<Principal, List.List<SkincareRoutine>>;
    productNotes : Map.Map<Principal, List.List<ProductNote>>;
    ingredientStore : IngredientStore.IngredientStore;
    productStore : Map.Map<Text, SkincareProduct>;
    productSuitabilityStore : Map.Map<Text, SuitabilityResult>;
    skincareProducts : [SkincareProduct];
  };

  type SkinType = {
    #oily;
    #dry;
    #combination;
    #sensitive;
    #normal;
  };

  type ProductCategory = {
    #cleanser;
    #moisturizer;
    #serum;
    #sunscreen;
    #treatment;
  };

  type PriceRange = {
    #low;
    #medium;
    #high;
  };

  type ConcernLevel = {
    #none;
    #low;
    #medium;
    #high;
  };

  type SkinConcerns = {
    acne : ConcernLevel;
    pigmentation : ConcernLevel;
    aging : ConcernLevel;
    dryness : ConcernLevel;
    concerns : [Text];
  };

  type SkincareProduct = {
    name : Text;
    brand : Text;
    description : Text;
    suitableSkinTypes : [SkinType];
    keyIngredients : [Text];
    category : ProductCategory;
    priceRange : PriceRange;
    concerns : [Text];
  };

  type QuestionnaireResult = {
    answers : [Nat];
    detectedSkinType : SkinType;
    concerns : SkinConcerns;
  };

  type SkinTypeData = {
    answers : [Nat];
    detectedSkinType : SkinType;
    concerns : SkinConcerns;
    timestamp : Nat;
  };

  type UserProfile = {
    name : Text;
  };

  type IngredientSafety = {
    #safe;
    #conditional;
    #risky;
    #harmful;
  };

  type IngredientInfo = IngredientStore.IngredientInfo;

  type IngredientAnalysisResult = {
    ingredientName : Text;
    safetyClassification : IngredientSafety;
    isCompatible : Bool;
    concernWarnings : Bool;
    explanation : Text;
  };

  type ProductCompatibilityScore = {
    score : Nat;
    verdict : { #excellent; #good; #fair; #poor; #unsafe };
  };

  type ProgressMetrics = {
    acneTrend : Text;
    pigmentationTrend : Text;
    agingTrend : Text;
    drynessTrend : Text;
    stableSkinType : Nat;
  };

  type RoutineStep = {
    productName : Text;
    order : Nat;
    frequency : Nat;
  };

  type SkincareRoutine = {
    name : Text;
    steps : [RoutineStep];
  };

  type ProductNote = {
    productName : Text;
    rating : Nat;
    notes : Text;
    experience : Text;
  };

  type ProductSuitability = {
    #suitable;
    #caution;
    #not_recommended;
  };

  type HighlightedIngredient = {
    name : Text;
    classification : IngredientSafety;
    reason : Text;
  };

  type ExplanatoryPanel = {
    highlightedIngredients : [HighlightedIngredient];
    scientificReasoning : Text;
    suggestedAlternatives : [Text];
  };

  type SuitabilityResult = {
    suitability : ProductSuitability;
    explanation : ExplanatoryPanel;
  };

  type SearchProductPayload = {
    productName : Text;
    userSkinType : SkinType;
    concerns : SkinConcerns;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
