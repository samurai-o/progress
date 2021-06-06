(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PackageContext = void 0;
    const react_1 = require("react");
    exports.PackageContext = react_1.createContext({
        packages: [],
        importPackage: (item) => Promise.resolve(),
        importPackages: (items) => Promise.resolve(),
    });
});
//# sourceMappingURL=packageContext.js.map