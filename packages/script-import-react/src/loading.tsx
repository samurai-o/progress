import React from 'react';
import styled from 'styled-components';
import classname from 'classnames';

console.log(styled.div, styled.default);
const Container = styled.div<Pick<ImportLoadingState, "open">>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    &.open {

    }
    &.close {

    }
`;

export type ImportLoadingProps = {
    children?: JSX.Element;
}

export type ImportLoadingState = {
    open: boolean;
}

/**
 * 包加载loading
 */
export class ImportLoading extends React.Component<ImportLoadingProps, ImportLoadingState> {
    constructor(props: ImportLoadingProps) {
        super(props);
        this.open = this.open.bind(this);
        this.state = {
            open: false, // 开启状态
        }
    }
    open() {
        this.setState({ open: true });

    }
    render() {
        const { open } = this.state;
        return (
            <Container className={classname({ open, close: !open })}>{this.props.children}</Container>
        );
    }
}