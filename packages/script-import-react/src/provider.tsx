import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { isObject } from 'sam-tools';
import { ScriptInfo } from 'script-import-core';
import { ScriptManager } from 'script-import-core';
import { ImportLoading, ImportLoadingProps } from './loading';
import { PackageContext } from './packageContext';

export type PackageProviderProps = {
    children: JSX.Element | JSX.Element[];
    manager: ScriptManager;
}

export function PackageProvider(props: PackageProviderProps) {
    const [status, setStatus] = useState(false);
    const loading = useRef<React.CElement<ImportLoadingProps, ImportLoading>>(null);
    const { manager, children } = props;
    useEffect(() => {
        if (!isObject(manager)) return;
        // 所有资源加载完毕
        manager.monitor("end", (status) => {
            setStatus(status);
        });
        // 资源开始加载时候执行, 未加载完时后续推入的状态不做执行
        manager.monitor("start", (status) => {
            setStatus(status);
        })
    }, [manager]);

    useEffect(() => {
        if (status) {
            // 打开状态下显示加载loading
            if (!loading.current) {
                const node = React.createElement(ImportLoading);
                const scriptLoading = document.createElement("div");
                document.body.append(scriptLoading);
                //loading.current = node;
                console.log(node);
                render(node, scriptLoading);
            }
            // (loading.current as any).open();
        } else {
            // (loading.current as any).close();
        }
    }, [status, loading.current]);

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