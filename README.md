# PostCSS Ember Components [![Build Status][ci-img]][ci]

[PostCSS] plugin that transforms CSS into GUID-based classes for componentized CSS..

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/JFickel/postcss-ember-components.svg
[ci]:      https://travis-ci.org/JFickel/postcss-ember-components

```css
.foo {
    /* Input example */
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

```js
postcss([ require('postcss-ember-components') ])
```

See [PostCSS] docs for examples for your environment.
