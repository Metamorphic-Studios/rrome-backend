# Rrome

## Usage

```
   var rrome = require('rrome')(bucket);

   rrome.on('ready', () => {
      //Do all your roaming here 
   });
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
         "Input Label": {type: "STRING", id: $uuid}
      },
      display_keys: [$uuid]
   }
```

## Example

```
   "Tenant": {
      id: $uuid,
      structs: [$model_id, ...],
      branding: $branding
   }

```
