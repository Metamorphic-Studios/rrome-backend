var clean = (model, data) => { 
   var clean = {};
   for(var k in model){ 
      var d = data[model[k].id]
      if(d){
         clean[model[k].id] = d; 
      }
   }
   return clean;
}

module.exports = {
   clean: clean
}
