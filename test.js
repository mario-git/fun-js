const fun = require("./index").fun;

describe("my fun function should work!", () => {
    it("add", () =>{
        expect(fun.add(2, 3)).toBe(5);
    });

    it("twice", () =>{
        expect(fun.twice(fun.add)(11)).toBe(22);
        expect(fun.twice(fun.mul)(11)).toBe(121);
    });

    it("reverse", () =>{
        expect(fun.reverse(fun.sub)(3, 2)).toBe(-1);
    })
})