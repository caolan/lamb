var L = require('./lamb'),
    HTMLParser = require('./htmlparser');

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

html.parse = function (str) {
    var results = [];
    var stack = [results];

    HTMLParser(str, {
        start: function( tag, attrs, unary ) {
            var a = {};
            for (var i = 0, len = attrs.length; i < len; i++) {
                var attr = attrs[i];
                a[attr.name] = attr.value;
            }
            var t = [tag, a, []];
            var curr = stack[0];
            curr.push(t);
            if (!unary) {
                stack.unshift(t[2]);
            }
        },
        end: function( tag ) {
            stack.shift();
        },
        chars: function( text ) {
            var curr = stack[0];
            curr.push(text);
        },
        comment: function( text ) {
            //ignore comments
        }
    });
    return results;
};


if (typeof module !== 'undefined' && module.exports) {
    module.exports = html;
}
