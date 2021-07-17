import React, { FunctionComponent, ComponentClass } from "react";
import ReactDOM from "react-dom";
import { ProgressCore, TaskType } from '@frade-sam/progress-core';
import { LoadingContainer, ProgressLoading } from './loading';
export class Progress extends ProgressCore {
    constructor() {
        super();
    }
    private assetsLoading: LoadingContainer | undefined;
    private progressLoading: ProgressLoading | undefined;
    private Loading: FunctionComponent<{ loading: boolean; }> | ComponentClass<{ loading: boolean; }> | undefined;

    public init = () => {
        let assetsloading = document.getElementById('assetsloading');
        let progressLoading = document.getElementById('progressloading');
        if (assetsloading) assetsloading.remove();
        if (progressLoading) progressLoading.remove();
        /** loading创建 */
        assetsloading = document.createElement('div');
        assetsloading.id = 'assetsloading';
        assetsloading.style.setProperty('width', '100vw');
        assetsloading.style.setProperty('position', 'absolute');
        assetsloading.style.setProperty('top', '0px');
        assetsloading.style.setProperty('z-index', '10000');
        assetsloading.style.setProperty('pointer-events', 'none');

        this.assetsLoading = ReactDOM.render(React.createElement(LoadingContainer, {
            children: this.Loading ? React.createElement(this.Loading) : null
        }), assetsloading);
        document.body.appendChild(assetsloading);
        this.monitor('start', 'assets', (status) => {
            if (this.assetsLoading) this.assetsLoading.status(true);
        });
        this.monitor('start', 'fetch', (status) => {
            if (this.progressLoading) this.progressLoading.status(true);
        });
        this.monitor('end', 'fetch', (status) => {
            if (this.progressLoading) this.progressLoading.status(false);
        });
        this.monitor('end', 'assets', (status) => {
            if (this.assetsLoading) this.assetsLoading.status(false);
        });
    }

    public plugins = (type: TaskType, Component: FunctionComponent<{ loading: boolean; }> | ComponentClass<{ loading: boolean; }>) => {
        if (type === "assets") this.Loading = Component;
    }
}