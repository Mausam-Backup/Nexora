const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const srcHtmlPath = path.join(__dirname, '../../securedfi.studiovoila.com/index.htm');
let html = fs.readFileSync(srcHtmlPath, 'utf8');

// Function to convert CSS style string to JSX style object string
function styleStringToJsx(styleStr) {
  const rules = styleStr.split(';').map(r => r.trim()).filter(Boolean);
  const styleObj = {};
  for (const rule of rules) {
    const colonIdx = rule.indexOf(':');
    if (colonIdx === -1) continue;
    let prop = rule.substring(0, colonIdx).trim();
    let val = rule.substring(colonIdx + 1).trim();
    
    // Vendor prefixes
    if (prop.startsWith('-webkit-')) {
      prop = 'Webkit' + prop.substring(8).split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    } else if (prop.startsWith('-moz-')) {
      prop = 'Moz' + prop.substring(5).split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    } else if (prop.startsWith('-ms-')) {
      prop = 'ms' + prop.substring(4).split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    } else {
      prop = prop.split('-').map((s, i) => i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('');
    }
    styleObj[prop] = val;
  }
  return JSON.stringify(styleObj);
}

function convertHtmlToJsx(htmlContent) {
  // 1. Remove HTML comments
  let jsx = htmlContent.replace(/<!--[\s\S]*?-->/g, '');

  // 2. Convert image src from "images/..." to "/images/..."
  jsx = jsx.replace(/src="images\//g, 'src="/images/');
  jsx = jsx.replace(/src='images\//g, "src='/images/");

  // 3. Convert srcset references
  jsx = jsx.replace(/srcset="([^"]+)"/g, (match, p1) => {
    const updated = p1.replace(/(^|\s|,)(images\/)/g, '$1/images/');
    return `srcSet="${updated}"`;
  });

  // 4. Convert class to className
  jsx = jsx.replace(/\bclass="/g, 'className="');
  jsx = jsx.replace(/\bclass='/g, "className='");

  // 5. Convert for to htmlFor
  jsx = jsx.replace(/\bfor="/g, 'htmlFor="');

  // 6. Convert tabindex to tabIndex
  jsx = jsx.replace(/\btabindex="/g, 'tabIndex="');

  // Convert HTML input attributes to React camelCase
  jsx = jsx.replace(/\bmaxlength="(\d+)"/g, 'maxLength={$1}');
  jsx = jsx.replace(/\bminlength="(\d+)"/g, 'minLength={$1}');
  jsx = jsx.replace(/\btabIndex="(-?\d+)"/g, 'tabIndex={$1}');
  jsx = jsx.replace(/\bautocomplete="/g, 'autoComplete="');
  jsx = jsx.replace(/\bautofocus="/g, 'autoFocus="');
  jsx = jsx.replace(/\bnovalidate="/g, 'noValidate="');
  jsx = jsx.replace(/\breadonly="/g, 'readOnly="');
  jsx = jsx.replace(/\bplaysinline="/g, 'playsInline="');

  // 7. Convert SVG attributes
  const svgAttrMap = {
    'viewbox': 'viewBox',
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'stroke-miterlimit': 'strokeMiterlimit',
    'fill-rule': 'fillRule',
    'clip-rule': 'clipRule',
    'clip-path': 'clipPath',
    'xmlns:xlink': 'xmlnsXlink',
    'xlink:href': 'xlinkHref',
    'stop-color': 'stopColor',
    'stop-opacity': 'stopOpacity'
  };

  for (const [attr, jsxAttr] of Object.entries(svgAttrMap)) {
    const regex = new RegExp(`\\b${attr}="`, 'g');
    jsx = jsx.replace(regex, `${jsxAttr}="`);
  }

  // 8. Convert inline style strings to style={{ ... }}
  jsx = jsx.replace(/\bstyle="([^"]*)"/g, (match, styleContent) => {
    const jsxObj = styleStringToJsx(styleContent);
    return `style={${jsxObj}}`;
  });

  // 9. Void tags: <img ... >, <input ... >, <br>, <hr>
  jsx = jsx.replace(/<img\b([^>]*?)(?<!\/)>/g, '<img$1 />');
  jsx = jsx.replace(/<input\b([^>]*?)(?<!\/)>/g, '<input$1 />');
  jsx = jsx.replace(/<br\b([^>]*?)(?<!\/)>/g, '<br$1 />');
  jsx = jsx.replace(/<hr\b([^>]*?)(?<!\/)>/g, '<hr$1 />');

  // 10. Fix any custom attributes without value like `no-click=""` or `no-click`
  jsx = jsx.replace(/\bno-click(?!=)/g, 'no-click=""');

  return jsx;
}

const lines = html.split('\n');

// Line 860 to 876: Preloader (0-indexed: 859 to 876)
const preloaderHtml = lines.slice(859, 876).join('\n');

// Line 877 to 885: Cursor (0-indexed: 876 to 885)
const cursorHtml = lines.slice(876, 885).join('\n');

// Line 886 to 1001: Navbar (Fixed Items) (0-indexed: 885 to 1001)
const navbarHtml = lines.slice(885, 1001).join('\n');

// Line 1002 to 2007: MainContent (0-indexed: 1001 to 2007)
const mainContentHtml = lines.slice(1001, 2007).join('\n');

const components = [
  {
    name: 'Preloader.tsx',
    code: `export default function Preloader() {\n  return (\n${convertHtmlToJsx(preloaderHtml)}\n  );\n}\n`
  },
  {
    name: 'Cursor.tsx',
    code: `export default function Cursor() {\n  return (\n${convertHtmlToJsx(cursorHtml)}\n  );\n}\n`
  },
  {
    name: 'Navbar.tsx',
    code: `export default function Navbar() {\n  return (\n${convertHtmlToJsx(navbarHtml)}\n  );\n}\n`
  },
  {
    name: 'MainContent.tsx',
    code: `export default function MainContent() {\n  return (\n${convertHtmlToJsx(mainContentHtml)}\n  );\n}\n`
  }
];

const componentsDir = path.join(__dirname, '../src/components');

components.forEach(comp => {
  const filePath = path.join(componentsDir, comp.name);
  fs.writeFileSync(filePath, comp.code, 'utf8');

  // Validate with TypeScript parser
  const sourceFile = ts.createSourceFile(comp.name, comp.code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const diagnostics = sourceFile.parseDiagnostics;
  console.log(`${comp.name}: ${diagnostics.length} diagnostics`);
  if (diagnostics.length > 0) {
    diagnostics.slice(0, 5).forEach(d => {
      const pos = sourceFile.getLineAndCharacterOfPosition(d.start);
      console.log(`  Line ${pos.line + 1}, Col ${pos.character + 1}: ${d.messageText}`);
    });
  }
});
