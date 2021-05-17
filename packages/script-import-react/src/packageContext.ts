import { createContext } from 'react';
import { ScriptInfo } from 'script-import-core';

export type PackageContextType = {
    packages: any[];
    importPackage: (item: ScriptInfo) => Promise<void>;
    importPackages: (items: ScriptInfo[]) => Promise<void>;
}

export const PackageContext = createContext({
    packages: [],
    importPackage: (item: ScriptInfo) => Promise.resolve(),
    importPackages: (items: ScriptInfo[]) => Promise.resolve(),
});