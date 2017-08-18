'use strict';

class Rrome {
   constructor(bucket){
      this.bucket = bucket;
   }


}

module.exports = (bucket) => {
   return new Rrome(bucket);
};
