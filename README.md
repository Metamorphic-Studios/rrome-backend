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

#### `getDatas`

Returns all data associated with a model id and user id

##### Usage

```javascript
   rrome.getDatas([...ids], user, (err, data) => {
   });
```

##### Parameters

<table class="parameters">
   <tbody>
      <tr>
         <td class="type">model</td>
         <td class="parameter">model id to lookup by</td>
      </tr>
      <tr>
         <td class="type">user</td>
         <td class="parameter">user to lookup associated documents of</td>
      </tr>
   </tbody>
</table>

#### `getData`

Returns data associated with id and user

##### Usage

```javascript
   rrome.getData(id, user, (err, data) => {

   });
```

##### Parameters

<table class="parameters">
   <tbody>
      <tr>
         <td class="type">document id</td>
         <td class="parameter">document id to lookup</td>
      </tr>
      <tr>
         <td class="type">user</td>
         <td class="parameter">user to lookup associated with document</td>
      </tr>
   </tbody>
</table>

#### `insertData`

Insert data with a model definition

##### Usage

```javascript
   rrome.insertData(model, blob, user, (err, data) => {
      
   });
```

##### Parameters

<table class="parameters">
   <tbody>
      <tr>
         <td class="type">model id</td>
         <td class="parameter">model id to insert data against</td>
      </tr>
      <tr>
         <td class="type">data blob</td>
         <td class="parameter">blob to insert</td>
      </tr>
   </tbody> 
</table>

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

