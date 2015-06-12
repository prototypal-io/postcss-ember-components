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
    matchTest(':--component { color: green; } .foo { color: red; } .bar { color: blue; }',
         /.my-component-\w{8} { color: green; } .my-component-\w{8}-foo { color: red; } .my-component-\w{8}-bar { color: blue; }/,
         { }, done);
  });

  it('handles conversion with multiple classes', function(done) {
    matchTest('.foo, .bar { color: orange; }',
         /.my-component-\w{8}-foo, .my-component-\w{8}-bar { color: orange; }/,
         { }, done);
  });

  it('returns the correct lookup object', function(done) {
    var input = '.foo { color: pink; } .bar { color: black; }';
    postcss([ plugin({}) ]).process(input, { from: 'some/file/path/my-component.css' }).then(function (result) {
      expect(result.messages[0].lookupObject['my-component']['.foo']).to.match(/.my-component-\w{8}-foo/);
      expect(result.messages[0].lookupObject['my-component']['.bar']).to.match(/.my-component-\w{8}-bar/);
      done();
    }).catch(function (error) {
      done(error);
    });
  });
});
