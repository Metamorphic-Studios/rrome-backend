![Rrome Logo](/logo.png)


Rrome is a dynamic ODM powered by NoSQL

## Usage

```
   var rrome = require('rrome')(cluster);

   rrome.on('ready', () => {
      //Do all your roaming here 
   });
```

## Model definitions

All models are defined as a singular JSON object with the following keys

#### id - STRING (required)

Unique model identifier

#### name - STRING (required)

Human readable tag to easily recognize a model

#### model - ARRAY (required)

2D Array of sections and element definitions

#### display_keys - ARRAY (required)

Array of keys to use for displaying stored data

## Model element definition

```
{
   label: String,
   type: ModelType,
   id: String,
   meta-type: Object/Array
}
```

#### label

Label to describe elements value

#### id

Unique identifier for value, created data will use this as the key for a JSON object

#### meta-type

Based on the type of the element the meta-type will define some extra configuration to pass down for display or data collection

#### type

One of the model types defined by rrome

|Type|Description|
|--|--|
|TEXT|Text input|
|DATE|Date input|
|LIST|List of objects|
|FSELECT|Foreign selector|
|FLIST|List of foreign objects|


##### FSELECT

```
meta-type: {
	id: String - Model id to select from
    display_keys: Array - Keys to display from model
}
```

##### LIST
```
meta-type: [
	{
    	type: ModelType,
        label: String 
    }
]
```

##### FLIST
```
meta-type: {
	id: String - Model id to select from
    list_display: Keys to display in list
    display_keys: Keys to display in selector
}
```

