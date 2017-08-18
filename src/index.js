'use strict';

class Rrome {
   constructor(bucket){
      console.log(bucket);
   }
}

module.exports = (bucket) => {
   return new Rrome(bucket);
};
