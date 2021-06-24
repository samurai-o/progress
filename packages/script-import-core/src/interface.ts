
export type ScriptTask<O = any> = {
    name: string; // 脚本名称,
    version: string; // 脚本版本,
    script: string; // 脚本静态资源,
    status?: boolean; // 加载状态
    object?: O; // 脚本加载完成后的访问对象
}
export type FecthTask = {
    path: string;
    status?: boolean;
    time?: number;
    params?: any;
    method: string;
}

export type EventType = "start" | "end";

export type MonitorEvent = (status: boolean) => void;

export type GetFuncType<T> = T extends (arg: infer P) => void ? P : string;