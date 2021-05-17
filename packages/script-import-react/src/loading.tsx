import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import styled, { StyledInterface } from 'styled-components';
import classname from 'classnames';
const css: StyledInterface = (styled as any).default;
const Container = css.div<Pick<ImportLoadingState, "open">>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;
    transition: all 1s ease;
    background: #fff;
    opacity: ${props => !!props.open ? 1 : 0};
    '&.open': {
        opacity: 1;
    },
    '&.close': {
        opacity: 0;
    }
`

export type ImportLoadingProps = {
    children?: JSX.Element;
}

export type ImportLoadingState = {
    open: boolean;
}

export type ImportLoadingRef = {
    open: () => void;
    close: () => void;
}

export const ImportLoading = forwardRef((props: ImportLoadingProps, ref) => {
    const [open, setOpen] = useState(false);
    const openHandler = useCallback(() => {
        setOpen(true);
    }, [open]);
    const closeHandler = useCallback(() => {
        setOpen(false);
    }, [open]);

    useImperativeHandle(ref, () => ({
        open: openHandler,
        close: closeHandler
    }))

    return (
        <Container id="dynamic-scipt-loading" open={open} className={classname({ open, close: !open })}>{props.children}</Container>
    );
})