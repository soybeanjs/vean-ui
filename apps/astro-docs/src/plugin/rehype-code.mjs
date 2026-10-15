/** Base64 of the UTF-8 code — the same copy-button payload the ubean build emits. */
function encodeBase64Utf8(value) {
  return Buffer.from(value, 'utf8').toString('base64');
}

/**
 * Rehype pass that turns every `<pre class="shiki ...">` into the exact same
 * markup the ubean build emits for a fence: a `pre.shiki.md-code-block[data-lang]`
 * carrying the copy-button payload, so the shared `styles/markdown.css` and
 * `styles/global.css` rules apply unchanged to both sites.
 *
 * Astro's own shiki pass has already run by this point (it emits the `--shiki-light`
 * / `--shiki-dark` vars because `shikiConfig.defaultColor` is `false`); this plugin
 * only reshapes the wrapper and appends the copy affordance.
 */
export function rehypeDocsCode() {
  return tree => {
    visit(tree);
  };
}

function visit(node) {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (node.type === 'element' && node.tagName === 'pre') {
    const classes = node.properties?.className ?? [];
    const lang = extractLang(node.properties, classes);
    const code = collectText(node);

    node.properties = node.properties ?? {};
    // `shiki` is what the shared `styles/global.css` keys the dual-theme colour vars
    // off (`--shiki-light` / `--shiki-dark`); Astro names its own wrapper
    // `astro-code`, so the class list is replaced rather than extended.
    node.properties.className = ['shiki', 'md-code-block'];
    delete node.properties.tabindex;
    // Astro's own grammar marker; the shared stylesheet reads `data-lang` instead.
    delete node.properties.dataLanguage;

    if (lang) {
      // hast camel-cases `data-*` in `properties` and `hast-util-to-html` turns it back
      // into the hyphenated attribute, so `dataLang` is what lands as `data-lang`.
      node.properties.dataLang = lang;
    }

    node.children = [
      {
        type: 'element',
        tagName: 'button',
        properties: {
          type: 'button',
          className: ['code-btn'],
          'data-copy-code': encodeBase64Utf8(code),
          'aria-label': 'Copy code'
        },
        children: []
      },
      ...(node.children ?? [])
    ];

    return;
  }

  for (const child of node.children ?? []) {
    visit(child);
  }
}

/**
 * Astro's shiki pass records the grammar on `data-language`; the `language-*` class
 * form is kept as a fallback in case the highlighting path changes.
 */
function extractLang(properties, classes) {
  // `hast` stores `data-language` as `dataLanguage` in the properties bag.
  const attribute = properties?.dataLanguage;

  if (typeof attribute === 'string' && attribute) {
    return attribute;
  }

  const match = classes.find(name => /^language-/.test(String(name)));

  return match ? String(match).slice('language-'.length) : undefined;
}

function collectText(node) {
  if (node.type === 'text') {
    return node.value ?? '';
  }

  return (node.children ?? []).map(collectText).join('');
}
