function Recipe(ingredients, title, description, timeEstimate) {
  this.ingredients = ingredients;
  this.title = title;
  this.description = description;
  this.timeEstimate = timeEstimate;

  this.addIngredient = ingredient => {
    this.ingredients.push(ingredient);
  }
}
