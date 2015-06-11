var postcss = require('postcss');

module.exports = postcss.plugin('postcss-ember-components', function (opts) {
  opts = opts || {};

  return function (css) {;
    // var uuid = generateUUID();
    var dummyUUID = "abc123";
    css.eachRule(function(rule) {
      // swap dummyUUID with uuid
      var result = "." + opts.fileName + "-" + dummyUUID,
          appendedSelector;
      if (rule.selector !== ":--component" && rule.selector[0] === ".") {
        appendedSelector = rule.selector.slice(1);
        result += "-" + appendedSelector;
      }
      rule.selector = result;
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
