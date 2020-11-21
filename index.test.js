const postcss = require('postcss')

const plugin = require('./')

async function run (input, output, opts = { }) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}


it('default', async () => {
  await run('.a{ aspect-ratio: 16 / 9; }', '.a{ position: relative; }\n.a::before{ content: \'\'; display: block; padding-top: 56.25%; }\n.a > div{ position: absolute; top: 0; right: 0; bottom: 0; left: 0; }', {})
})

it('no space', async () => {
  await run('.a{ aspect-ratio: 16/9; }', '.a{ position: relative; }\n.a::before{ content: \'\'; display: block; padding-top: 56.25%; }\n.a > div{ position: absolute; top: 0; right: 0; bottom: 0; left: 0; }', {})
})

it('precision', async () => {
  await run('.a{ aspect-ratio: 1.6 / 0.9; }', '.a{ position: relative; }\n.a::before{ content: \'\'; display: block; padding-top: 56.25%; }\n.a > div{ position: absolute; top: 0; right: 0; bottom: 0; left: 0; }', {})
})

it('error', async () => {
  await run('.b{ aspect-ratio: 20%; }', '.b{ aspect-ratio: 20%; }', {})
})

it('with position', async () => {
  await run('.c{ aspect-ratio: 16 / 9; position: relative; }', '.c{ position: relative; }\n.c::before{ content: \'\'; display: block; padding-top: 56.25%; }\n.c > div{ position: absolute; top: 0; right: 0; bottom: 0; left: 0; }', {})
})

it('custom selector', async () => {
  await run('.d{ aspect-ratio: 16 / 9; }', '.d{ position: relative; }\n.d::before{ content: \'\'; display: block; padding-top: 56.25%; }\n.d > .inner{ position: absolute; top: 0; right: 0; bottom: 0; left: 0; }', {mainSelector: '.inner'})
})
