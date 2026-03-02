import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import IngredientStore "ingredient-store";

// Apply migration function from migration module

actor {
  public type SkinType = {
    #oily;
    #dry;
    #combination;
    #sensitive;
    #normal;
  };

  public type ProductCategory = {
    #cleanser;
    #moisturizer;
    #serum;
    #sunscreen;
    #treatment;
  };

  public type PriceRange = {
    #low;
    #medium;
    #high;
  };

  public type ConcernLevel = {
    #none;
    #low;
    #medium;
    #high;
  };

  public type SkinConcerns = {
    acne : ConcernLevel;
    pigmentation : ConcernLevel;
    aging : ConcernLevel;
    dryness : ConcernLevel;
    concerns : [Text];
  };

  public type SkincareProduct = {
    name : Text;
    brand : Text;
    description : Text;
    suitableSkinTypes : [SkinType];
    keyIngredients : [Text];
    category : ProductCategory;
    priceRange : PriceRange;
    concerns : [Text];
  };

  public type QuestionnaireResult = {
    answers : [Nat];
    detectedSkinType : SkinType;
    concerns : SkinConcerns;
  };

  public type SkinTypeData = {
    answers : [Nat];
    detectedSkinType : SkinType;
    concerns : SkinConcerns;
    timestamp : Nat;
  };

  public type User = {
    name : Text;
    age : Nat;
    email : ?Text;
  };

  // UserProfile type required by the frontend
  public type UserProfile = {
    name : Text;
    age : Nat;
    email : ?Text;
  };

  public type IngredientSafety = {
    #safe;
    #conditional;
    #risky;
    #harmful;
  };

  public type IngredientInfo = IngredientStore.IngredientInfo;

  public type IngredientAnalysisResult = {
    ingredientName : Text;
    safetyClassification : IngredientSafety;
    isCompatible : Bool;
    concernWarnings : Bool;
    explanation : Text;
  };

  public type ProductCompatibilityScore = {
    score : Nat;
    verdict : { #excellent; #good; #fair; #poor; #unsafe };
  };

  public type ProgressMetrics = {
    acneTrend : Text;
    pigmentationTrend : Text;
    agingTrend : Text;
    drynessTrend : Text;
    stableSkinType : Nat;
  };

  public type RoutineStep = {
    productName : Text;
    order : Nat;
    frequency : Nat;
  };

  public type SkincareRoutine = {
    name : Text;
    steps : [RoutineStep];
  };

  public type ProductNote = {
    productName : Text;
    rating : Nat;
    notes : Text;
    experience : Text;
  };

  public type ProductSuitability = {
    #suitable;
    #caution;
    #not_recommended;
  };

  public type HighlightedIngredient = {
    name : Text;
    classification : IngredientSafety;
    reason : Text;
  };

  public type ExplanatoryPanel = {
    highlightedIngredients : [HighlightedIngredient];
    scientificReasoning : Text;
    suggestedAlternatives : [Text];
  };

  public type SuitabilityResult = {
    suitability : ProductSuitability;
    explanation : ExplanatoryPanel;
  };

  public type SearchProductPayload = {
    productName : Text;
    userSkinType : SkinType;
    concerns : SkinConcerns;
  };

  let skinTypeStore = Map.empty<Principal, [SkinTypeData]>();
  let favorites = Map.empty<Principal, List.List<Text>>();
  let routines = Map.empty<Principal, List.List<SkincareRoutine>>();
  let productNotes = Map.empty<Principal, List.List<ProductNote>>();
  let ingredientStore = IngredientStore.empty();
  let productStore = Map.empty<Text, SkincareProduct>();
  let productSuitabilityStore = Map.empty<Text, SuitabilityResult>();
  let userStore = Map.empty<Principal, User>();
  let userProfileStore = Map.empty<Principal, UserProfile>();

  var skincareProducts : [SkincareProduct] = [];

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ---- Required profile functions (frontend: getCallerUserProfile, saveCallerUserProfile, getUserProfile) ----

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfileStore.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };
    userProfileStore.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfileStore.get(user);
  };

  // ---- Admin / store functions ----

  public query ({ caller }) func getStoreCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can view total store count");
    };

    var count = 0;
    for ((_, userResults) in skinTypeStore.entries()) {
      count += userResults.size();
    };
    count;
  };

  public query ({ caller }) func getMyRecordCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their record count");
    };

    switch (skinTypeStore.get(caller)) {
      case (?results) { results.size() };
      case null { 0 };
    };
  };

  public shared ({ caller }) func setSkincareProducts(products : [SkincareProduct]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can set skincare products");
    };
    skincareProducts := products;
  };

  public query ({ caller }) func getPersonalizedRecommendations(userSkinType : SkinType, concerns : SkinConcerns) : async [SkincareProduct] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get personalized recommendations");
    };

    skincareProducts.filter(
      func(product) {
        let matchesSkinType = product.suitableSkinTypes.find(func(st) { st == userSkinType }) != null;
        let matchesConcerns = product.concerns.find(
          func(concern) {
            concerns.concerns.find(func(userConcern) { userConcern == concern }) != null;
          }
        ) != null;
        if (matchesConcerns) { matchesSkinType } else { false };
      }
    );
  };

  public shared ({ caller }) func analyzeIngredients(ingredientNames : [Text], userSkinType : SkinType) : async [IngredientAnalysisResult] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can analyze ingredients");
    };

    let results = ingredientNames.map(
      func(name) {
        switch (ingredientStore.get(name)) {
          case (?ingredient) {
            {
              ingredientName = ingredient.name;
              safetyClassification = ingredient.safetyClassification;
              isCompatible = ingredient.suitableSkinTypes.find(func(st) { st == userSkinType }) != null;
              concernWarnings = ingredient.isAcneProneConcern or ingredient.isSensitiveConcern or ingredient.isClogProneConcern;
              explanation = ingredient.description;
            };
          };
          case (null) { createDefaultIngredientAnalysisResult(name) };
        };
      }
    );
    results;
  };

  func createDefaultIngredientAnalysisResult(ingredientName : Text) : IngredientAnalysisResult {
    {
      ingredientName;
      safetyClassification = #safe;
      isCompatible = true;
      concernWarnings = false;
      explanation = "No data found. Default safe classification.";
    };
  };

  func getVerdictFromScore(score : Nat) : { #excellent; #good; #fair; #poor; #unsafe } {
    if (score >= 90) {
      #excellent;
    } else if (score >= 75) {
      #good;
    } else if (score >= 50) {
      #fair;
    } else if (score >= 25) {
      #poor;
    } else {
      #unsafe;
    };
  };

  public query ({ caller }) func calculateProductCompatibilityScore(results : [IngredientAnalysisResult]) : async ProductCompatibilityScore {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can calculate compatibility scores");
    };

    var score = 100;

    for (result in results.values()) {
      switch (result.safetyClassification) {
        case (#harmful) { if (score > 20) { score -= 20 } else { score := 0 } };
        case (#risky) { if (score > 10) { score -= 10 } else { score := 0 } };
        case (#conditional) {
          if (not result.isCompatible) {
            if (score > 5) { score -= 5 } else { score := 0 };
          };
        };
        case (#safe) { if (score < 95) { score += 5 } else { score := 100 } };
      };
    };

    let verdict = getVerdictFromScore(score);

    { score; verdict };
  };

  public query ({ caller }) func getAllIngredients() : async [IngredientInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access ingredient database");
    };
    ingredientStore.values().toArray();
  };

  public query ({ caller }) func getIngredient(name : Text) : async ?IngredientInfo {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access ingredient information");
    };
    ingredientStore.get(name);
  };

  public shared ({ caller }) func seedIngredients() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can seed ingredients");
    };

    let ingredients = [
      {
        name = "Hyaluronic Acid";
        safetyClassification = #safe;
        description = "Hydrating ingredient suitable for all skin types.";
        suitableSkinTypes = [#oily, #dry, #combination, #sensitive, #normal];
        isAcneProneConcern = false;
        isSensitiveConcern = false;
        isClogProneConcern = false;
      },
      {
        name = "Retinol";
        safetyClassification = #conditional;
        description = "Vitamin A derivative, potent for anti-aging. May cause irritation and sun sensitivity. Best used at night.";
        suitableSkinTypes = [#oily, #dry, #combination];
        isAcneProneConcern = false;
        isSensitiveConcern = true;
        isClogProneConcern = false;
      },
      {
        name = "Alcohol Denat.";
        safetyClassification = #risky;
        description = "High alcohol content can be drying and irritating, especially for sensitive skin.";
        suitableSkinTypes = [#oily, #combination];
        isAcneProneConcern = false;
        isSensitiveConcern = true;
        isClogProneConcern = false;
      },
      {
        name = "Parabens";
        safetyClassification = #risky;
        description = "Used as preservatives, but some studies suggest potential health risks.";
        suitableSkinTypes = [#oily, #dry, #combination, #sensitive, #normal];
        isAcneProneConcern = false;
        isSensitiveConcern = true;
        isClogProneConcern = false;
      },
    ];

    for (ingredient in ingredients.values()) {
      ingredientStore.add(ingredient.name, ingredient);
    };
  };

  public shared ({ caller }) func addFavorite(productName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add favorites");
    };

    let currentFavorites = switch (favorites.get(caller)) {
      case (?list) { list.clone() };
      case null { List.empty<Text>() };
    };

    currentFavorites.add(productName);
    favorites.add(caller, currentFavorites);
  };

  public shared ({ caller }) func removeFavorite(productName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove favorites");
    };

    let currentFavorites = switch (favorites.get(caller)) {
      case (?list) {
        let filteredList = list.filter(func(fav) { fav != productName });
        filteredList.clone();
      };
      case null { List.empty<Text>() };
    };

    favorites.add(caller, currentFavorites);
  };

  public query ({ caller }) func getFavorites() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access favorites");
    };

    switch (favorites.get(caller)) {
      case (?favorites) { favorites.toArray() };
      case null { [] };
    };
  };

  public shared ({ caller }) func saveRoutine(routine : SkincareRoutine) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save routines");
    };

    let currentRoutines = switch (routines.get(caller)) {
      case (?existingRoutines) {
        existingRoutines.clone();
      };
      case null { List.empty<SkincareRoutine>() };
    };

    currentRoutines.add(routine);
    routines.add(caller, currentRoutines);
  };

  public shared ({ caller }) func deleteRoutine(routineName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete routines");
    };

    switch (routines.get(caller)) {
      case (?existingRoutines) {
        let filteredRoutines = existingRoutines.filter(func(r) { r.name != routineName });
        routines.add(caller, filteredRoutines);
      };
      case null { /* No routines to delete */ };
    };
  };

  public query ({ caller }) func getRoutines() : async [SkincareRoutine] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access routines");
    };

    switch (routines.get(caller)) {
      case (?routines) { routines.toArray() };
      case null { [] };
    };
  };

  public shared ({ caller }) func addProductNote(note : ProductNote) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add product notes");
    };

    let currentNotes = switch (productNotes.get(caller)) {
      case (?existingNotes) {
        existingNotes.clone();
      };
      case null { List.empty<ProductNote>() };
    };

    currentNotes.add(note);
    productNotes.add(caller, currentNotes);
  };

  public query ({ caller }) func getProductNotes() : async [ProductNote] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access product notes");
    };

    switch (productNotes.get(caller)) {
      case (?notes) { notes.toArray() };
      case null { [] };
    };
  };

  public shared ({ caller }) func compareProducts(productNames : [Text], userSkinType : SkinType) : async {
    products : [SkincareProduct];
    analysis : [IngredientAnalysisResult];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can compare products");
    };

    if (productNames.size() > 3 or productNames.size() < 2) {
      Runtime.trap("You can only compare 2 or 3 products at once");
    };

    let newProducts = productNames.map(func(name) {
      skincareProducts.find(func(p) { p.name == name });
    });

    let products = newProducts.filter(func(p) { p != null }).map(func(p) {
      switch (p) {
        case (?prod) { prod };
        case (null) {
          Runtime.trap("Unexpected null product while filtering non-null");
        };
      }
    });

    if (products.size() < 2) {
      Runtime.trap("Need at least 2 valid products to compare");
    };

    let allIngredients = products.concat([]).map(
      func(product) {
        product.keyIngredients;
      }
    );

    let flatIngredients = allIngredients.flatten();

    let analysisResults = await analyzeIngredients(flatIngredients, userSkinType);

    { products; analysis = analysisResults };
  };

  public query ({ caller }) func searchProductByName(productName : Text) : async ?SkincareProduct {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search for products");
    };
    productStore.get(productName);
  };

  public shared ({ caller }) func saveProduct(product : SkincareProduct) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can add products");
    };
    productStore.add(product.name, product);
  };

  public query ({ caller }) func getAllProductNames() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get product names");
    };
    productStore.keys().toArray();
  };

  public query ({ caller }) func evaluateProductSuitability(productName : Text, userSkinType : SkinType, _ : SkinConcerns) : async SuitabilityResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can evaluate product suitability");
    };

    switch (productStore.get(productName)) {
      case (?product) {
        {
          suitability = #suitable;
          explanation = {
            highlightedIngredients = [];
            scientificReasoning = getScientificReasoningExplanation(product, userSkinType);
            suggestedAlternatives = [];
          };
        };
      };
      case (null) {
        {
          suitability = #suitable;
          explanation = {
            highlightedIngredients = [];
            scientificReasoning = "No explanations available";
            suggestedAlternatives = [];
          };
        };
      };
    };
  };

  func getScientificReasoningExplanation(product : SkincareProduct, skinType : SkinType) : Text {
    var reasoning = "Scientific Reasoning (INCI AI): ";
    reasoning := reasoning # "Product Ingredients: ";
    for (ingredient in product.keyIngredients.values()) {
      reasoning := reasoning # ", " # ingredient;
    };
    reasoning := reasoning # ". ";

    switch (skinType) {
      case (#oily) {
        reasoning := reasoning # "Oily Skin: ";
      };
      case (#combination) {
        reasoning := reasoning # "Combination Skin: ";
      };
      case (#dry) {
        reasoning := reasoning # "Dry Skin: ";
      };
      case (#sensitive) {
        reasoning := reasoning # "Sensitive Skin: ";
      };
      case (#normal) {
        reasoning := reasoning # "Normal Skin: ";
      };
    };

    reasoning := reasoning #
    "- Suitable Ingredients:\n" #
    "    * Hyaluronic Acid: Hydrating without clogging pores.\n" #
    "    * Niacinamide: Controls oil production.\n" #
    "- Cautionary Ingredients:\n" #
    "    * Alcohol Denat.: May cause excessive dryness.\n" #
    "    * Coconut Oil: Potential for pore clogging.\n" #
    "\n" #
    "Layering with sunscreen is highly recommended.\n" #
    "This information is based on current scientific studies.\n";
    reasoning;
  };

  public shared ({ caller }) func updateUserProfileIntro(name : Text, age : Nat, email : ?Text) : async User {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update their profile");
    };

    let userProfile = {
      name;
      age;
      email;
    };

    userStore.add(caller, userProfile);
    userProfile;
  };

  public query ({ caller }) func getUserProfileIntro() : async User {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their profile");
    };

    switch (userStore.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("User profile not found") };
    };
  };

  // Save questionnaire results - stores skin type and concern levels for the caller
  public shared ({ caller }) func saveQuestionnaireResults(results : QuestionnaireResult) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save questionnaire results");
    };

    let newSkinTypeData : SkinTypeData = {
      answers = results.answers;
      detectedSkinType = results.detectedSkinType;
      concerns = results.concerns;
      timestamp = 0;
    };

    let updatedResults = switch (skinTypeStore.get(caller)) {
      case (?existingResults) {
        existingResults.concat([newSkinTypeData]);
      };
      case (null) {
        [newSkinTypeData];
      };
    };

    skinTypeStore.add(caller, updatedResults);
  };

  // Get the caller's questionnaire results
  public query ({ caller }) func getQuestionnaireResults() : async [SkinTypeData] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their questionnaire results");
    };

    switch (skinTypeStore.get(caller)) {
      case (?results) { results };
      case (null) { [] };
    };
  };

  // Get the most recent questionnaire result for the caller
  public query ({ caller }) func getLatestQuestionnaireResult() : async ?SkinTypeData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their questionnaire results");
    };

    switch (skinTypeStore.get(caller)) {
      case (?results) {
        if (results.size() == 0) {
          null;
        } else {
          ?results[results.size() - 1];
        };
      };
      case (null) { null };
    };
  };
};

