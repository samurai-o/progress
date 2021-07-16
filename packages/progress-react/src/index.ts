import React, { FunctionComponent } from "react";
import ReactDOM from "react-dom";
import { ProgressCore } from '@frade-sam/progress-core';
import { LoadingContainer, ProgressLoading } from './loading';
export class Progress extends ProgressCore {
    constructor() {
        super();
        this.init();
    }
    private assetsLoading: LoadingContainer | undefined;
    private progressLoading: ProgressLoading | undefined;
    static Loading: FunctionComponent<{ loading: boolean }>;
    static Progress: FunctionComponent<{ loading: boolean }>;

    private init = () => {
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

        progressLoading = document.createElement('div');
        progressLoading.id = 'progressloading';
        progressLoading.style.setProperty('width', '100vw');
        progressLoading.style.setProperty('position', 'absolute');
        progressLoading.style.setProperty('top', '0px');
        progressLoading.style.setProperty('z-index', '10000');
        progressLoading.style.setProperty('pointer-events', 'none');
        this.assetsLoading = ReactDOM.render(React.createElement(LoadingContainer, {
            children: Progress.Loading ? React.createElement(Progress.Loading) : null
        }), assetsloading);
        this.progressLoading = ReactDOM.render(React.createElement(ProgressLoading, {
            children: Progress.Progress ? React.createElement(Progress.Progress) : null
        }), progressLoading);
        document.body.appendChild(assetsloading);
        document.body.appendChild(progressLoading);
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
        })
    }

    public loading() {

    }
}