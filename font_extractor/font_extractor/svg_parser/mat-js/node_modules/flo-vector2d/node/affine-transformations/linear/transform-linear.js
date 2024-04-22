function transformLinear([[a, b], [c, d]], p) {
    function transform([x, y]) {
        return [
            a * x + b * y,
            c * x + d * y
        ];
    }
    // Curry the function
    return p === undefined ? transform : transform(p);
}
export { transformLinear };
//# sourceMappingURL=transform-linear.js.map