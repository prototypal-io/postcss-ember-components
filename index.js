var postcss = require('postcss');
var parser = require('postcss-selector-parser');
var path = require('path');

module.exports = postcss.plugin('postcss-ember-components', function (opts) {
  opts = opts || {};
  var guidFn = getGUIDFn(opts);
  var nameFn = getNameFn(opts);
  var prefixFn = getPrefixFn(opts);

  return function (css, result) {
    var name = nameFn(css.source.input.from);
    var guid = guidFn();

    var metadata = {
      name: name,
      componentClass: prefixFn(name, guid),
      classes: {}
    };

    function transform(selectors) {
      selectors.eachInside(function (selector) {
        var oldValue, newValue;
        if (selector.type === 'pseudo' && selector.value === ':--component') {
          selector.replaceWith(parser.className({
            value: metadata.componentClass
          }));
        } else if (selector.type === 'class') {
          oldValue = selector.value;
          newValue = prefixFn(name, guid, oldValue);
          selector.value = newValue;
          metadata.classes[oldValue] = newValue;
        }
      });
    }
    css.eachRule(function(rule) {
      rule.selector = parser(transform).process(rule.selector).result;
    });

    result.messages.push({
      type: 'component-classes',
      plugin: 'postcss-ember-components',
      data: metadata
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

function generatePrefix(name, guid, className) {
  var parts = [name, guid];
  if (className) {
    parts.push(className);
  }
  return parts.join('-');
}


