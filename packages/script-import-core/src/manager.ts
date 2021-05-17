import { isEmpty, isFunc, isObject, isString } from 'sam-tools';
import { EventType, MonitorEvent, ScriptInfo } from './interface';

export class ScriptManager {
    constructor() {
        if (isObject(ScriptManager.manager)) return ScriptManager.manager;
        ScriptManager.manager = this;
        return ScriptManager.manager;
    }
    private loading: boolean = false;
    // 脚本加载器实例
    private static manager: ScriptManager;
    private scripts: ScriptInfo[] = [];
    private monitorEvent: { [key in EventType]?: MonitorEvent } = {};


    /**
     * 脚本加载任务
     * @param item 
     * @returns 
     */
    private publish(item: ScriptInfo) {
        const task = this.scripts.find((sc) => sc.name === item.name);
        if (task) {
            this.scripts.filter((script) => script.name !== item.name).concat({ ...task, ...item });
            return;
        }
        this.scripts.push(item);
    }

    /**
     * 检查静态文件是否已经实例
     * @param name 
     */
    private getScriptInstance(name: string) {
        return document.getElementById(`dynamic-scipt-${name}`);
    }

    private setScriptInstance(item: ScriptInfo) {
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
            node.addEventListener('load', () => {
                res(window[item.name as any]);
            });
        }).then((res) => {
            // 脚本加载完成后删除挂载在window中的对象
            this.publish({ name, version, script, status: false, object: res });
            delete window[item.name as any];
            return true;
        }).catch(() => {
            this.publish({ name, version, script, status: false });
            return false;
        });
    }

    /**
     * 脚本加载方法
     * @param item 
     * @returns 
     */
    private loader(item: ScriptInfo): Promise<boolean> {
        const node = document.createElement('script');
        if (isEmpty(item) || !isString(item.script)) return Promise.resolve(false);
        const { name, version, script } = item;
        this.publish({ name, version, script, status: true });
        return this.setScriptInstance(item);
    }

    private start() {
        const func = this.monitorEvent["start"];
        if (!this.loading && isFunc(func)) {
            this.loading = true;
            func(true);
        };
    }

    private end() {
        const func = this.monitorEvent["end"];
        if (this.loading && isFunc(func) && this.checkStatus()) {
            this.loading = false;
            func(false);
        }
    }

    /**
     * 检查是否都加载完成了
     */
    private checkStatus() {
        return this.scripts.every((script) => !script.status);
    }

    public async import<P = any>(item: ScriptInfo): Promise<P> {
        await this.loader(item);
        return this.getPackage(item.name, item.version) as any;
    }

    public async imports(items: ScriptInfo[]) {
        this.start();
        await Promise.all(items.map((item) => this.loader(item))).then((values) => values.every((value) => !!value)).catch(() => false);
        this.end();
    }

    /**
     * 监听函数注册，当所有脚本都已经加载完毕后访问
     * @param callback 
     */
    public monitor(status: EventType, callback: MonitorEvent) {
        this.monitorEvent[status] = callback;
    }

    public getPackage<P = any>(name: string, version: string): P | null {
        const pkg = this.scripts.find((script) => script.name === name && script.version === version);
        console.log(name, version, this.scripts);
        if (isObject(pkg)) return pkg?.object;
        return null;
    }
}