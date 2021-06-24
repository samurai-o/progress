var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "react-dom", "./loading", "./packageContext"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PackageProvider = void 0;
    const react_1 = __importStar(require("react"));
    const react_dom_1 = require("react-dom");
    const loading_1 = require("./loading");
    const packageContext_1 = require("./packageContext");
    function PackageProvider(props) {
        const { manager, children } = props;
        const loading = react_1.useRef(null);
        const startEvent = react_1.useCallback((status) => {
            const oldEle = document.getElementById("dynamic-scipt-loading");
            if (!oldEle) {
                const node = react_1.default.createElement(loading_1.ImportLoading, {
                    ref: loading,
                    children: props.loading || react_1.default.createElement(loading_1.DefaultLoading),
                });
                const scriptLoading = document.createElement("div");
                scriptLoading.id = "dynamic-scipt-loading-container";
                document.body.append(scriptLoading);
                react_dom_1.render(node, scriptLoading, () => {
                    if (loading.current)
                        loading.current.open();
                });
            }
            else {
                if (loading.current)
                    loading.current.open();
            }
        }, [loading.current]);
        const endEvent = react_1.useCallback((status) => {
            if (loading.current) {
                loading.current.close();
            }
        }, [loading.current]);
        manager.monitor("end", "react-loading", endEvent);
        manager.monitor("start", "react-loading", startEvent);
        const importPackage = (item) => __awaiter(this, void 0, void 0, function* () {
            yield manager.import(item);
        });
        const importPackages = (items) => __awaiter(this, void 0, void 0, function* () {
            yield manager.imports(items);
        });
        const status = (status, item) => __awaiter(this, void 0, void 0, function* () {
            if (status) {
                yield manager.start(item);
            }
            else {
                yield manager.end(item);
            }
        });
        return (react_1.default.createElement(packageContext_1.PackageContext.Provider, { value: {
                status,
                packages: [],
                importPackage,
                importPackages,
            } }, children));
    }
    exports.PackageProvider = PackageProvider;
});
//# sourceMappingURL=provider.js.map