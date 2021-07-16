import { isEmpty, isFunc, isObject, isString, isArray } from '@frade-sam/samtools';
import { EventType, MonitorEvent, Task, TaskType } from './interface';

export class ProgressCore {
    constructor() {
        if (isObject(ProgressCore.manager)) return ProgressCore.manager;
        ProgressCore.manager = this;
        return ProgressCore.manager;
    }
    // 脚本加载器实例
    private static manager: ProgressCore;
    private startTime: number = 0;
    private timeInstance: { [key in TaskType]: number | null } = {
        assets: null,
        fetch: null,
    };
    private tasks: Task[] = [];
    private monitorEvent: { [key in EventType]: { key: TaskType, func: MonitorEvent }[] } = {
        start: [],
        end: [],
    };

    private publish<D = any>(item: Task): Promise<D | null> | (() => Promise<D>) {
        const { url, promise } = item;

        /** 资源地址为空或者有同一个任务时方式进度 */
        if (isEmpty(url) && !isFunc(promise)) return Promise.resolve(null);
        if (isFunc(promise)) {
            this.tasks.push(item);
            return async (): Promise<D> => {
                return promise(arguments).then((res) => {
                    this.end({ ...item, status: false })
                    return res;
                }).catch((err) => {
                    this.end({ ...item, status: false })
                    return err;
                })
            }
        }
        const find = this.tasks.find((task) => task.id === item.id && task.name === item.name && task.url === item.url && !!task.status);
        if (find) return Promise.resolve(null);
        this.tasks.push(item);
        return new Promise<D | null>((res) => {
            const oldnode = this.getScriptInstance(item.name);
            /** 如果存在旧的脚本或者资源则删除 */
            if (oldnode) oldnode.remove();
            const node = document.createElement('script');
            node.src = item.url as string;
            node.id = `dynamic-scipt-${item.name}`;
            node.dataset.id = item.id;
            document.body.append(node);
            node.addEventListener('load', () => {
                res(window[item.name as any] as any);
            })
        }).then((res) => {
            // 脚本加载完成后删除挂载在window中的对象
            this.end({ ...item, status: false })
            delete window[item.name as any];
            return res;
        }).catch(() => {
            this.end({ ...item, status: false })
            return null;
        });
    }

    private getScriptInstance(name: string) {
        return document.getElementById(`dynamic-scipt-${name}`);
    }

    public start<D = any>(item: Task): Promise<D | null> | (() => Promise<D>) {
        const funcs = this.monitorEvent["start"];
        const assestsstatus = this.tasks.filter((task) => task.type === 'assets').every((task) => !task.status);
        if (isArray(funcs)) {
            // 加载开始时间
            this.startTime = new Date().getTime();
            if (item) {
                /** 资源进度优先于接口进度样式 */
                if (item.type === 'fetch' && assestsstatus) {
                    funcs.find((func) => func.key === 'fetch')?.func(true);
                    return this.publish<D>({ ...item, status: true });
                }
                if (item.type === 'assets') {
                    funcs.find((func) => func.key === 'assets')?.func(true);
                    return this.publish<D>({ ...item, status: true });
                }
                return Promise.resolve(null);
            }
            return Promise.resolve(null);
        };
        return Promise.resolve(null);
    }

    private end(item: Task) {
        const funcs = this.monitorEvent["end"];
        this.tasks = this.tasks.filter((task) => task.id !== item.id && task.name !== item.name && task.type !== item.type);
        const status = this.tasks.filter((task) => task.type === item.type).every((task) => !task.status);
        const func = funcs.find((func) => func.key === item.type);
        if (!isEmpty(func) && isFunc(func?.func) && status) {
            // 加载结束时间
            const endTime = new Date().getTime();
            if ((endTime - this.startTime) < 2000 && !this.timeInstance[item.type]) {
                this.timeInstance[item.type] = setTimeout(() => {
                    func?.func(false);
                    clearTimeout(this.timeInstance[item.type] as any);
                    this.timeInstance[item.type] = null;
                }, 2000);
                return;
            }
            if (!this.timeInstance[item.type]) {
                func?.func(false);
                return;
            }
        }
        return;
    }

    /**
     * 监听函数注册，当所有脚本都已经加载完毕后访问
     * @param callback 
     */
    public monitor(status: EventType, key: TaskType, callback: MonitorEvent) {
        if (isFunc(this.monitorEvent[status])) return;
        const old = this.monitorEvent[status].find((event) => event.key === key);
        if (old) {
            this.monitorEvent[status].filter((event) => event.key !== key).concat([{ key, func: callback }]);
            return;
        }
        this.monitorEvent[status].push({ key, func: callback });
    }
}