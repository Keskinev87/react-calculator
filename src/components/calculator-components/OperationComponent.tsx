import React from 'react';
import { Operations } from '../Calculator';

interface OperationProps {
    id: Operations,
    class: string,
    value: string,
    onClick: (event: React.MouseEvent<HTMLElement>) => void,
}

function OperationComponent (props: OperationProps) {
    return (
        <div className={"operation " + props.class} id={props.id} onClick={props.onClick}><div className="operation-sign">{props.value}</div></div>
    )
}

export default OperationComponent;