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
-  getDatas(model, user, cb)
-  getData(id, cb)
-  insertData(model, data, user, cb)
-  cloneData(id, cb)
-  deleteData(id, cb)
-  updateData(id, data, cb)

### Model methods
-  listModels(cb)
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
      }
   }
```

