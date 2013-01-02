module.exports = function (compound, Post) {
  // define Post here
  Post.validatesUniquenessOf('service-userid-orginaldataid', {  message:"- each post has to be unique from each servce"});
};