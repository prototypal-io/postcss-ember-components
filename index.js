var postcss = require('postcss');
var path = require('path');

module.exports = postcss.plugin('postcss-ember-components', function (opts) {
  opts = opts || {};
  var guidFn = getGUIDFn(opts);
  var nameFn = getNameFn(opts);
  var prefixFn = getPrefixFn(opts);

  return function (css, result) {
    var guid   = guidFn();
    var name   = nameFn(css.source.input.from);
    var prefix = prefixFn(name, guid);

    var selectorMap = {};
    var data = {
      name: name,
      guid: guid,
      prefix: prefix,
      selectorMap: selectorMap
    };

    css.eachRule(function(rule) {
      var selectorCollection = rule.selector.split(",").map(function(sel) {
        var selector = sel.trim();
        if (selector[0] !== "." && selector !== ":--component") { return selector; }
        var newSelector = "." + prefix;
        if (selector !== ":--component") {
          newSelector += "-" + selector.slice(1);
        }

        selectorMap[selector] = newSelector;

        return newSelector;
      });

      rule.selector = selectorCollection.join(", ");
    });

    result.messages.push({
      type: 'lookup-object',
      plugin: 'postcss-ember-components',
      data: data
    });
    return css;
  };
});

function getGUIDFn(opts) {
  if (!opts.guid) {
    return generateGUID;
  }
  if (typeof opts.guid === 'function') {
    return opts.guid;
  }
  return function guid() {
    return opts.guid;
  }
}

function getNameFn(opts) {
  return opts.name || generateName;
}

function getPrefixFn(opts) {
  return opts.prefix || generatePrefix;
}

function generateGUID(n) {
  return n ? (n ^ Math.random() * 16 >> n/4).toString(16) : ('10000000'.replace(/[018]/g, generateGUID));
}

function generateName(fileName) {
  return path.basename(fileName, '.css');
}

function generatePrefix(name, guid) {
  return name + "-" + guid;
}


