import React from 'react';
import { OperationRecord } from '../Calculator';


interface MemoryProps {
    memoryRecords: Array<OperationRecord>,
    onClick: (event: React.MouseEvent<HTMLElement>) => void
}

function MemoryComponent (props: MemoryProps) {
    
    return (
        <div className="memory-container">
            <h2>Memory:</h2>
            <div className="memory-list-container">
                <ul className="memory-list">
                {(props.memoryRecords).map(record => (
                    <li key={record.index} onClick={props.onClick} id={record.index.toString()}>{`${record.index}) ${record.input_1} ${record.sign} ${record.input_2} = ${record.result}`}</li>
                ))}
                </ul>
            </div>
        </div>
    )
}

export default MemoryComponent;