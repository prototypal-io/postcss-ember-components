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
  it('outputs correct output with dummy uuid', function (done) {
    test(':--component { color: green; } .foo { color: red; } .bar { color: blue; }',
         '.my-component-abc123 { color: green; } .my-component-abc123-foo { color: red; } .my-component-abc123-bar { color: blue; }',
         { fileName: 'my-component' }, done);
  });
});
