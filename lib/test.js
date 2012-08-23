
var nativeRandomLCG = function (seed) {
    return function () {
        seed = (214013 * seed + 2531011) % 0x100000000;
        return seed * (1.0 / 4294967296.0);
    };
};
var random=nativeRandomLCG(Date.now());


var count=1000000;
var a=0,b=0;

console.time("math");
for (var i=0;i<count;i++){
	b=Math.random();
}
console.timeEnd("math");


console.time("lcg");
for (var i=0;i<count;i++){
	a=random();
}
console.timeEnd("lcg");

