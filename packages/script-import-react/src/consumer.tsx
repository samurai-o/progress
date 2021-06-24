import React, { useContext } from 'react';
import { isFunc } from "@frade-sam/samtools";
import { PackageContext, PackageContextType } from './packageContext';

export type PackageConsumerProps = {
    children: (context: PackageContextType) => JSX.Element;
}


/**
 * package上下文
 * @param props 
 * @returns 
 */
export function PackageConsumer(props: PackageConsumerProps) {
    const context = useContext(PackageContext);
    return isFunc(props.children) ? props.children(context) : null;
}