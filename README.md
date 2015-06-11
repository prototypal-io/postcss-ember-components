# PostCSS Ember Components [![Build Status][ci-img]][ci]

[PostCSS] plugin that transforms CSS into UUID-based classes for componentized CSS.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/JFickel/postcss-ember-components.svg
[ci]:      https://travis-ci.org/JFickel/postcss-ember-components

```css
:--component {
  font-size: var(--font-size, 10px);
}

.foo {
  --font-size: 12px;
}

.bar {
  color: red;
}
```

```css
.my-component-abc123 {
  font-size: var(--font-size, 10px);
}

.my-component-abc123-foo {
  --font-size: 12px;
}

.my-component-abc123-bar {
  color: red;
}
```

## Usage

```js
postcss([ require('postcss-ember-components') ])
```

See [PostCSS] docs for examples for your environment.
