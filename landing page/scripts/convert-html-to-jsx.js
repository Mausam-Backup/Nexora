const fs = require('fs');
const path = require('path');

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
  // Remove HTML comments
  let jsx = htmlContent.replace(/<!--[\s\S]*?-->/g, '');

  // Convert image src from "images/..." to "/images/..."
  jsx = jsx.replace(/src="images\//g, 'src="/images/');
  jsx = jsx.replace(/src='images\//g, "src='/images/");

  // Convert srcset references
  jsx = jsx.replace(/srcset="([^"]+)"/g, (match, p1) => {
    const updated = p1.replace(/(^|\s|,)(images\/)/g, '$1/images/');
    return `srcSet="${updated}"`;
  });

  // Convert class to className
  jsx = jsx.replace(/\bclass="/g, 'className="');
  jsx = jsx.replace(/\bclass='/g, "className='");

  // Convert for to htmlFor
  jsx = jsx.replace(/\bfor="/g, 'htmlFor="');

  // Convert tabindex to tabIndex
  jsx = jsx.replace(/\btabindex="/g, 'tabIndex="');

  // Convert SVG attributes
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

  // Convert inline style strings to style={{ ... }}
  jsx = jsx.replace(/\bstyle="([^"]*)"/g, (match, styleContent) => {
    const jsxObj = styleStringToJsx(styleContent);
    return `style={${jsxObj}}`;
  });

  // Ensure void tags are self-closing
  // <img ... > -> <img ... />
  // Note: match tags that do not end with />
  jsx = jsx.replace(/<img\b([^>]*?)(?<!\/)>/g, '<img$1 />');
  jsx = jsx.replace(/<input\b([^>]*?)(?<!\/)>/g, '<input$1 />');
  jsx = jsx.replace(/<br\b([^>]*?)(?<!\/)>/g, '<br$1 />');
  jsx = jsx.replace(/<hr\b([^>]*?)(?<!\/)>/g, '<hr$1 />');

  return jsx;
}

// Find key sections in original HTML
const lines = html.split('\n');

// 1. Preloader: line 860 to 885
const preloaderHtml = lines.slice(859, 885).join('\n');
// 2. Cursor: line 886 to 896
const cursorHtml = lines.slice(885, 895).join('\n');
// 3. Fixed Navbar: line 896 to 1002
const navbarHtml = lines.slice(895, 1001).join('\n');
// 4. Main wrapper: line 1002 to 2002
const mainWrapperHtml = lines.slice(1001, 2002).join('\n');
// 5. Trigger wrapper: line 2003 to 2007
const triggerWrapperHtml = lines.slice(2002, 2007).join('\n');

const componentsDir = path.join(__dirname, '../src/components');
if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir, { recursive: true });
}

// Preloader component
fs.writeFileSync(
  path.join(componentsDir, 'Preloader.tsx'),
  `export default function Preloader() {\n  return (\n${convertHtmlToJsx(preloaderHtml)}\n  );\n}\n`
);

// Cursor component
fs.writeFileSync(
  path.join(componentsDir, 'Cursor.tsx'),
  `export default function Cursor() {\n  return (\n${convertHtmlToJsx(cursorHtml)}\n  );\n}\n`
);

// Navbar component
fs.writeFileSync(
  path.join(componentsDir, 'Navbar.tsx'),
  `export default function Navbar() {\n  return (\n${convertHtmlToJsx(navbarHtml)}\n  );\n}\n`
);

// MainContent component
fs.writeFileSync(
  path.join(componentsDir, 'MainContent.tsx'),
  `export default function MainContent() {\n  return (\n${convertHtmlToJsx(mainWrapperHtml)}\n  );\n}\n`
);

// TriggerWrapper component
fs.writeFileSync(
  path.join(componentsDir, 'TriggerWrapper.tsx'),
  `export default function TriggerWrapper() {\n  return (\n${convertHtmlToJsx(triggerWrapperHtml)}\n  );\n}\n`
);

console.log('JSX components generated successfully!');
