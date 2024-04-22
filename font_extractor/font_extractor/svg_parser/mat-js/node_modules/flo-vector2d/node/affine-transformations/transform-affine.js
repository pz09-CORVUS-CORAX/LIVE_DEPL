function transformAffine([[a, b], [c, d]], [r, s], p) {
    function transform([x, y]) {
        return [
            a * x + b * y + r,
            c * x + d * y + s
        ];
    }
    // Curry the function
    return p === undefined ? transform : transform(p);
}
export { transformAffine };
//# sourceMappingURL=transform-affine.js.map