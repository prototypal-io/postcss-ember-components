var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');

var test = function (input, output, opts, done) {
  postcss([ plugin(opts) ]).process(input).then(function (result) {
    expect(result.css).to.eql(output);
    expect(result.warnings()).to.be.empty;
    done();
  }).catch(function (error) {
    done(error);
  });
};

describe('postcss-ember-components', function () {
  it('handles basic conversion with simple classes and :--component', function (done) {
    test(':--component { color: green; } .foo { color: red; } .bar { color: blue; }',
         '.my-component-abc123 { color: green; } .my-component-abc123-foo { color: red; } .my-component-abc123-bar { color: blue; }',
         { fileName: 'my-component' }, done);
  });

  it('handles conversion with descendant classes', function (done) {
    test('.foo .bar { color: orange; }',
         '.my-component-abc123-foo .my-component-abc123-bar { color: orange; }',
         { fileName: 'my-component' }, done);
  });
});
