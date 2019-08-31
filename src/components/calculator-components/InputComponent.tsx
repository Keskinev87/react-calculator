import React from 'react';

interface InputProps {
    type: string,
    name: string,
    value: number | '' | '-',
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

function InputComponent (props: InputProps) {
    return (
        <input className="number-input" type="text" name={props.name} onChange={props.onChange} value={props.value}></input>
    )
}

export default InputComponent;