const { round, evaluate } = require('mathjs');

let template = {
  container:{
    'position': 'relative'
  },
  shadow:{
    'content': '\'\'',
    'display': 'block',
    'padding-top': 0
  },
  main: {
    'position': 'absolute',
    'top': 0,
    'right': 0,
    'bottom': 0,
    'left': 0
  }
}

function verificationValue(value, operator = '/') {
  let available = false;
  if (typeof value === 'string' && value.includes(operator)) {
    let arr = value.split(operator);
    available = arr.every(v => !isNaN(v) && +v !== 0) && arr.length === 2;
  }
  return available && value;
}

function calcRatio(value) {

  const result = `${round(1 / evaluate(value), 4) * 100}%`;
  return result;
}

function propValues(root, tpl) {
  for (const [prop, value] of Object.entries(tpl)) {
    root.append({prop, value });
  }
}

function rulesGenerator(decl, postcss, mainSelector = 'div') {
  const containerRoot = decl.parent;
  let selector = containerRoot.selector;
  let shadowRoot = postcss.rule({selector: `${selector}::before`});
  let mainRoot = postcss.rule({selector: `${selector} > ${mainSelector}`});
  const paddingValue = calcRatio(decl.value);
  let tpl = JSON.parse(JSON.stringify(template));
  tpl.shadow['padding-top'] = paddingValue;
  propValues(shadowRoot, tpl.shadow);
  propValues(mainRoot, tpl.main);
  const hasPosition = containerRoot.some(i => i.prop === 'position');
  if (hasPosition) {
    delete tpl.container.position
  }
  propValues(containerRoot, tpl.container);
  decl.remove();
  containerRoot.after(mainRoot);
  containerRoot.after(shadowRoot);
}



module.exports = (opts = { mainSelector: 'div' }) => {
  return {
    postcssPlugin: 'postcss-aspect-ratio-property',
    Declaration (decl, postcss) {
      if(decl.prop.includes('aspect-ratio')) {
        if (!verificationValue(decl.value)) return;
        rulesGenerator(decl, postcss, opts.mainSelector);
      }
    }
  }
}
module.exports.postcss = true
