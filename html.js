var html = {};

// HTML5 tags
var tags = [
    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base',
    'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption',
    'cite', 'code', 'col', 'colgroup', 'command', 'datalist', 'dd', 'del',
    'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset',
    'figcaption', 'figure', 'footer', 'form', 'h1', 'head', 'header', 'hgroup',
    'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'keygen', 'kbd',
    'label', 'legend', 'li', 'link', 'map', 'mark', 'menu', 'meta', 'meter',
    'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p',
    'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script',
    'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub',
    'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th',
    'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'
];

function sanitizeAttrs(attr) {
    if ('class' in attr) {
        if ('className' in attr) {
            throw new Error(
                'Cannot set both class and className attributes set on element'
            );
        }
        attr.className = attr['class'];
        delete attr['class'];
    }
    return attr;
};

var isString = function (obj) {
    return toString.call(obj) == '[object String]';
};
var isObject = function (obj) {
    return obj === Object(obj);
};
var isArray = Array.isArray || function (obj) {
    return toString.call(obj) === '[object Array]';
};

function prepareChildren(xs) {
    var arr = [];
    for (var i = 0, len = xs.length; i < len; i++) {
        // ignore null, undefined and empty strings etc.
        if (xs[i]) {
            if (isString(xs[i])) {
                arr.push(document.createTextNode(xs[i]));
            }
            else {
                arr.push(xs[i]);
            }
        }
    }
    return arr;
};

for (var i = 0, len = tags.length; i < len; i++) {
    (function (tag) {
        html[tag] = function (attr, children) {
            // curry if first argument is attributes
            if (isObject(attr) && !isArray(attr)) {
                if (arguments.length === 1) {
                    return function (children) {
                        return html[tag](attr, children);
                    };
                }
            }
            else {
                children = attr;
                attr = {};
            }
            if (!isArray(children)) {
                children = [children];
            }
            var el = document.createElement(tag);
            for (var name in sanitizeAttrs(attr)) {
                el[name] = attr[name];
            }
            var cs = prepareChildren(children);
            for (var j = 0, clen = cs.length; j < clen; j++) {
                el.appendChild(cs[j]);
            }
            return el;
        };
    })(tags[i]);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = html;
}
