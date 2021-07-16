import { isEmpty, isFunc, isObject, isString, isArray } from '@frade-sam/samtools';
import { Curry, EventType, MonitorEvent, Task, TaskType } from './interface';

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

    private publish<T = any>(item: Task, func: T): Curry<T> | null {
        const find = this.tasks.find((task) => task.id === item.id && task.name === item.name && task.type === item.type && !!task.status);

        /** 资源地址为空或者有同一个任务时方式进度 */
        if (!isFunc(func)) return null;
        this.tasks.push(item);
        const taskFunc: any = (...args: any) => {
            const res = func(...args);
            if (res instanceof Promise) {
                return res.then((res) => {
                    this.end({ ...item, status: false })
                    return res;
                }).catch((err) => {
                    this.end({ ...item, status: false })
                    return err;
                })
            }
            this.end({ ...item, status: false })
            return res;
        }
        return taskFunc;
    }

    public progress<T = any>(item: Task, func: T): Curry<T> | null {
        const funcs = this.monitorEvent["start"];
        const assestsstatus = this.tasks.filter((task) => task.type === 'assets').every((task) => !task.status);
        if (isArray(funcs)) {
            // 加载开始时间
            this.startTime = new Date().getTime();
            if (item) {
                /** 资源进度优先于接口进度样式 */
                if (item.type === 'fetch' && assestsstatus) {
                    funcs.find((func) => func.key === 'fetch')?.func(true);
                    return this.publish<T>({ ...item, status: true }, func);
                }
                if (item.type === 'assets') {
                    funcs.find((func) => func.key === 'assets')?.func(true);
                    return this.publish<T>({ ...item, status: true }, func);
                }
                return null;
            }
            return null;
        };
        return null;
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
    protected monitor(status: EventType, key: TaskType, callback: MonitorEvent) {
        if (isFunc(this.monitorEvent[status])) return;
        const old = this.monitorEvent[status].find((event) => event.key === key);
        if (old) {
            this.monitorEvent[status].filter((event) => event.key !== key).concat([{ key, func: callback }]);
            return;
        }
        this.monitorEvent[status].push({ key, func: callback });
    }
}