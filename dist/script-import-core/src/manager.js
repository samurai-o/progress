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
        define(["require", "exports", "sam-tools"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScriptManager = void 0;
    const sam_tools_1 = require("sam-tools");
    class ScriptManager {
        constructor() {
            this.startTime = 0;
            this.timeInstance = null;
            this.loading = false;
            this.scripts = [];
            this.fetchs = [];
            this.monitorEvent = {
                start: [],
                end: [],
            };
            if (sam_tools_1.isObject(ScriptManager.manager))
                return ScriptManager.manager;
            ScriptManager.manager = this;
            return ScriptManager.manager;
        }
        publish(type, item) {
            if (type === 'script') {
                const task = this.scripts.find((sc) => sc.name === item.name);
                if (task) {
                    this.scripts = this.scripts.filter((script) => script.name !== item.name).concat(Object.assign(Object.assign({}, task), item));
                    return;
                }
                this.scripts.push(item);
            }
            else {
                const task = this.fetchs.find((fet) => fet.path === item.path && fet.method === item.method && fet.time === item.time);
                if (task && !item.status) {
                    this.fetchs = this.fetchs.filter((fet) => fet.path !== item.path && fet.method !== item.method && fet.time !== item.time);
                    return;
                }
                this.fetchs.push(item);
            }
        }
        getScriptInstance(name) {
            return document.getElementById(`dynamic-scipt-${name}`);
        }
        setScriptInstance(item) {
            const { name, version, script } = item;
            const oldNode = this.getScriptInstance(name);
            if (!!oldNode) {
                oldNode.remove();
            }
            const node = document.createElement('script');
            node.src = item.script;
            node.id = `dynamic-scipt-${name}`;
            node.dataset.version = version;
            document.body.append(node);
            return new Promise((res) => {
                node.addEventListener('load', (even) => {
                    res(window[item.name]);
                });
            }).then((res) => {
                this.publish("script", { name, version, script, status: false, object: res });
                delete window[item.name];
                return true;
            }).catch(() => {
                this.publish("script", { name, version, script, status: false });
                return false;
            });
        }
        loader(item) {
            const node = document.createElement('script');
            if (sam_tools_1.isEmpty(item) || !sam_tools_1.isString(item.script))
                return Promise.resolve(false);
            const { name, version, script } = item;
            this.publish('script', { name, version, script, status: true });
            return this.setScriptInstance(item);
        }
        start(item) {
            const funcs = this.monitorEvent["start"];
            if (!this.loading && sam_tools_1.isArray(funcs)) {
                if (item)
                    this.publish("fetch", Object.assign(Object.assign({}, item), { status: true }));
                this.startTime = new Date().getTime();
                this.loading = true;
                funcs.forEach((func) => func.func(true));
            }
            ;
        }
        end(item) {
            const funcs = this.monitorEvent["end"];
            if (item)
                this.publish("fetch", Object.assign(Object.assign({}, item), { status: false }));
            if (this.loading && sam_tools_1.isArray(funcs) && this.checkStatus()) {
                const endTime = new Date().getTime();
                this.loading = false;
                if ((endTime - this.startTime) < 2000 && !this.timeInstance) {
                    this.timeInstance = setTimeout(() => {
                        funcs.forEach((func) => func.func(false));
                        clearTimeout(this.timeInstance);
                        this.timeInstance = null;
                    }, 2000);
                    return;
                }
                if (!this.timeInstance) {
                    funcs.forEach((func) => func.func(false));
                    return;
                }
            }
        }
        checkStatus() {
            return this.scripts.every((script) => !script.status) && this.fetchs.every((fet) => !fet.status);
        }
        import(item) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.loader(item);
                return this.getPackage(item.name, item.version);
            });
        }
        imports(items) {
            return __awaiter(this, void 0, void 0, function* () {
                this.start();
                yield Promise.all(items.map((item) => this.loader(item))).then((values) => values.every((value) => !!value)).catch(() => false);
                this.end();
            });
        }
        monitor(status, key, callback) {
            var _a;
            if (sam_tools_1.isFunc(this.monitorEvent[status]))
                return;
            (_a = this.monitorEvent[status]) === null || _a === void 0 ? void 0 : _a.push({ key, func: callback });
        }
        getPackage(name, version) {
            const pkg = this.scripts.find((script) => script.name === name && script.version === version);
            if (sam_tools_1.isObject(pkg))
                return pkg === null || pkg === void 0 ? void 0 : pkg.object;
            return null;
        }
    }
    exports.ScriptManager = ScriptManager;
});
//# sourceMappingURL=manager.js.map