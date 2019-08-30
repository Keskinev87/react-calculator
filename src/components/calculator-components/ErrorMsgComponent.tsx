import React from 'react';

interface ErrorProps {
    text: string,
}

function ErrorMsgComponent (props: ErrorProps) {
    return (
        <p className="error-msg">{props.text}</p>
    )
}

export default ErrorMsgComponent;