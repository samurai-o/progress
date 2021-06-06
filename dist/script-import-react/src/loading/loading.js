var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "./styles"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DefaultLoading = void 0;
    const react_1 = __importDefault(require("react"));
    const styles_1 = require("./styles");
    function DefaultLoading() {
        return (react_1.default.createElement(styles_1.DefaultLoadingContainer, null,
            react_1.default.createElement("div", null),
            react_1.default.createElement("div", null)));
    }
    exports.DefaultLoading = DefaultLoading;
});
//# sourceMappingURL=loading.js.map