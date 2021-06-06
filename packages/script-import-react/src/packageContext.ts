import { createContext } from 'react';
import { ScriptInfo } from 'script-import-core';

export type PackageContextType = {
    packages: any[];
    status: (status: boolean) => Promise<void>;
    importPackage: (item: ScriptInfo) => Promise<void>;
    importPackages: (items: ScriptInfo[]) => Promise<void>;
}

export const PackageContext = createContext<PackageContextType>({
    packages: [],
    status: (status: boolean) => Promise.resolve(),
    importPackage: (item: ScriptInfo) => Promise.resolve(),
    importPackages: (items: ScriptInfo[]) => Promise.resolve(),
});