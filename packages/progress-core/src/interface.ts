// 事件类型
export type EventType = "start" | "end";

// 任务类型
export type TaskType = "assets" | "fetch";

// 事件执行函数
export type MonitorEvent = (status: boolean) => void;

export type GetFuncType<T> = T extends (arg: infer P) => void ? P : string;

// your answers
export type Curry<T> = T extends (...args: infer A) => infer R ? (...arg: A) => R : never



export type Task<D = any> = {
    name: string;
    id: string;
    type: TaskType;
    status?: boolean; // 任务状态
}