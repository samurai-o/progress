import React from 'react';
import { LoadingContainerStyled, ProgressLoadingStyled } from './loading.styled';

export type LoadingState = {
    loading?: boolean;
    count: number;
    number: number;
};

export class LoadingContainer extends React.Component<any, LoadingState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            count: 0,
            number: 0,
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
            count: 0,
            number: 0,
        }
    }

    status = (status: boolean): Promise<boolean> => {
        return new Promise((res) => {
            this.setState({ ...this.state, loading: status }, () => {
                res(status);
            });
        })
    }

    progress = (number: number, count: number) => {
        this.setState({ ...this.state, number, count })
    }

    render() {
        return (
            <ProgressLoadingStyled loading={this.state.loading}>
                {this.props.children ? React.cloneElement(this.props.children as JSX.Element, { ...this.state }) : null}
            </ProgressLoadingStyled>
        );
    }
}