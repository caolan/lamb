/**
 * and, break, concat,
 * even,
 * lines
 * mod, null, odd, or, ord, pi, pred, putStr, product, quot, rem,
 * repeat, replicate, reverse, round, show, sin, snd, sort, span, splitAt,
 * sqrt, subtract, succ, sum, tail, take, takeWhile, tan, toLower, toUpper,
 * truncate, undefined, unlines, until, unwords, words, zip, zipWith, (!!),
 * (.), (**), (^), (^^), (%), (*), (/), (+), (-), (:), (++), (/=), (==), (<),
 * (<=), (>), (>=), (&&), (||)
 */




var L = {};
var slice = Array.prototype.slice;


/***** Types *****/

L.isArray = Array.isArray || function (obj) {
    return toString.call(obj) === '[object Array]';
};
L.isObject = function (obj) {
    return obj === Object(obj);
};
L.isFunction = function (obj) {
    return toString.call(obj) == '[object Function]';
};
L.isString = function (obj) {
    return toString.call(obj) == '[object String]';
};


/***** Functions *****/

L.curry = function (fn /* args... */) {
    var args = slice.call(arguments);
    return L.ncurry.apply(this, [fn.length].concat(args));
};
L.ncurry = function (n, fn /* args... */) {
    var largs = slice.call(arguments, 2);
    if (largs.length >= n) {
        return L.apply(fn, largs.slice(0, n));
    }
    return function () {
        var args = largs.concat(slice.call(arguments));
        if (args.length < n) {
            return L.ncurry.apply(this, [n, fn].concat(args));
        }
        return fn.apply(this, args.slice(0, n));
    }
};

L.compose = function (/* f1, f2, ...*/) {
    var fns = slice.call(arguments);
    return function () {
        var args = arguments;
        for (var i = fns.length-1; i >= 0; --i) {
            args = [fns[i].apply(this, args)];
        }
        return args[0];
    };
};

L.apply = L.curry(function (fn, args) {
    return fn.apply(this, args);
});

L.flip = L.curry(function (fn, x, y) {
    return fn(y, x);
});


/***** Boolean tests *****/

L.and = L.curry(function (a, b) {
    return a && b;
});

L.or = L.curry(function (a, b) {
    return a || b;
});

L.not = function (a) {
    return !a;
};


/***** Numbers *****/

L.max = L.curry(function (x, y) {
    return x >= y ? x: y;
});

L.min = L.curry(function (x, y) {
    return x <= y ? x: y;
});


/***** Lists *****/

L.length = function (arr) {
    return arr.length;
};

L.cons = L.curry(function (el, arr) {
    return [el].concat(arr);
});

L.concat = L.curry(function (a, b) {
    if (L.isArray(a)) {
        return Array.prototype.concat.apply(a, b);
    }
    if (L.isString(a)) {
        return a + b;
    }
    throw new Error(
        'Cannot concat types "' + (typeof a) + '" and "' + (typeof b) + '"'
    );
});

L.take = L.curry(function (i, xs) {
    return slice.call(xs, 0, i);
});

L.drop = L.curry(function (i, xs) {
    return slice.call(xs, i);
});

L.dropWhile = L.curry(function (p, xs) {
    var len = xs.length, i = 0;
    while (i < len && p(xs[i])) {
        i++;
    }
    return L.drop(i, xs);
});

L.head = function (arr) {
    if (arr.length) {
        return arr[0];
    }
    throw new Error('head of empty array');
};

L.tail = function (arr) {
    if (arr.length) {
        return arr.slice(1);
    }
    throw new Error('tail of empty array');
};

L.init = function (arr) {
    if (arr.length) {
        return arr.slice(0, arr.length - 1);
    }
    throw new Error('init of empty array');
};

L.last = function (arr) {
    if (arr.length) {
        return arr[arr.length - 1];
    }
    throw new Error('last of empty array');
};

L.foldl = L.curry(function (iterator, memo, arr) {
    // TODO: make this cross-browser
    return arr.reduce(iterator, memo);
});
L.foldl1 = L.curry(function (iterator, arr) {
    return L.foldl(iterator, L.head(arr), L.tail(arr));
});
L.foldr = L.curry(function (iterator, memo, arr) {
    var r = memo;
    for (var i = arr.length - 1; i >= 0; --i) {
        r = iterator(arr[i], r);
    }
    return r;
});
L.foldr1 = L.curry(function (iterator, arr) {
    return L.foldr(iterator, L.last(arr), L.init(arr));
});
L.filter = L.curry(function (fn, arr) {
    // TODO: make this cross-browser
    return arr.filter(fn);
});
L.map = L.curry(function (fn, arr) {
    // TODO: make this cross-browser
    return arr.map(fn);
});
L.concatMap = L.curry(function (f, arr) {
    return L.foldl1(L.concat, L.map(f, arr));
});

/*
L.each = function (fn, arr) {
    // TODO: make this cross-browser
    return arr.forEach(fn);
};
*/

L.range = function (a, b) {
    var arr = [];
    for (var i = a; i < b; i++) {
        arr.push(i);
    }
    return arr;
};

L.join = L.curry(function (delim, arr) {
    return Array.prototype.join.call(arr, delim);
});

L.elem = L.curry(function (x, xs) {
    for (var i = 0, len = xs.length; i < len; i++) {
        if (xs[i] === x) {
            return true;
        }
    }
    return false;
});

L.notElem = L.curry(function (x, xs) {
    return L.not(L.elem(x, xs));
});


/***** Special folds *****/

L.all = L.curry(function (p, xs) {
    return L.foldl(L.and, true, L.map(p, xs));
});

// TODO: return early when true result found
L.any = L.curry(function (p, xs) {
    return L.foldl(L.or, false, L.map(p, xs));
});

L.maximum = L.foldl1(L.max);
L.minimum = L.foldl1(L.min);


/***** Objects *****/

L.shallowClone = function (obj) {
    if (L.isArray(obj)) {
        return slice.call(obj);
    }
    var newobj = {};
    for (var k in obj) {
        newobj[k] = obj[k];
    }
    return newobj;
};

L.deepClone = function (obj) {
    if (L.isArray(obj)) {
        return map(L.deepClone, obj);
    }
    if (L.isObject(obj)) {
        var newobj = {};
        for (var k in obj) {
            newobj[k] = L.deepClone(obj[k]);
        }
        return newobj;
    }
    return obj;
};

L.jsonClone = function (obj) {
    return JSON.parse( JSON.stringify(obj) );
};

L.set = L.curry(function (obj, path, val) {
    if (!L.isArray(path)) {
        path = [path];
    }
    if (path.length === 0) {
        return val;
    }
    var newobj = L.shallowClone(obj),
        p = L.head(path),
        ps = L.tail(path);

    if (L.isObject(obj[p])) {
        newobj[p] = L.set(L.shallowClone(obj[p]), ps, val);
    }
    else {
        newobj[p] = L.set({}, ps, val);
    }
    return newobj;
});

L.get = L.curry(function (obj, path) {
    if (!L.isArray(path)) {
        path = [path];
    }
    if (path.length === 0) {
        return obj;
    }
    var p = L.head(path),
        ps = L.tail(path);

    if (obj.hasOwnProperty(p)) {
        return L.get(obj[p], ps);
    }
    return undefined;
});

L.freeze = Object.freeze;

L.deepFreeze = function (obj) {
    if (typeof obj === 'object') {
        L.freeze(obj);

        //map L.values(obj)

        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                L.deepFreeze(obj[k]);
            }
        }
    }
    return obj;
};

// TODO: make this cross-browser
L.keys = Object.keys;

L.values = function (obj) {
    return L.map(L.get(obj), L.keys(obj));
};

L.pairs = function (obj) {
    return L.map(function (k) { return [k, obj[k]]; }, L.keys(obj));
};


/***** Utilities *****/

L.id = function (x) {
    return x;
};

L.install = L.foldl(function (src, prop) {
    return src + 'var ' + prop + '=L.' + prop + '; ';
}, '', L.keys(L));


if (typeof module !== 'undefined' && module.exports) {
    module.exports = L;
}
