import React from 'react';

interface ResultProps {
    value: number | '';
}

function ResultComponent (props: ResultProps) {
    return (
        <div className={"result-container"}>
            <span>{props.value}</span>
        </div>
    )
}

export default ResultComponent;