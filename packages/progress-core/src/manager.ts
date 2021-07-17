import { isEmpty, isFunc, isObject, isArray } from '@frade-sam/samtools';
import Nprogress from "nprogress";
import { Curry, Descriptor, EventType, MonitorEvent, Task, TaskType } from './interface';

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
        progress: [],
        start: [],
        end: [],
    };

    private publish<T = any>(item: Task, func: T): Curry<T> | T {
        const assestsstatus = this.tasks.filter((task) => task.type === 'assets').every((task) => !task.status);
        const fetchstatus = this.tasks.filter((task) => task.type === 'fetch').every((task) => !task.status);
        if (item.type === 'fetch' && !assestsstatus) return func;
        if (item.type === 'fetch') Nprogress.start();
        if (item.type === 'assets' && !fetchstatus) Nprogress.remove();
        /** 资源地址为空或者有同一个任务时方式进度 */
        if (!isFunc(func)) return func;
        const funcs = this.monitorEvent["start"];
        if (!isArray(funcs)) return func;
        const task = funcs.find((func) => func.key === item.type);
        if (!task || !isFunc(task.func)) return func;

        const taskFunc: any = (...args: any) => {
            this.tasks.push(item);
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

    public progress<T = any>(item: Task) {
        return (target: T, key?: any, descriptor?: any): Curry<T> | T | Descriptor => {
            if (!key && !descriptor && !isFunc(target)) return target;
            if (descriptor && !isFunc(descriptor.value)) return descriptor;
            const descriptorFunc = descriptor ? descriptor.value : target;
            const func = this.publish<T>({ ...item, status: true }, descriptorFunc);
            if (descriptor) {
                descriptor.value = func;
                return descriptor;
            }
            return func;
        }
    }

    private end(item: Task) {
        const funcs = this.monitorEvent["end"];
        this.tasks = this.tasks.filter((task) => task.id !== item.id && task.name !== item.name && task.type !== item.type);
        const status = this.tasks.filter((task) => task.type === item.type).every((task) => !task.status);
        const func = funcs.find((func) => func.key === item.type);
        if (!isEmpty(func) && isObject(func) && isFunc((func as any).func) && status) {
            // 加载结束时间
            const endTime = new Date().getTime();
            if ((endTime - this.startTime) < 2000 && !this.timeInstance[item.type]) {
                this.timeInstance[item.type] = setTimeout(() => {
                    (func as any).func(false);
                    clearTimeout(this.timeInstance[item.type] as any);
                    Nprogress.done();
                    this.timeInstance[item.type] = null;
                }, 2000);
                return;
            }
            if (!this.timeInstance[item.type]) {
                (func as any).func(false);
                Nprogress.done();
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