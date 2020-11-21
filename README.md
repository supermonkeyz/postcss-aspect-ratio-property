# PostCSS Aspect Ratio Property [![Build Status][ci-img]][ci]

[PostCSS] plugin The CSS Working Group have designed an [aspect-ratio](https://drafts.csswg.org/css-sizing-4/#aspect-ratio) property for CSS.This plugin make this future feature available now..

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/supermonkeyz/postcss-aspect-ratio-property.svg
[ci]:      https://travis-ci.org/supermonkeyz/postcss-aspect-ratio-property

```css
.foo {
    /* Input example */
    aspect-ratio: 16/9;
}
```

```css
.foo {
  /* Output example */
  position: relative;
}

.foo::before {
  content: '';
  display: block;
  padding-top: 56.25%;
}

.foo > div {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
```

## options

Type: Object

default:

```js
{
  mainSelector: '.box'
}
```

```css
.foo {
    /* Input example */
    aspect-ratio: 16/9;
}
```

...

```css
.foo > .box {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-aspect-ratio-property
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-aspect-ratio-property'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
