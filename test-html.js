var html = require('./html');


exports['stringify'] = function (test) {
    var li = ['li', {'class': 'product'}, [
        ['span', {'class': 'name'}, 'foo'],
        ['span', {'class': 'price'}, '1.00']
    ]];
    var str = html.stringify(li);
    test.equal(str,
        '<li class="product">' +
            '<span class="name">foo</span>' +
            '<span class="price">1.00</span>' +
        '</li>');
    test.done();
};

exports['tag'] = function (test) {
    test.equal(html.tag(['li', {}, []]), 'li');
    test.equal(html.tag(['div']), 'div');
    test.done();
};

exports['attrs'] = function (test) {
    test.same(html.attrs(['li', {'class':'product'}, []]), {'class':'product'});
    test.same(html.attrs(['span', {'class':'name'}, []]), {'class':'name'});
    test.done();
};

exports['children'] = function (test) {
    var li = ['li', {'class': 'product'}, [
        ['span', {'class': 'name'}, 'foo'],
        ['span', {'class': 'price'}, '1.00']
    ]];
    test.same(html.children(li), li[2]);
    test.done();
};

exports['stringifyAttrs'] = function (test) {
    var a = {'class': 'product', id: 'someproduct'};
    test.equal(html.stringifyAttrs(a), 'class="product" id="someproduct"');
    test.done();
};
