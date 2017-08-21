![Rrome Logo](/logo.png)


Rrome is a dynamic ORM powered by NoSQL

## Usage

```
   var rrome = require('rrome')(cluster);

   rrome.on('ready', () => {
      //Do all your roaming here 
   });
```

### Data methods
-  getData(id, cb)
-  insertData(model, data, cb)
-  cloneData(id, cb)
-  deleteData(id, cb)
-  updateData(id, data, cb)

### Model methods
-  getModels(ids, cb)
-  getModel(id, cb)
-  addModel(name, model, cb)
-  updateModel(id, model, cb)
-  deleteModel(id, cb)

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
         "Label": {type: "STRING", id: $uuid}
      },
      display_keys: [$uuid]
   }
```

