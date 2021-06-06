(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "sam-tools", "./packageContext"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PackageConsumer = void 0;
    const react_1 = require("react");
    const sam_tools_1 = require("sam-tools");
    const packageContext_1 = require("./packageContext");
    function PackageConsumer(props) {
        const context = react_1.useContext(packageContext_1.PackageContext);
        return sam_tools_1.isFunc(props.children) ? props.children(context) : null;
    }
    exports.PackageConsumer = PackageConsumer;
});
//# sourceMappingURL=consumer.js.map