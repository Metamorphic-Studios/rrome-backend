# Rrome

## Usage

```
   var rrome = require('rrome')(bucket);

```

### getModels(model_id[], cb)

### getModel(id, cb)

### insert(model_id, model_data, owner, cb)


## Data types

- Text
   -  One liner
   -  Textbox
- Foregin list
- Files
- List: Model

## Data structures

```
   {
      id: $uuid,
      name: $model_name,
      model: {
         "default": { //Special model key for primary values

         },
         "Section Header": {
            "Input Label": {type: "STRING", id: "_input"},
            "Input2 Label": {type: "STRING", id: "_input2"}
         },
         "Another Section": {
            "Inputs": {type: "NUMBER", id: "_input3"}
         }
      },
      display_keys: ["_input", "_input2"]
   }
```

## Example

```
   "Tenant": {
      id: $uuid,
      structs: [$model_id],
      branding: $branding
   }

```
