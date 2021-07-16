// 事件类型
export type EventType = "start" | "end";

// 任务类型
export type TaskType = "assets" | "fetch";

// 事件执行函数
export type MonitorEvent = (status: boolean) => void;

export type GetFuncType<T> = T extends (arg: infer P) => void ? P : string;

export type Task<D = any> = {
    name: string;
    id: string;
    type: TaskType;
    promise?: (...args: any) => Promise<D>;
    url?: string; // 链接地址
    status?: boolean; // 任务状态
}