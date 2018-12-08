
# Fridgemaster API Documentation
--------------------------------
## /api/v1/ingredients
### `GET`

Making an API call to this endpoint returns all ingredients.

Data returned for each ingredient includes:
* ingredient id
* ingredient name
* aisle where ingredient can be located in grocery store
* creation timestamp
* update timestamp

##### Example of returned JSON:
```json
[
  {
    "id": 1,
    "ingredient_name": "eggs",
    "aisle": "dairy",
    "created_at": "2018-12-06T18:40:50.931Z",
    "updated_at": "2018-12-06T18:40:50.931Z"
  },
  {
    "id": 2,
    "ingredient_name": "boneless ribe eye roast",
    "aisle": "meat",
    "created_at": "2018-12-06T18:40:50.935Z",
    "updated_at": "2018-12-06T18:40:50.935Z"
  },
  {
    "id": 3,
    "ingredient_name": "salt",
    "aisle": "spices",
    "created_at": "2018-12-06T18:40:50.936Z",
    "updated_at": "2018-12-06T18:40:50.936Z"
  }
]
```

--------------------------------
## /api/v1/ingredients/:id/recipes
### `GET`

Making an API call to this endpoint returns all recipes for the ingredient with the specified id.

Data returned for each recipe:
* recipe id
* recipe name
* creation timestamp
* update timestamp

##### Required:
An id that corresponds to an ingredient present in the database must be provided in the URL to return the desired JSON.

URL with specified id:
```url
http://..../api/vi/ingredients/1/recipes
```
Corresponding ingredient:
```json
{
  "id": 1,
  "ingredient_name": "eggs",
  "aisle": "dairy",
  "created_at": "2018-12-06T18:40:50.931Z",
  "updated_at": "2018-12-06T18:40:50.931Z"
}
```

##### Example of returned JSON:

```json
[
  {
    "id": 1,
    "recipe_name": "billy's bootastic bacon & eggs",
    "created_at": "2018-12-06T18:40:50.886Z",
    "updated_at": "2018-12-06T18:40:50.886Z"
  },
  {
    "id": 9,
    "recipe_name": "eggs benedict",
    "created_at": "2018-12-09T18:40:50.886Z",
    "updated_at": "2018-12-09T18:40:50.886Z"
  }
]
```

--------------------------------
## /api/v1/recipes
### `GET`

Making an API call to this endpoint returns all recipes.

Data returned for each recipe:
* recipe id
* recipe name
* creation timestamp
* update timestamp

##### Example of returned JSON:
```json
[
  {
    "id": 1,
    "recipe_name": "billys bootastic bacon & eggs",
    "created_at": "2018-12-06T18:40:50.886Z",
    "updated_at": "2018-12-06T18:40:50.886Z"
  },
  {
    "id": 2,
    "recipe_name": "coconut curry chicken",
    "created_at": "2018-12-06T18:40:50.886Z",
    "updated_at": "2018-12-06T18:40:50.886Z"
  },
  {
    "id": 3,
    "recipe_name": "flour tortillas",
    "created_at": "2018-12-06T18:40:50.886Z",
    "updated_at": "2018-12-06T18:40:50.886Z"
  },

]
```

### `POST`

Making an API call to this endpoint adds a recipe to the database.

##### Required:
A correctly formatted recipe object must be provided in the request body in order to `post` to the database. 

##### Example of correctly formatted recipe object:
```
{ recipe_name: <STRING>, ingredients: <ARRAY>, steps: <ARRAY> }
```
```javascript
{
  recipe_name: 'brownie banana bread',
  ingredients: [
    {ingredient_name:'Betty Crocker Milk Chocolate brownie mix', aisle: 'baking'}, 
    {ingredient_name:'bananas', aisle: 'produce'}, 
    {ingredient_name:'butter', aisle: 'dairy'}, 
    {ingredient_name:'eggs', aisle: 'dairy'}, 
    {ingredient_name:'heavy whipping cream', aisle: 'dairy'}, 
    {ingredient_name:'mini chocolate chips', aisle: 'baking'}, 
  ],
  steps: [
    'preheat oven to 350 degrees F',
    'line an 8x5-inch loaf pan with parchment paper',
    'spray the bottom only with cooking spray',
    'put the brownie mix in a medium bowl',
    'stir in mashed bananas, butter, eggs, and whipping cream just until combined',
    'stir in 1 cup of the chocolate chips',
    'pour the batter into the prepared pan and spread evenly',
    'sprinkle the remaining chocolate chips on top',
    'bake 75 to 90 minutes or until a toothpick inserted into the center comes out clean',
    'cover the bread loosely with foil at about the 1 hour mark to avoid over-browning or burning on top',
    'cool 20 minutes, then remove the loaf from the pan to a cooling rack until completely cooled'
  ],
}
```

--------------------------------
## /api/v1/recipes/:id/ingredients
### `GET`

Making an API call to this endpoint returns all ingredients for the recipe with the specified id given.

Data returned for each ingredient includes:
* ingredient id
* ingredient name
* aisle where ingredient can be located in grocery store
* creation timestamp
* update timestamp

##### Required:
An id that corresponds to a recipe present in the database must be provided in the URL to return the desired JSON.

URL with specified id:
```url
http://..../api/vi/recipes/1/ingredients
```

Corresponding recipe:
```json
{
  "id": 1,
  "recipe_name": "billy's bootastic bacon & eggs",
  "created_at": "2018-12-06T18:40:50.886Z",
  "updated_at": "2018-12-06T18:40:50.886Z"
}
```

##### Example of returned JSON:
```json
[
  {
    "id": 1,
    "ingredient_name": "eggs",
    "aisle": "dairy",
    "created_at": "2018-12-06T18:40:50.931Z",
    "updated_at": "2018-12-06T18:40:50.931Z"
  },
  {
    "id": 2,
    "ingredient_name": "salt",
    "aisle": "spices",
    "created_at": "2018-12-06T18:41:50.931Z",
    "updated_at": "2018-12-06T18:41:50.931Z"
  },
  {
    "id": 3,
    "ingredient_name": "black pepper",
    "aisle": "spices",
    "created_at": "2018-12-06T18:42:50.931Z",
    "updated_at": "2018-12-06T18:42:50.931Z"
  }
]
```

--------------------------------
## /api/v1/recipes/:id/steps
### `GET`

Making an API call to this endpoint provides all steps for the recipe with the specified id.

Data returned for each step includes:
* step id
* step text
* recipe id

##### Required:
An id that corresponds to a recipe present in the database must be provided in the URL to return the desired JSON.

URL with specified id:
```url
http://..../api/vi/recipes/1/steps
```

Corresponding recipe:
```json
{
  "id": 1,
  "recipe_name": "billy's bootastic bacon & eggs",
  "created_at": "2018-12-06T18:40:50.886Z",
  "updated_at": "2018-12-06T18:40:50.886Z"
}
```

##### Example of returned JSON:
```json
[
  {
    "id": 1,
    "step_text": "crack eggs over bowl, being careful not to let any shells fall into bowl",
    "recipe_id": 1
  },
  {
    "id": 2,
    "step_text": "scramble eggs with fork or whisk until all yolks are broken and mixed with egg whites",
    "recipe_id": 1
  },
  {
    "id": 3,
    "step_text": "season with salt and black pepper",
    "recipe_id": 1
  },
  {
    "id": 4,
    "step_text": "pour mixture into skillet heated to medium on stovetop",
    "recipe_id": 1
  },
  {
    "id": 5,
    "step_text": "continue stirring in skillet until desired texture is reached",
    "recipe_id": 1
  },
]
```

### `POST`

Making an API call to this endpoint adds a step to the recipe in the database with the specified id.

##### Required:
* An id that corresponds to a recipe present in the database must be provided in the URL.

* A correctly formatted step object must be provided in the request body in order to `post` to the database.

URL with specified id:
```url
http://..../api/vi/recipes/1/steps
```

Corresponding recipe:
```json
{
  "id": 1,
  "recipe_name": "billy's bootastic bacon & eggs",
  "created_at": "2018-12-06T18:40:50.886Z",
  "updated_at": "2018-12-06T18:40:50.886Z"
}
```

##### Example of correctly formatted step object:
```
{ step_text: <STRING> }
```
```javascript
{
  step_text: 'add cheese if desired'
}
```

--------------------------------
## /api/v1/recipes/:id
### `PUT`

Making an API call to this endpoint updates recipe name of the recipe with the specified id.

##### Required:
An id that corresponds to a recipe present in the database must be provided in the URL.

URL with specified id:
```url
http://..../api/vi/recipes/1
```

### `DELETE`

Making an API call to this endpoint deletes the recipe with the specified id.

##### Required:
An id that corresponds to a recipe present in the database must be provided in the URL.

URL with specified id:
```url
http://..../api/vi/recipes/1
```

--------------------------------
## /api/v1/recipes/:recipe_id/steps/:step_num
### `PUT`

Making an API call to this endpoint updates specified step for a given recipe with the specified id.

##### Required:
* An id that corresponds to a recipe present in the database must be provided in the URL.

* The number of the step to be updated must be provided in the URL.

URL with specified ids:
```url
http://..../api/vi/recipes/1/steps/2
```

--------------------------------
## /api/v1/recipes/:recipe_id/steps
### `DELETE`

Making an API call to this endpoint deletes the last step of the recipe with the specified id.

##### Required:
An id that corresponds to a recipe present in the database must be provided in the URL.

URL with specified id:
```url
http://..../api/vi/recipes/1/steps
``` 



