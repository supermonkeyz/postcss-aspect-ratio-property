import { round, evaluate } from 'mathjs';
import { Plugin, Declaration, Rule, Root } from 'postcss';

interface Template {
  container: {
    position?: string;
  };
  shadow: {
    content: string;
    display: string;
    'padding-top': string | number;
  };
  main: {
    position: string;
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

let template: Template = {
  container: {
    position: 'relative',
  },
  shadow: {
    content: "''",
    display: 'block',
    'padding-top': 0,
  },
  main: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};

function verificationValue(value: string, operator: string = '/'): string | false {
  let available: boolean = false;
  if (typeof value === 'string' && value.includes(operator)) {
    let arr: string[] = value.split(operator);
    available = arr.every((v) => !isNaN(parseFloat(v)) && +v !== 0) && arr.length === 2;
  }
  return available && value;
}

function calcRatio(value: string): string {
  const result: string = `${round(1 / evaluate(value), 4) * 100}%`;
  return result;
}

function propValues(root: Root | Rule /* postcss.Root | postcss.Rule */, tpl: Record<string, any>): void {
  for (const [prop, value] of Object.entries(tpl)) {
    root.append({ prop, value });
  }
}

function rulesGenerator(decl: Declaration /* postcss.Declaration */, postcss: any /* postcss.Postcss */, mainSelector: string = 'div'): void {
  const containerRoot: Rule | Root | undefined = decl.parent;
  if (!containerRoot) return; // Add a check for containerRoot

  let selector: string = (containerRoot as Rule).selector; // Type assertion
  let shadowRoot: Rule = postcss.rule({ selector: `${selector}::before` });
  let mainRoot: Rule = postcss.rule({ selector: `${selector} > ${mainSelector}` });
  const paddingValue: string = calcRatio(decl.value);
  let tpl: Template = JSON.parse(JSON.stringify(template));
  tpl.shadow['padding-top'] = paddingValue;
  propValues(shadowRoot, tpl.shadow);
  propValues(mainRoot, tpl.main);
  const hasPosition: boolean = containerRoot.some((i: any) => i.prop === 'position');
  if (hasPosition) {
    delete tpl.container.position;
  }
  propValues(containerRoot as Rule, tpl.container); // Type assertion
  decl.remove();
  containerRoot.after(mainRoot);
  containerRoot.after(shadowRoot);
}

interface PluginOptions {
  mainSelector?: string;
}

const plugin: Plugin = (opts: PluginOptions = { mainSelector: 'div' }) => {
  return {
    postcssPlugin: 'postcss-aspect-ratio-property',
    Declaration(decl: Declaration /* postcss.Declaration */, postcss: any /* postcss.Postcss */): void {
      if (decl.prop.includes('aspect-ratio')) {
        const verifiedValue = verificationValue(decl.value);
        if (!verifiedValue) return;
        rulesGenerator(decl, postcss, opts.mainSelector);
      }
    },
  };
};

plugin.postcss = true;

export default plugin;
