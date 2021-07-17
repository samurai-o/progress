import React from 'react';
import { LoadingContainerStyled, ProgressLoadingStyled } from './loading.styled';

export type LoadingState = {
    loading?: boolean;
};

export class LoadingContainer extends React.Component<any, LoadingState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
        }
    }

    status = (status: boolean): Promise<boolean> => {
        return new Promise((res) => {
            this.setState({ loading: status }, () => {
                res(status);
            });
        })
    }

    render() {
        return (
            <LoadingContainerStyled loading={this.state.loading}>
                {this.props.children ? React.cloneElement(this.props.children as JSX.Element, { loading: this.state.loading }) : null}
            </LoadingContainerStyled>
        );
    }
}

export class ProgressLoading extends React.Component<any, LoadingState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
        }
    }

    status = (status: boolean): Promise<boolean> => {
        return new Promise((res) => {
            this.setState({ loading: status }, () => {
                res(status);
            });
        })
    }

    render() {
        return (
            <ProgressLoadingStyled loading={this.state.loading}>
                {this.props.children ? React.cloneElement(this.props.children as JSX.Element, { ...this.state }) : null}
            </ProgressLoadingStyled>
        );
    }
}