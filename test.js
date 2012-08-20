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
    /*
    test.throws(function () {
        L.get(a, ['four', 'five', 'six', 'seven'], true);
    });
    */
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
    // head of an empty list should result in an error
    test.throws(function () {
        L.head([]);
    });
    test.done();
};

exports['tail'] = function (test) {
    var a = [1,2,3,4];
    test.same(L.tail(a), [2,3,4]);
    test.same(a, [1,2,3,4]);
    var b = [4,3,2,1];
    test.same(L.tail(b), [3,2,1]);
    test.same(b, [4,3,2,1]);
    // tail of an empty list should result in an error
    test.throws(function () {
        L.tail([]);
    });
    test.done();
};

exports['last'] = function (test) {
    var a = [1,2,3,4];
    test.equal(L.last(a), 4);
    test.same(a, [1,2,3,4]);
    var b = [4,3,2,1];
    test.equal(L.last(b), 1);
    test.same(b, [4,3,2,1]);
    // last of an empty list should result in an error
    test.throws(function () {
        L.last([]);
    });
    test.done();
};

exports['init'] = function (test) {
    var a = [1,2,3,4];
    test.same(L.init(a), [1,2,3]);
    test.same(a, [1,2,3,4]);
    var b = [4,3,2,1];
    test.same(L.init(b), [4,3,2]);
    test.same(b, [4,3,2,1]);
    // init of an empty list should result in an error
    test.throws(function () {
        L.init([]);
    });
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
    // partial application
    test.same(L.take(1)(a), [1]);
    test.same(a, [1,2,3,4]);
    test.same(L.take(2)(a), [1,2]);
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
    // partial application
    test.same(L.drop(1)(a), [2,3,4]);
    test.same(a, [1,2,3,4]);
    test.same(L.drop(2)(a), [3,4]);
    test.same(a, [1,2,3,4]);
    test.done();
};

exports['dropWhile'] = function (test) {
    var lt3 = function (x) {
        return x < 3;
    };
    test.same(L.dropWhile(lt3, [1,2,3,4]), [3,4]);
    test.same(L.dropWhile(lt3, [1,2,1,2]), []);
    test.same(L.dropWhile(lt3, [3,3,3,3]), [3,3,3,3]);
    // partial application
    test.same(L.dropWhile(lt3)([1,2,3,4]), [3,4]);
    test.same(L.dropWhile(lt3)([1,2,1,2]), []);
    test.same(L.dropWhile(lt3)([3,3,3,3]), [3,3,3,3]);
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

exports['cons'] = function (test) {
    test.same(L.cons(1, [2,3,4]), [1,2,3,4]);
    test.same(L.cons(1, []), [1]);
    // partial application
    test.same(L.cons(1)([2,3,4]), [1,2,3,4]);
    test.same(L.cons(1)([]), [1]);
    test.done();
};

exports['apply'] = function (test) {
    var fn = function (a, b, c, d) {
        return a + b + c + d;
    };
    test.equal(L.apply(fn, [1,2,3,4]), 10);
    test.equal(L.apply(fn, [1,1,1,1]), 4);
    // partial application
    test.equal(L.apply(fn)([1,2,3,4]), 10);
    test.done();
};

exports['curry'] = function (test) {
    var fn = L.curry(function (a, b, c, d) {
        return a + b + c + d;
    });
    test.equal(fn(1,2,3,4), fn(1,2)(3,4));
    test.equal(fn(1,2,3,4), fn(1)(2)(3)(4));
    var fn2 = function (a, b, c, d) {
        return a + b + c + d;
    };
    test.equal(L.curry(fn2)(1,2,3,4), L.curry(fn2,1,2,3,4));
    test.equal(L.curry(fn2)(1,2,3,4), L.curry(fn2,1,2)(3,4));
    test.done();
};

exports['ncurry'] = function (test) {
    var fn = L.ncurry(3, function (a, b, c, d) {
        return a + b + c + (d || 0);
    });
    test.equal(fn(1,2,3,4), 6);
    test.equal(fn(1,2,3,4), fn(1,2)(3));
    test.equal(fn(1,2,3,4), fn(1)(2)(3));
    var fn2 = function () {
        var args = Array.prototype.slice(arguments);
        return L.foldl(function (a, b) { return a + b; }, 0, args);
    };
    test.equal(L.ncurry(3,fn2)(1,2,3,4), L.ncurry(3,fn2,1,2,3,4));
    test.equal(L.ncurry(3,fn2)(1,2,3,4), L.ncurry(3,fn2,1,2)(3,4));
    test.done();
};

exports['compose'] = function (test) {
    var fn1 = L.concat('one:');
    var fn2 = L.concat('two:');
    var fn3 = L.concat('three:');
    var fn = L.compose(fn3, fn2, fn1);
    test.equal(fn('zero'), 'three:two:one:zero');
    test.done();
};

exports['concat'] = function (test) {
    var a = [1];
    var b = [2,3];
    test.same(L.concat(a, b), [1,2,3]);
    // test original arrays are unchanged
    test.same(a, [1]);
    test.same(b, [2,3]);
    test.same(L.concat([1,2,3], []), [1,2,3]);
    // partial application
    var fn = L.concat([1,2]);
    test.same(fn([3,4]), [1,2,3,4]);
    test.same(fn([3,4,5]), [1,2,3,4,5]);
    test.done();
};

exports['foldl'] = function (test) {
    test.equal(L.foldl(L.concat, '', ['1','2','3','4']), '1234');
    var fn = function (x, y) {
        return x + y;
    };
    test.equal(L.foldl(fn, 0, [1,2,3,4]), 10);
    // partial application
    test.equal(L.foldl(fn, 0)([1,2,3,4]), 10);
    test.equal(L.foldl(fn)(0, [1,2,3,4]), 10);
    test.equal(L.foldl(fn)(0)([1,2,3,4]), 10);
    var minus = function (a, b) {
        return a - b;
    };
    test.equal(L.foldl(minus, 1, [1,2,3]), -5);
    test.done();
};

exports['foldl1'] = function (test) {
    var fn = function (x, y) {
        return x + y;
    };
    test.equal(L.foldl1(fn, [1,2,3,4]), 10);
    // partial application
    test.equal(L.foldl1(fn)([1,2,3,4]), 10);
    var minus = function (a, b) {
        return a - b;
    };
    test.equal(L.foldl1(minus, [1,2,3]), -4);
    test.done();
};

exports['map'] = function (test) {
    var dbl = function (x) {
        return x * 2;
    };
    var a = [1,2,3,4];
    test.same(L.map(dbl, a), [2,4,6,8]);
    // test original array is unchanged
    test.same(a, [1,2,3,4]);
    // partial application
    test.same(L.map(dbl)(a), [2,4,6,8]);
    test.done();
};

exports['concatMap'] = function (test) {
    var fn = function (c) {
        return c.toUpperCase();
    };
    test.equal(L.concatMap(fn, ['a','b','c']), 'ABC');
    test.done();
};

exports['filter'] = function (test) {
    var odd = function (x) {
        return x % 2;
    };
    var a = [1,2,3,4];
    test.same(L.filter(odd, a), [1,3]);
    // test original array is unchanged
    test.same(a, [1,2,3,4]);
    // partial application
    test.same(L.filter(odd)(a), [1,3]);
    test.done();
};

exports['keys'] = function (test) {
    var a = {a: 1, b: 2, c: {d: 3}};
    test.same(L.keys(a), ['a','b','c']);
    test.done();
};

exports['values'] = function (test) {
    var a = {a: 1, b: 2, c: {d: 3}};
    test.same(L.values(a), [1,2,{d:3}]);
    test.done();
};

exports['flip'] = function (test) {
    var subtract = function (a, b) {
        return a - b;
    };
    test.equal(subtract(4,2), 2);
    test.equal(L.flip(subtract)(4,2), -2);
    test.equal(L.flip(subtract, 4)(2), -2);
    test.equal(L.flip(subtract, 4, 2), -2);
    test.done();
};

exports['pairs'] = function (test) {
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
    test.same(L.pairs(a), [
        ['one', 1],
        ['two', 2],
        ['three', {four: 4, five: {six: 6}}],
        ['seven', {eight: 8}]
    ]);
    test.done();
};

exports['join'] = function (test) {
    test.equal(L.join(':', ['a', 'b', 'c']), 'a:b:c');
    test.equal(L.join(' and ', ['abc', '123']), 'abc and 123');
    // partial application
    test.equal(L.join(':')(['a', 'b', 'c']), 'a:b:c');
    test.done();
};

exports['and'] = function (test) {
    test.equal(true && true, L.and(true, true));
    test.equal(true && false, L.and(true, false));
    test.equal(false && true, L.and(false, true));
    test.equal(false && false, L.and(false, false));
    // partial application
    test.equal(true && true, L.and(true)(true));
    test.equal(true && false, L.and(true)(false));
    test.equal(false && true, L.and(false)(true));
    test.equal(false && false, L.and(false)(false));
    test.done();
};

exports['or'] = function (test) {
    test.equal(true || true, L.or(true, true));
    test.equal(true || false, L.or(true, false));
    test.equal(false || true, L.or(false, true));
    test.equal(false || false, L.or(false, false));
    // partial application
    test.equal(true || true, L.or(true)(true));
    test.equal(true || false, L.or(true)(false));
    test.equal(false || true, L.or(false)(true));
    test.equal(false || false, L.or(false)(false));
    test.done();
};

exports['not'] = function (test) {
    test.equal(!true, L.not(true));
    test.equal(!false, L.not(false));
    test.done();
};

exports['all'] = function (test) {
    test.equal(L.all(L.not, [false, false, false]), true);
    test.equal(L.all(L.not, [true, false, false]), false);
    // partial applicatoin
    test.equal(L.all(L.not)([false, false, false]), true);
    test.equal(L.all(L.not)([true, false, false]), false);
    test.done();
};

exports['any'] = function (test) {
    test.equal(L.any(L.not, [false, false, false]), true);
    test.equal(L.any(L.not, [true, false, false]), true);
    test.equal(L.any(L.not, [true, true, true]), false);
    // partial applicatoin
    test.equal(L.any(L.not)([false, false, false]), true);
    test.equal(L.any(L.not)([true, false, false]), true);
    test.equal(L.any(L.not)([true, true, true]), false);
    test.done();
};

exports['elem'] = function (test) {
    test.equal(L.elem(3, [1,2,3,4]), true);
    test.equal(L.elem(6, [1,2,3,4]), false);
    test.equal(L.elem(6, []), false);
    // partial application
    test.equal(L.elem(3)([1,2,3,4]), true);
    test.equal(L.elem(6)([1,2,3,4]), false);
    test.equal(L.elem(6)([]), false);
    test.done();
};

exports['foldr'] = function (test) {
    var minus = function (a, b) {
        return a - b;
    };
    test.equal(L.foldr(minus, 1, [1,2,3]), 1);
    // partial application
    test.equal(L.foldr(minus, 1)([1,2,3]), 1);
    test.equal(L.foldr(minus)(1)([1,2,3]), 1);
    test.done();
};
