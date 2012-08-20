var L = require('./lamb');

eval(L.install);


var html = {};


html.tag        = flip(get)(0)
html.attrs      = flip(get)(1)
html.children   = flip(get)(2)


html.stringifyAttr = function (k, v) {
    return html.h(k) + '="' + html.h(v) + '"';
};
html.stringifyAttrs = function (attrs) {
    return join(' ', map(apply(html.stringifyAttr), pairs(attrs)) );
};
html.stringify = function (el) {
    if (isString(el)) {
        return html.h(el);
    }
    var tag = html.h(el[0]),
        attrs = html.stringifyAttrs(el[1]),
        children = isArray(el[2]) ? el[2]: [el[2]];

    return '<' + tag + ' ' + attrs + '>' +
        concatMap(html.stringify, children) +
    '</' + tag + '>';
};

html.escapeHtml = html.h = function (s) {
    s = ('' + s); /* Coerce to string */
    s = s.replace(/&/g, '&amp;');
    s = s.replace(/</g, '&lt;');
    s = s.replace(/>/g, '&gt;');
    s = s.replace(/"/g, '&quot;');
    s = s.replace(/'/g, '&#39;');
    return s;
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = html;
}
