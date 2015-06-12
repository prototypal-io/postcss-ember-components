var postcss = require('postcss');
var path = require('path');

module.exports = postcss.plugin('postcss-ember-components', function (opts) {
  opts = opts || {};

  return function (css) {
    // var uuid = generateUUID();
    var dummyUUID = "abc123";
    var fileName = path.basename(css.source.input.from, '.css');

    css.eachRule(function(rule) {
      // swap dummyUUID with uuid
      var selectorCollection = rule.selector.split(" ").map(function(selector) {
        var result = "." + fileName + "-" + dummyUUID,
            appendedSelector;
        if (selector !== ":--component" && rule.selector[0] === ".") {
          appendedSelector = selector.slice(1);
          result += "-" + appendedSelector;
        }
        return result;
      });

      rule.selector = selectorCollection.join(" ");
    });
    return css;
  };
});

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};
