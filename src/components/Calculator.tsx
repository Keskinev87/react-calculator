import React from 'react';
import InputComponent from './calculator-components/InputComponent';
import OperationComponent from './calculator-components/OperationComponent';
import ResultComponent from './calculator-components/ResultComponent';
import Button from './calculator-components/Button';
import MemoryComponent from './calculator-components/MemoryComponent';
import ErrorMsgComponent from './calculator-components/ErrorMsgComponent';

export interface OperationRecord {
    [key: string] : number | Operations | string,
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
    input_1: number | '' | '-';
    input_2: number | '' | '-';
    operation: Operations;
    calculateResult: boolean,
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
    calculateResult: false,
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
        this.validateInput = this.validateInput.bind(this);
        this.calculateResult = this.calculateResult.bind(this);
        this.addToMemory = this.addToMemory.bind(this);
        this.loadRecordFromMemory = this.loadRecordFromMemory.bind(this);
    }

    componentDidMount() {
        console.log("Calculator mounted")
    }

    componentDidUpdate() {
        this.state.calculateResult && this.calculateResult();
    }

    handleInputChange(event: any) {
        let name: StateKeys = event.target && event.target.name;
        let value: any = event.target.value;
        console.log("The value is")
        console.log(event.target)
        this.validateInput(value) && this.setState((prevState) => ({
            ...prevState,
            [name]: value,
            saveActive: false,
            calculateResult: name === "input_2" && value !== '-' ? true : false
        }))

        !this.validateInput(value) && this.setState((prevState) => ({
            ...prevState,
            isError: true,
            error: "Only numerical values are alowed!"
        }))
    }

    handleOperationChange(event: any) {
        let value: Operations = event.target.id;
        this.setState((prevState) => ({
            ...prevState,
            operation: value
        }))
    }

    validateInput(input: any) {
        let inputIsValid = true;
        if(input !== '' && input !== '-' && isNaN(input))
            inputIsValid = false;
        console.log("Validation is done")
        console.log(inputIsValid);
        console.log(input)
        return inputIsValid;
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

    compareMemoryRecords(currentRecord: OperationRecord | undefined, lastRecord: OperationRecord | undefined) {

        let different = false;
        
        currentRecord && lastRecord === undefined ? different = true : different = false;
        currentRecord && lastRecord && Object.keys(currentRecord).forEach((key: string) => {
            if(key !== 'index' && currentRecord[key] !== lastRecord[key])
                different = true;
        })

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
        let input_1: any = this.state.input_1;
        let input_2: any = this.state.input_2;
        let result: number | '' = '';
        let sign: string = '+';
        
        if(operation === Operations.division && Number(input_2) === 0) {
            console.log("input 2 is 0")
            this.setState((prevState) => ({
                ...prevState,
                result: '',
                calculateResult: false,
                isError: true,
                error: "You cannot divide by 0"
            }))
        } else {
            switch (operation) {
                case Operations.addition:
                    result = Number(input_1) + Number(input_2);
                    break;
                case Operations.subtraction:
                    result = Number(input_1) - Number(input_2);
                    sign = '-';
                    break;
                case Operations.multiplication:
                    result = Number(input_1) * Number(input_2);
                    sign = 'X';
                    break;
                case Operations.division:
                    result = Number(input_1) / Number(input_2);
                    sign = "/";
                    break;
                default:
                    result = Number(input_1) + Number(input_2);
                    break;
            }

            console.log("Result is correct")
            let lastRecord = this.state.memory[this.state.memory.length - 1];
            let currentRecord: OperationRecord = {
                index: (lastRecord && lastRecord.index + 1) || 0,
                input_1: input_1,
                input_2: input_2,
                sign: sign,
                result: result,
                operation: this.state.operation
            }
            
            let activateSaveButton = this.compareMemoryRecords(currentRecord, lastRecord);

            this.setState((prevState) => ({
                ...prevState,
                result: result,
                calculateResult: false,
                currentOperationRecord: currentRecord,
                saveActive: activateSaveButton,
                isError: false,
                error: ""
            }));
            
        }
        
    }
    
    render() {
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