var L = require('./lamb');



exports['set'] = function (test) {
    /** Objects **/

    var a = {
      one: 1,
      two: 2,
      three: {
        four: 4,
        five: {
          six: 6
        }
      },
      seven: {
        eight: 8
      }
    };
    var orig_a = JSON.stringify(a);

    var b = L.set(a, ['three', 'four'], 40);

    // existing values and references are the same
    test.strictEqual(a.one, b.one);
    test.strictEqual(a.two, b.two);
    test.strictEqual(a.three.five, b.three.five);
    test.strictEqual(a.seven, b.seven);

    // the new property is different in each object
    test.strictEqual(a.three.four, 4);
    test.strictEqual(b.three.four, 40);

    test.equal(JSON.stringify(a), orig_a);

    /** Arrays **/

    var c = [{one: 1}, {two: 2}, {three: 3}];
    var orig_c = JSON.stringify(c);

    var d = L.set(c, 1, {four: 4});

    // existing values and references are the same
    test.strictEqual(c[0], d[0]);
    test.strictEqual(c[2], d[2]);

    // the new property is different in each object
    test.same(c[1], {two: 2});
    test.same(d[1], {four: 4});

    test.equal(JSON.stringify(c), orig_c);

    test.done();
};

exports['get'] = function (test) {
    var a = {
        one: { two: { three: 3 } },
        four: { five: 5 },
        six: 6
    };
    test.equal(L.get(a, ['one', 'two', 'three']), 3);
    test.equal(L.get(a, ['one', 'two']), a.one.two);
    test.equal(L.get(a, ['four', 'five', 'six']), undefined);
    test.equal(L.get(a, ['four', 'five', 'six', 'seven']), undefined);
    test.throws(function () {
        L.get(a, ['four', 'five', 'six', 'seven'], true);
    });
    test.equal(L.get(a, 'six'), 6);

    test.equal(L.get([1,2,3,4], 1), 2);
    test.equal(L.get([1,2,3,4], 2), 3);
    test.equal(L.get([1,2,3,4], 5), undefined);

    test.done();
};

exports['head'] = function (test) {
    var a = [1,2,3,4];
    test.equal(L.head(a), 1);
    test.same(a, [1,2,3,4]);
    var b = [4,3,2,1];
    test.equal(L.head(b), 4);
    test.same(b, [4,3,2,1]);
    test.done();
};

exports['tail'] = function (test) {
    var a = [1,2,3,4];
    test.same(L.tail(a), [2,3,4]);
    test.same(a, [1,2,3,4]);
    var b = [4,3,2,1];
    test.same(L.tail(b), [3,2,1]);
    test.same(b, [4,3,2,1]);
    test.done();
};

exports['last'] = function (test) {
    var a = [1,2,3,4];
    test.equal(L.last(a), 4);
    test.same(a, [1,2,3,4]);
    var b = [4,3,2,1];
    test.equal(L.last(b), 1);
    test.same(b, [4,3,2,1]);
    test.done();
};

exports['init'] = function (test) {
    var a = [1,2,3,4];
    test.same(L.init(a), [1,2,3]);
    test.same(a, [1,2,3,4]);
    var b = [4,3,2,1];
    test.same(L.init(b), [4,3,2]);
    test.same(b, [4,3,2,1]);
    test.done();
};

exports['take'] = function (test) {
    var a = [1,2,3,4];
    test.same(L.take(1, a), [1]);
    test.same(a, [1,2,3,4]);
    test.same(L.take(2, a), [1,2]);
    test.same(a, [1,2,3,4]);
    test.same(L.take(3, a), [1,2,3]);
    test.same(a, [1,2,3,4]);
    test.same(L.take(4, a), [1,2,3,4]);
    test.same(a, [1,2,3,4]);
    test.same(L.take(5, a), [1,2,3,4]);
    test.same(a, [1,2,3,4]);
    test.done();
};

exports['drop'] = function (test) {
    var a = [1,2,3,4];
    test.same(L.drop(1, a), [2,3,4]);
    test.same(a, [1,2,3,4]);
    test.same(L.drop(2, a), [3,4]);
    test.same(a, [1,2,3,4]);
    test.same(L.drop(3, a), [4]);
    test.same(a, [1,2,3,4]);
    test.same(L.drop(4, a), []);
    test.same(a, [1,2,3,4]);
    test.same(L.drop(5, a), []);
    test.same(a, [1,2,3,4]);
    test.done();
};

exports['curry'] = function (test) {
    var fn = function (a,b,c,d) {
        return [d,c,b,a];
    };
    var f2 = L.curry(fn, 1, 2);
    test.same(f2(3,4), [4,3,2,1]);
    test.done();
};


exports['constants'] = function (test) {
    test.doesNotThrow(
        L.constants('xs', function () {
            test.equal(this.xs, undefined);
            this.xs = [1,2,3,4];
        })
    );
    test.throws(
        L.constants('xs', function () {
            test.equal(this.xs, undefined);
            this.xs = [1,2,3,4];
            this.xs = 'foo';
        })
    );
    test.equal(typeof xs, 'undefined');
    test.throws(
        L.constants('xs', function () {
            "use strict";
            test.equal(this.xs, undefined);
            this.foo = 'bar';
        })
    );
    test.doesNotThrow(function () {
        with (L.constants('xs')) {
            test.equal(typeof xs, 'undefined');
            xs = [1,2,3,4];
        }
    });
    test.throws(function () {
        with (L.constants('xs')) {
            test.equal(typeof xs, 'undefined');
            xs = [1,2,3,4];
            xs = 'foo';
        }
    });
    test.equal(typeof xs, 'undefined');
    test.done();
};


exports['install'] = function (test) {
    test.expect(8);
    var fn = function () {
        eval(L.install);
        test.strictEqual(init, L.init);
        test.strictEqual(tail, L.tail);
        test.strictEqual(head, L.head);
        test.strictEqual(last, L.last);
    };
    fn();
    test.strictEqual(typeof init, 'undefined');
    test.strictEqual(typeof tail, 'undefined');
    test.strictEqual(typeof head, 'undefined');
    test.strictEqual(typeof last, 'undefined');
    test.done();
};


exports['shallowClone'] = function (test) {
    var a = {x: 1, y: {z: 'foo'}};
    var b = L.shallowClone(a);
    b.x = 2;
    test.same(a, {x: 1, y: {z: 'foo'}});
    test.same(b, {x: 2, y: {z: 'foo'}});
    b.y.z = 'bar';
    test.same(a, {x: 1, y: {z: 'bar'}});
    test.same(b, {x: 2, y: {z: 'bar'}});
    test.done();
};

exports['deepClone'] = function (test) {
    var a = {x: 1, y: {z: 'foo'}};
    var b = L.deepClone(a);
    b.x = 2;
    test.same(a, {x: 1, y: {z: 'foo'}});
    test.same(b, {x: 2, y: {z: 'foo'}});
    b.y.z = 'bar';
    test.same(a, {x: 1, y: {z: 'foo'}});
    test.same(b, {x: 2, y: {z: 'bar'}});
    test.done();
};

exports['jsonClone'] = function (test) {
    var a = {x: 1, y: {z: 'foo'}};
    var b = L.jsonClone(a);
    b.x = 2;
    test.same(a, {x: 1, y: {z: 'foo'}});
    test.same(b, {x: 2, y: {z: 'foo'}});
    b.y.z = 'bar';
    test.same(a, {x: 1, y: {z: 'foo'}});
    test.same(b, {x: 2, y: {z: 'bar'}});
    test.done();
};