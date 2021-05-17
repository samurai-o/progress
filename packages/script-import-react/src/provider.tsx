import React, { useCallback, useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { isObject } from 'sam-tools';
import { ScriptInfo } from 'script-import-core';
import { ScriptManager } from 'script-import-core';
import { ImportLoading, ImportLoadingProps, ImportLoadingRef } from './loading';
import { PackageContext } from './packageContext';

export type PackageProviderProps = {
    children: JSX.Element | JSX.Element[];
    manager: ScriptManager;
}

export function PackageProvider(props: PackageProviderProps) {
    const { manager, children } = props;
    const loading = useRef<ImportLoadingRef>(null);
    const startEvent = useCallback((status: boolean) => {
        const oldEle = document.getElementById("dynamic-scipt-loading");
        // 当前并没有初始加载过loading
        if (!oldEle) {
            const node = React.createElement(ImportLoading, { ref: loading });
            const scriptLoading = document.createElement("div");
            document.body.append(scriptLoading);
            render(node, scriptLoading, () => {
                if (loading.current) loading.current.open();
            });
        } else {
            if (loading.current) loading.current.open();
        }
    }, [loading.current]);
    const endEvent = useCallback((status: boolean) => {
        if (loading.current) {
            loading.current.close();
        }
    }, [loading.current]);

    manager.monitor("end", endEvent);
    // 资源开始加载时候执行, 未加载完时后续推入的状态不做执行
    manager.monitor("start", startEvent);

    /**
     * 单个加载
     * @param item 
     */
    const importPackage = async (item: ScriptInfo) => {
        await manager.import(item);
    }

    /**
     * 批量加载
     * @param items 
     */
    const importPackages = async (items: ScriptInfo[]) => {
        await manager.imports(items);
    }

    return (
        <PackageContext.Provider value={{
            packages: [],
            importPackage,
            importPackages,
        }}>
            {children}
        </PackageContext.Provider>
    );
}