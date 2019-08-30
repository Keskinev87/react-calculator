import React from 'react';

interface ButtonProps {
    name: string,
    class: string,
    onClick: (event: React.MouseEvent<HTMLElement>) => void,
}

function Button (props: ButtonProps) {
    return (
        <button className={props.class} onClick={props.onClick}>{props.name}</button>
    )
}

export default Button;