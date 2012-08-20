var L = require('./lamb');

eval(L.install);


var html = {};


html.tag        = flip(get)(0)
html.attrs      = flip(get)(1)
html.children   = flip(get)(2)


html.stringifyAttr = function (k, v) {
    return k + '="' + v + '"';
};
html.stringifyAttrs = function (attrs) {
    return join(' ', map(apply(html.stringifyAttr), pairs(attrs)) );
};
html.stringify = function (el) {
    if (isString(el)) {
        return el;
    }
    return '<' + el[0] + ' ' + html.stringifyAttrs(el[1]) + '>' +
        concatMap(html.stringify, isArray(el[2]) && el[2] || [el[2]]) +
    '</' + el[0] + '>';
};


if (typeof module !== 'undefined' && module.exports) {
    module.exports = html;
}
