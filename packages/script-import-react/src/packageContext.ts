import { createContext } from 'react';
import { FecthTask, ScriptTask } from 'script-import-core';

export type PackageContextType = {
    packages: any[];
    status: (status: boolean, item?: FecthTask) => Promise<void>;
    importPackage: (item: ScriptTask) => Promise<void>;
    importPackages: (items: ScriptTask[]) => Promise<void>;
}

export const PackageContext = createContext<PackageContextType>({
    packages: [],
    status: (status: boolean) => Promise.resolve(),
    importPackage: (item: ScriptTask) => Promise.resolve(),
    importPackages: (items: ScriptTask[]) => Promise.resolve(),
});