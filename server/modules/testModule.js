var express = require('express');
var router = express.Router();

exports.test = function(testPhrase) {
    return testPhrase;
};
