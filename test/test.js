var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');

var equalityTest = function (input, output, opts, done) {
  postcss([ plugin(opts) ]).process(input, { from: 'some/file/path/my-component.css' }).then(function (result) {
    expect(result.css).to.eql(output);
    expect(result.warnings()).to.be.empty;
    done();
  }).catch(function (error) {
    done(error);
  });
};

var matchTest = function (input, output, opts, done) {
  postcss([ plugin(opts) ]).process(input, { from: 'some/file/path/my-component.css' }).then(function (result) {
    expect(result.css).to.match(output);
    expect(result.warnings()).to.be.empty;
    done();
  }).catch(function (error) {
    done(error);
  });
};

describe('postcss-ember-components', function () {
  it('handles basic conversion with simple classes and :--component', function(done) {
    equalityTest(':--component {' +
                   'color: green;' +
                 '}' +
                 '.foo {' +
                   'color: red;' +
                 '}' +
                 '.bar {' +
                   'color: blue;' +
                 '}',

                 '.my-component-abc123 {' +
                   'color: green;' +
                 '}' +
                 '.my-component-abc123-foo {' +
                   'color: red;' +
                 '}' +
                 '.my-component-abc123-bar {' +
                   'color: blue;' +
                 '}',

                 { guid: 'abc123' }, done);
  });

  it('handles conversion with multiple classes', function(done) {
    equalityTest('.foo, .bar {' +
                   'color: orange;' +
                 '}',

                 '.my-component-abc123-foo, .my-component-abc123-bar {' +
                   'color: orange;' +
                 '}',

                 { guid: 'abc123' }, done);
  });

  it('returns the correct lookup object', function(done) {
    var input = '.foo { color: pink; } .bar { color: black; }';
    postcss([ plugin({ guid: 'abc123' }) ]).process(input, { from: 'some/file/path/my-component.css' }).then(function (result) {
      expect(result.messages[0].data).to.deep.equal({
        'my-component': {
          '.foo': '.my-component-abc123-foo',
          '.bar': '.my-component-abc123-bar'
        }
      });
      done();
    }).catch(function (error) {
      done(error);
    });
  });

  it('handles non-class selectors correctly', function(done) {
    equalityTest(':root {' +
                   'color: green;' +
                 '}' +
                 'h1 {' +
                   'color: blue;' +
                 '}',

                 ':root {' +
                   'color: green;' +
                 '}' +
                 'h1 {' +
                   'color: blue;' +
                 '}',

                 { guid: 'abc123' }, done);
  });
});
