import React from 'react';
import InputComponent from './calculator-components/InputComponent';
import OperationComponent from './calculator-components/OperationComponent';
import ResultComponent from './calculator-components/ResultComponent';
import Button from './calculator-components/Button';
import MemoryComponent from './calculator-components/MemoryComponent';
import ErrorMsgComponent from './calculator-components/ErrorMsgComponent';

export interface OperationRecord {
    index: number;
    input_1: number;
    input_2: number;
    operation: Operations;
    sign: string;
    result: number;
}

export enum Operations {
    addition = "addition",
    subtraction = "subtraction",
    multiplication = "multiplication",
    division = "division"
}

interface CalculatorState {
    input_1: number | '';
    input_2: number | '';
    operation: Operations;
    result: number | '';
    currentOperationRecord: OperationRecord | undefined,
    saveActive: boolean,
    memory: Array<OperationRecord>;
    isError: boolean;
    error: string;
}

const initialState: CalculatorState = {
    input_1: '',
    input_2: '',
    operation: Operations.addition,
    result: '',
    currentOperationRecord: undefined,
    saveActive: false,
    memory: [],
    isError: false,
    error: ''
}

type StateKeys = keyof CalculatorState;


class Calculator extends React.Component<{}, CalculatorState> {
    constructor(props:{} ={}) {
        super(props);
        this.state = initialState;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOperationChange = this.handleOperationChange.bind(this);
        this.validateInputs = this.validateInputs.bind(this);
        this.calculateResult = this.calculateResult.bind(this);
        this.addToMemory = this.addToMemory.bind(this);
        this.loadRecordFromMemory = this.loadRecordFromMemory.bind(this);
    }

    handleInputChange(event: any) {
        let name: StateKeys = event.target && event.target.name;
        let value: number = Number(event.target.value);
        this.setState((prevState) => ({
            ...prevState,
            [name]: value,
        }), () => {
            name === 'input_2' && this.calculateResult();
        });
    }

    handleOperationChange(event: any) {
        let value: Operations = event.target.id;
        this.setState((prevState) => ({
            ...prevState,
            operation: value
        }))
    }

    validateInputs(input_1: any = this.state.input_1, input_2: any = this.state.input_2) {
        let inputsAreValid = true;
        if(input_1 === '' || input_2 === '')
            inputsAreValid = false;
        if(isNaN(input_1) || isNaN(input_2))
            inputsAreValid = false;
        console.log("Validation is done")
        console.log(inputsAreValid);
        return inputsAreValid;
    }

    addToMemory() {
        
        if(this.state.currentOperationRecord && this.state.saveActive && this.compareMemoryRecords(this.state.currentOperationRecord, this.state.memory[this.state.memory.length - 1])) {
            let newMemory = this.state.memory.concat(this.state.currentOperationRecord);
            this.setState((prevState) => ({
                ...prevState,
                memory: newMemory,
                saveActive: false
            }))
        } else {
            this.setState((prevState) => ({
                ...prevState,
                saveActive: false
            }));
        }

    }

    compareMemoryRecords(record_1: OperationRecord | undefined, record_2: OperationRecord | undefined) {

        let different = true;

        if(record_1 && record_2 && record_1.input_1 === record_2.input_1 && record_1.input_2 === record_2.input_2 && record_1.result === record_2.result && record_1.sign === record_2.sign)
            different = false;

        return different;
    }

    loadRecordFromMemory(event: any) {

        let recordIndex: number | undefined = Number(event.target.id);
        let chosenRecord = this.state.memory[recordIndex];
        if(chosenRecord) {
            this.setState((prevState) => ({
                ...prevState,
                input_1: chosenRecord.input_1,
                input_2: chosenRecord.input_2,
                operation: chosenRecord.operation,
                result: chosenRecord.result,
                saveActive: false
            }))
        }

    }

    calculateResult() {

        let operation: Operations = this.state.operation;
        let input_1: number | '' = this.state.input_1;
        let input_2: number | '' = this.state.input_2;
        let result: number | '' = this.state.result;
        let sign: string = '+';
        
        if(this.state.input_1 && this.state.input_2 && this.validateInputs()) {
            switch (operation) {
                case Operations.addition:
                    result = (input_1 && input_2) && input_1 + input_2;
                    break;
                case Operations.subtraction:
                    result = (input_1 && input_2) && input_1 - input_2;
                    sign = '-';
                    break;
                case Operations.multiplication:
                    result = (input_1 && input_2) && input_1 * input_2;
                    sign = 'X';
                    break;
                case Operations.division:
                    if(Number(input_2) === 0) {
                        this.setState((prevState) => ({
                            ...prevState,
                            result: '',
                            isError: true,
                            error: "You cannot divide by 0"
                        }))
                        break;
                    } else {
                        result = (input_1 && input_2) && input_1 / input_2;
                        sign = "/";
                        break;
                    }
                default:
                    result = (input_1 && input_2) && input_1 + input_2;
                    break;
            }

            if(result) {
                let lastRecord = this.state.memory[this.state.memory.length - 1];
                let currentRecord: OperationRecord = {
                    index: (lastRecord && lastRecord.index + 1) || 0,
                    input_1: this.state.input_1,
                    input_2: this.state.input_2,
                    sign: sign,
                    result: result,
                    operation: this.state.operation
                }
                
                let activateSaveButton = this.compareMemoryRecords(lastRecord, currentRecord);
    
                this.setState((prevState) => ({
                    ...prevState,
                    result: result,
                    currentOperationRecord: currentRecord,
                    saveActive: activateSaveButton,
                    isError: false,
                    error: ""
                }));
            }
            
        } else {
            this.setState((prevState) => ({
                ...prevState,
                isError: true,
                error: "Only numbers are allowed as inputs!"
            }))
        }
    }
    
    render() {
        console.log("Rendering")
        return (
            <div className="calculator-container">
                <InputComponent {...{type: 'number', name: 'input_1', value: this.state.input_1, onChange: this.handleInputChange}} />
                <div className="operations-container">
                    <OperationComponent {...{id: Operations.addition, class: this.state.operation === Operations.addition ? 'active' : '', value: '+', onClick: this.handleOperationChange}}/>
                    <OperationComponent {...{id: Operations.subtraction, class: this.state.operation === Operations.subtraction ? 'active' : '', value: '-', onClick: this.handleOperationChange}}/>
                    <OperationComponent {...{id: Operations.multiplication, class: this.state.operation === Operations.multiplication ? 'active' : '', value: 'X', onClick: this.handleOperationChange}}/>
                    <OperationComponent {...{id: Operations.division, class: this.state.operation === Operations.division ? 'active' : '', value: '/', onClick: this.handleOperationChange}}/>
                </div>
                <InputComponent {...{type: 'number', name: 'input_2', value: this.state.input_2, onChange: this.handleInputChange}} />
                <div className="equality-label-container"><div className="equality-label">=</div></div>
                <ResultComponent {...{value: this.state.result}}/>
                {this.state.isError && <ErrorMsgComponent {...{text: this.state.error}}/>}
                <Button {...{name: 'Save', class: this.state.saveActive ? "active" : "disabled",onClick: this.addToMemory}}/>
                <MemoryComponent {...{memoryRecords: this.state.memory, onClick: this.loadRecordFromMemory}}/>
            </div>
        )
    }
}

export default Calculator;