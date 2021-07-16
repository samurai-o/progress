import styled from "styled-components";

export type LoadingContainerStyledProps = {
    loading?: boolean;
};


export const LoadingContainerStyled = styled.div<LoadingContainerStyledProps>`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease 0s;
  background: #fff;
  opacity: ${(props) => (props.loading ? '1' : '0')};
  pointer-events: ${(props) => (props.loading ? 'all' : 'none')};
`;

export const ProgressLoadingStyled = styled.div<LoadingContainerStyledProps>`
  width: 100vw;
  transition: all 0.3s ease 0s;
  background: #fff;
  opacity: ${(props) => (props.loading ? '1' : '0')};
  pointer-events: ${(props) => (props.loading ? 'all' : 'none')};
`;