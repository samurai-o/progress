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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "react", "styled-components", "classnames"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DefaultLoading = exports.ImportLoading = void 0;
    const react_1 = __importStar(require("react"));
    const styled_components_1 = __importStar(require("styled-components"));
    const classnames_1 = __importDefault(require("classnames"));
    window.styled = styled_components_1.default;
    const Container = styled_components_1.default.div `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    transition: all 1s ease;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${props => !!props.open ? 1 : 0};
    pointer-events: ${props => !!props.open ? "all" : "none"};
    '&.open': {
        opacity: 1;
    },
    '&.close': {
        opacity: 0;
    }
`;
    exports.ImportLoading = react_1.forwardRef((props, ref) => {
        const [open, setOpen] = react_1.useState(false);
        const openHandler = react_1.useCallback(() => {
            setOpen(true);
        }, [open]);
        const closeHandler = react_1.useCallback(() => {
            setOpen(false);
        }, [open]);
        react_1.useImperativeHandle(ref, () => ({
            open: openHandler,
            close: closeHandler
        }));
        return (react_1.default.createElement(Container, { id: "dynamic-scipt-loading", open: open, className: classnames_1.default({ open, close: !open }) }, props.children));
    });
    const squarejellyboxanimate = styled_components_1.keyframes `
    17%{border-bottom-right-radius:10%}
    25%{-webkit-transform:translateY(25%) rotate(22.5deg);transform:translateY(25%) rotate(22.5deg)}
    50%{border-bottom-right-radius:100%;-webkit-transform:translateY(50%) scale(1, 0.9) rotate(45deg);transform:translateY(50%) scale(1, 0.9) rotate(45deg)}
    75%{-webkit-transform:translateY(25%) rotate(67.5deg);transform:translateY(25%) rotate(67.5deg)}
    100%{-webkit-transform:translateY(0) rotate(90deg);transform:translateY(0) rotate(90deg)}
`;
    const squarejellyboxshadow = styled_components_1.keyframes `
   50%{-webkit-transform:scale(1.25, 1);transform:scale(1.25, 1)}
`;
    const DefaultLoadingContainer = styled_components_1.default.div `
    position:relative;
    -webkit-box-sizing:border-box;
    -moz-box-sizing:border-box;
    box-sizing:border-box;
    display:block;
    font-size:0;
    color:#fff;
    width:64px;
    height:64px;
    &>div {
        position:relative;
        -webkit-box-sizing:border-box;
        -moz-box-sizing:border-box;
        box-sizing:border-box;
    }
    &>div:nth-child(1),&>div:nth-child(2) {position:absolute;left:0;width:100%}
    &>div:nth-child(1) {
        top:-25%;
        z-index:1;
        height:100%;
        border-radius:10%;
        background: #30b2f3;
        -webkit-animation:${squarejellyboxanimate} 0.6s -0.1s linear infinite;
        -moz-animation:${squarejellyboxanimate} 0.6s -0.1s linear infinite;
        -o-animation:${squarejellyboxanimate} 0.6s -0.1s linear infinite;
        animation:${squarejellyboxanimate} 0.6s -0.1s linear infinite;
    }
    &>div:nth-child(2) {
        bottom:-9%;height:10%;
        background:#000;
        border-radius:50%;
        opacity:.2;
        -webkit-animation:${squarejellyboxshadow} 0.6s -0.1s linear infinite;
        -moz-animation:${squarejellyboxshadow} 0.6s -0.1s linear infinite;
        -o-animation:${squarejellyboxshadow} 0.6s -0.1s linear infinite;
        animation:${squarejellyboxshadow} 0.6s -0.1s linear infinite;
    }
`;
    function DefaultLoading() {
        return (react_1.default.createElement(DefaultLoadingContainer, null,
            react_1.default.createElement("div", null),
            react_1.default.createElement("div", null)));
    }
    exports.DefaultLoading = DefaultLoading;
});
//# sourceMappingURL=loading.js.map