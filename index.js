const identity = x => x;

const add = (a,b) => a + b;

const sub = (a,b) => a - b;

const mul = (a,b) => a * b;

const identityf = x => () => identity(x);

const addf = a => b => add(a, b);

const curry = (func, a) => b => func(a, b);

const curryr = (func, b) => (a) => func(a, b);

const liftf = func => (a) => (b) => func(a, b);

const inc = addf(1);

const twice = func => a => func(a, a);

const double = twice(add);

const square = twice(mul);

const reverse = func => (a, b) => func(b, a);

const composeu = (f, g) => a => g(f(a));

const composeb = (f, g) => (a, b, c) => g(f(a, b), c);
// console.log(composeb(add, mul)(2, 3, 7)) // 35

const limit = (func, max) => (...args) => {
    max--;
    return max >= 0 ? func(...args) : undefined
};
const add_ltd = limit(add, 1);
// console.log(add_ltd(3, 4)) // 7
// console.log(add_ltd(3, 4)) // undefined

const from = x => () => x++;
// let index = from(0);
// console.log(index()); // 0
// console.log(index()); // 1
// console.log(index()); // 2

const to = (gen, end) => () => {
    let curr = gen();
    return curr < end ? curr : undefined;
};
// let index = to(from(2), 4);
// console.log(index()); // 2
// console.log(index()); // 3
// console.log(index()); // undefined

const thru = (gen, end) => () => {
    let curr = gen();
    return curr <= end ? curr : undefined;
};
// let index = thru(from(2), 4);
// console.log(index()); // 2
// console.log(index()); // 3
// console.log(index()); // 4
// console.log(index()); // undefined

const fromTo = (a, b) => to(from(a), b);
// let index = fromTo(0, 3);
// console.log(index()); // 0
// console.log(index()); // 1
// console.log(index()); // 2
// console.log(index()); // undefined

const element = (arr, gen) => () => {
    // move this if up
    if (gen === undefined){
        gen = fromTo(0, arr.length);
    }
    let curr = gen();
    return curr === undefined ? undefined : arr[curr];
}
// let ele = element(["a", "b", "c", "d"], fromTo(1, 3));
// console.log(ele()); // b
// console.log(ele()); // c
// console.log(ele()); // undefined
// ele = element(["a", "b", "c", "d"]);
// console.log(ele()); // a
// console.log(ele()); // b
// console.log(ele()); // c
// console.log(ele()); // d
// console.log(ele()); // undefined

const collect = (gen, arr) => () => {
    let curr = gen();
    if (curr !== undefined) {
        arr.push(curr);
        return curr;
    }
};
// let array = [];
// let col = collect(fromTo(0, 2), array);
// console.log(col()); // 0
// console.log(col()); // 1
// console.log(col()); // undefined
// console.log(array); // [0, 1]

const filter = (gen, predicate) => () => {
    let curr = null;
    do {
        curr = gen();
        if (predicate(curr)) return curr;
    }
    while (curr !== undefined);
};
// let fil = filter(fromTo(0, 5), function divisibleBy3(val){ return (val % 3) === 0; });
// console.log(fil()); // 0
// console.log(fil()); // 3
// console.log(fil()); // undefined

const concat = (gen1, gen2) => () => {
    let curr = gen1();
    if (curr !== undefined) return curr;
    return gen2();
}
// let con = concat(fromTo(0, 3), fromTo(0, 2));
// console.log(con()); // 0
// console.log(con()); // 1
// console.log(con()); // 2
// console.log(con()); // 0
// console.log(con()); // 1
// console.log(con()); // undefined

const gensymf = s => {
    let curr = 0;
    return () => {
        curr = inc(curr); // use "from" instead
        return s + curr;
    }
};
// let geng = gensymf("G");
// let genh = gensymf("H");
// console.log(geng()); // G1
// console.log(genh()); // H1
// console.log(geng()); // G2
// console.log(genh()); // H2

const fibonaccif = (a,b) => {
    const memo = []; // remove this
    return () => {
        if (memo.length == 0) {
            memo.push(a);
            return a;
        };
        if (memo.length == 1) {
            memo.push(b);
            return b;
        };
        let next = add(...memo.slice(memo.length - 2));
        memo.push(next);
        return next;
    };
};

// let fib = fibonaccif(0, 1);
// console.log(fib()); // 0
// console.log(fib()); // 1
// console.log(fib()); // 1
// console.log(fib()); // 2
// console.log(fib()); // 3
// console.log(fib()); // 5
// console.log(fib()); // 8
// console.log(fib()); // 13
// console.log(fib()); // 21

const counter = n =>  Object.create({
    up: () => {
        n = inc(n);
        return n;
    },
    down: () => {
        n = sub(n, 1);
        return n;
    }
});
// let obj = counter(10);
// let up = obj.up;
// let down = obj.down;
// console.log(up()); // 11
// console.log(down()); // 10
// console.log(down()); // 9
// console.log(up()); // 10

const revocable = func => {
    return {
        invoke: (...args) => {
            if (func !== undefined) return func(...args)
        },
        revoke: () => func = undefined
    }
};
// let rev = revocable(add);
// let add_rev = rev.invoke;
// console.log(add_rev(3, 4)) // 7
// rev.revoke();
// console.log(add_rev(5, 7)) // undefined

const m = (value, source) => {
    return {
        value: value,
        source: (typeof source === "string") ? source : String(value)
    }
};

// const addm = (m1, m2) => {
//     return m(m1.value + m2.value, `(${m1.source}+${m2.source})`);
// };
// console.log(JSON.stringify(addm(m(3), m(4)))) // {"value":7,"source":"(3+4)"}
// console.log(JSON.stringify(addm(m(1), m(Math.PI, "pi")))) // {"value":4.141592653589793,"source":"(1+pi)"}

const liftm = (func, s) => (a, b) => {
    a = typeof a === "number" ? m(a) : a; // remove duplication
    b = typeof b === "number" ? m(b) : b;
    return m(func(a.value, b.value), `(${a.source}+${b.source})`)};

let addm = liftm(add, "+");
// console.log(JSON.stringify(addm(m(3), m(4)))); // 3+4=7
// console.log(JSON.stringify(liftm(mul, "*")(m(3), m(4)))); // 3*4=12
// console.log(JSON.stringify(liftm(add, "+")(3, 4))) // 3+4=7

const objectify = (...props) => (...args) => {
    let obj = Object.create(null);
    props.forEach((prop, i) => obj[prop] = args[i])
    return obj;
}
// let make = objectify("date", "marry", "kill");
// console.log(JSON.stringify(make("butterfly", "unicorn", "monster"))); //{"date":"butterfly","marry":"unicorn","kill":"monster"}

const join = (make, ...gens) => () => make(...gens.map(gen => gen()));
let fo = join(objectify("number", "fibonacci"), from(0), fibonaccif(4, 5))
// console.log(fo()); // { number: 0, fibonacci: 4 }
// console.log(fo()); // { number: 1, fibonacci: 5 }
// console.log(fo()); // { number: 2, fibonacci: 9 }

const continuize = func => (cb, val) => cb(func(val));

let sqrtc = continuize(Math.sqrt);
sqrtc(console.log, 81)

exports.fun = { add, sub, mul, twice, reverse };