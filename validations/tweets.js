const Validator = require('validator');
const validText = require('./valid-text');

module.exports = function validateTweetInput(data) {
  let errors = {};

  data.text = validText(data.tweet) ? data.tweet : '';

  if (!Validator.isLength(data.tweet, {min: 5, max: 140})) errors.tweet = 'Tweet must be between 5 and 140 characters';
  if (Validator.isEmpty(data.tweet)) errors.tweet = "Tweet is required";

  return {
    errors,
    isValid: !Object.keys(errors).length
  }
}