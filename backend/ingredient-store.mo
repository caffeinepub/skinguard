import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";

module {
  public type SkinType = {
    #oily;
    #dry;
    #combination;
    #sensitive;
    #normal;
  };

  public type IngredientSafety = {
    #safe;
    #conditional;
    #risky;
    #harmful;
  };

  public type IngredientInfo = {
    name : Text;
    safetyClassification : IngredientSafety;
    description : Text;
    suitableSkinTypes : [SkinType];
    isAcneProneConcern : Bool;
    isSensitiveConcern : Bool;
    isClogProneConcern : Bool;
  };

  public type IngredientStore = Map.Map<Text, IngredientInfo>;

  public func empty() : IngredientStore {
    Map.empty<Text, IngredientInfo>();
  };

  public func addIngredient(store : IngredientStore, ingredient : IngredientInfo) {
    store.add(ingredient.name, ingredient);
  };

  public func getIngredient(store : IngredientStore, name : Text) : ?IngredientInfo {
    store.get(name);
  };

  public func getAllIngredients(store : IngredientStore) : [IngredientInfo] {
    store.values().toArray();
  };
};
