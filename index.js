var postcss = require('postcss');
var path = require('path');

module.exports = postcss.plugin('postcss-ember-components', function (opts) {
  opts = opts || {};

  return function (css, result) {
    var guid = opts.guid || generateGUID();
    var fileName = path.basename(css.source.input.from, '.css');

    var lookupObject = {};
    lookupObject[fileName] = {};

    css.eachRule(function(rule) {
      var selectorCollection = rule.selector.split(",").map(function(sel) {
        var selector = sel.trim();
        if (selector[0] !== "." && selector !== ":--component") { return selector; }
        var newSelector = "." + fileName + "-" + guid,
            appendedSelector;
        if (selector !== ":--component") {
          appendedSelector = selector.slice(1);
          newSelector += "-" + appendedSelector;
        }

        lookupObject[fileName][selector] = newSelector;

        return newSelector;
      });

      rule.selector = selectorCollection.join(", ");
    });

    result.messages.push({
      type: 'lookup-object',
      plugin: 'postcss-ember-components',
      data: lookupObject
    });
    return css;
  };
});

function generateGUID(n) {
  return n ? (n ^ Math.random() * 16 >> n/4).toString(16) : ('10000000'.replace(/[018]/g, generateGUID));
};
