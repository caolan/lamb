var L = {};
var slice = Array.prototype.slice;


L.isArray = Array.isArray || function (obj) {
    return toString.call(obj) === '[object Array]';
};
L.isObject = function (obj) {
    return obj === Object(obj);
};
L.isFunction = function (obj) {
  return toString.call(obj) == '[object Function]';
};

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

L.take = function (i, arr) {
    return slice.call(arr, 0, i);
};

L.drop = function (i, arr) {
    return slice.call(arr, i);
};

L.cons = function (el, arr) {
    return [el].concat(arr);
};

L.apply = function (fn, args) {
    return fn.apply(this, args);
};

L.curry = function (fn /* args... */) {
    var args = slice.call(arguments);
    return L.apply(L.ncurry, L.cons(fn.length, args));
};
L.ncurry = function (n, fn /* args... */) {
    var largs = slice.call(arguments, 2);
    if (largs.length >= n) {
        return L.apply(fn, L.take(n, largs));
    }
    return function () {
        var args = largs.concat(slice.call(arguments));
        if (args.length < n) {
            return L.apply(L.ncurry, [n, fn].concat(args));
        }
        return L.apply(fn, L.take(n, args));
    }
};

L.compose = function (/* f1, f2, ...*/) {
    var fns = slice.call(arguments);
    return function () {
        var args = arguments;
        for (var i = fns.length-1; i >= 0; --i) {
            args = [L.apply(fns[i], args)];
        }
        return args[0];
    };
};

L.head = function (arr) {
    return arr[0];
};

L.tail = function (arr) {
    return arr.slice(1);
};

//L.init = L.compose(L.take , '-1' , L.length);
L.init = function (arr) {
    return arr.slice(0, arr.length - 1);
};

L.last = function (arr) {
    return arr[arr.length - 1];
};

L.set = function (obj, path, val) {
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
};

L.get = function (obj, path, fullpath) {
    if (!L.isArray(path)) {
        path = [path];
    }
    if (path.length === 0) {
        return obj;
    }
    var p = L.head(path),
        ps = L.tail(path);

    if (obj.hasOwnProperty(p)) {
        return L.get(obj[p], ps, fullpath);
    }
    else if (fullpath) {
        throw new Error('Object ' + obj + ' does not have property: ' + p);
    }
    else {
        return undefined;
    }
};

L.foldl = function (iterator, memo, arr) {
    // TODO: make this cross-browser
    return arr.reduce(iterator, memo);
};
L.filter = function (fn, arr) {
    // TODO: make this cross-browser
    return arr.filter(fn);
};
L.each = function (fn, arr) {
    // TODO: make this cross-browser
    return arr.forEach(fn);
};

// TODO: make this cross-browser
L.keys = Object.keys;

L.values = function (obj) {
    var values = [];
    for (var k in obj) {
        values.push(obj);
    }
    return values;
};


L.freeze = Object.freeze;
L.deepFreeze = function (obj) {
    if (typeof obj === 'object') {
        L.freeze(obj);
        for (var k in obj) {
            if (obj.hasOwnProperty(k) && typeof obj === "object") {
                L.deepFreeze(obj[k]);
            }
        }
    }
    return obj;
};


// hopefully people can just use 'const' instead of 'var' eventually.
// also, this won't work in most older browsers anyway!
// ... this is probably a dumb idea ;)

L.constants = function (/* var names ..., fn */) {
    var args = slice.call(arguments),
        names = L.init(args),
        fn = L.last(args);

    var constObj = function (names) {
        var props = {};
        var constGetterSetter = function (obj, name) {
            obj.__defineGetter__(name, function () {
                return props[name];
            });
            obj.__defineSetter__(name, function (val) {
                if (name in props) {
                    // property has already been assigned to
                    throw new Error(
                        'Destructive assignment to ' + name + '\n' +
                        '  Previous value: ' + props[name] + '\n' +
                        '  New value: ' + val
                    );
                }
                props[name] = val;
            });
            return obj;
        };
        var r = L.foldl(constGetterSetter, {}, names);
        return L.freeze ? L.deepFreeze(r): r;
    };
    if (!L.isFunction(fn)) {
        return constObj(args);
    }
    else {
        return function () {
            return fn.apply(constObj(names), arguments);
        };
    }
};

L.install = L.foldl(function (src, prop) {
    return src + 'var ' + prop + '=L.' + prop + '; ';
}, '', L.keys(L));

module.exports = L;
