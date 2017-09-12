var clean = (m, data) => { 
   var model = flatten(m);
   var clean = {};
   for(var k in model){ 
      var d = data[model[k].id]
      if(d){
         clean[model[k].id] = d; 
      }
   }
   return clean;
}

var flatten = (arr) => {
   return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
     }, [])
}

module.exports = {
   clean: clean
}
