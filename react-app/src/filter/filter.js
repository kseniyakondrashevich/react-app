/**
 * Created by User on 12.06.2017.
 */

import $ from "jquery";
import React, { Component } from 'react';
import './filter.css';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import { Dropdown } from 'semantic-ui-react';
import { Input } from 'semantic-ui-react';
import { Form, Checkbox } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react'


class BrandSelect extends Component{
    constructor(props){
        super(props);
        this.state = {brands: []};

        this.selectBrand = this.selectBrand.bind(this);
    }

    componentDidMount(){
        this.getLoadingBrands();
    }

    getLoadingBrands(){
        let brandArray =[];
        $.get('/brand')
            .done(function (data) {
                data.map(element =>{
                    brandArray.push(element.brand);
                });
                this.setState({
                    brands: brandArray
                });
            }.bind(this));
    }

    selectBrand(e, data){
        if(data.value === 'Не выбрано'){
            this.props.changeFlag("disabled");
            this.props.changeSelectedBrand(undefined);
            this.props.change({[data.name]: ''});
        }
        else {
            this.props.changeFlag("");
            this.props.changeSelectedBrand(data.value);
            this.props.change({[data.name]: data.value});
        }
    }

    render(){
        let options = [{key: 'Не выбрано', text: 'Не выбрано', value: 'Не выбрано'}]
            .concat(this.state.brands.map(brand => {
                return {key: brand, text: brand, value: brand};
            }));
        return(
            <Dropdown
                id="brand-select"
                name="brand"
                placeholder='Марка автомобиля'
                search
                selection
                options={options}
                onChange={this.selectBrand}
            />
        )
    }
}

class ModelSelect extends Component{
    constructor(props){
        super(props);
        this.state = {models: []};
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount(){
        this.getLoadingModels(this.props.selectedBrand);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            models: nextProps.filteredModels
        })
    }

    getLoadingModels(selectedBrand){
        let modelArray = [];
        $.get('/model', {brand: selectedBrand})
            .done(function (data) {
                data.map(element =>{
                    modelArray.push(element.model);
                });
                this.setState({
                    models: modelArray
                });
            }.bind(this));
    }

    onChange(e, data){
        this.props.change({[data.name]: data.value});
    }

    render(){
        let options = [{key: 'Не выбрано', text: 'Не выбрано', value: 'Не выбрано'}]
            .concat(this.state.models.map(model => {
                return {key: model, text: model, value: model};
            }));
        return(
            <Dropdown
                placeholder='Модель автомобиля'
                id="model-select"
                name="model"
                search
                selection
                options={options}
                onChange={this.onChange}
            />
        )
    }
}

class Selection extends Component{
    constructor(props) {
        super(props);
        this.state = {selectedBrand: undefined, flag: "disabled", filteredModels: []};

        this.changeFlag = this.changeFlag.bind(this);
        this.changeSelectedBrand = this.changeSelectedBrand.bind(this);
        this.filterModel = this.filterModel.bind(this);
    }

    filterModel(selectedBrand){
        let modelArray = [];
        $.get('/model', {brand: selectedBrand})
            .done(function (data) {
                data.map(element =>{
                    modelArray.push(element.model);
                });
                this.setState({
                    filteredModels: modelArray
                });
            }.bind(this));
    }

    changeFlag(newFlag){
        this.setState({
            flag: newFlag
        })
    }

    changeSelectedBrand(newSelectedBrand){
        this.setState({
            selectedBrand: newSelectedBrand
        });
        this.filterModel(newSelectedBrand);
    }

    render(){
        return(
            <div>
                <div className="form-group">
                    <BrandSelect
                        changeFlag={this.changeFlag}
                        changeSelectedBrand={this.changeSelectedBrand}
                        change={this.props.changeBrand}
                    />
                </div>
                <div className="form-group">
                    <ModelSelect
                        flag={this.state.flag}
                        selectedBrand={this.state.selectedBrand}
                        change={this.props.changeModel}
                        filteredModels={this.state.filteredModels}
                    />
                </div>
            </div>
        )
    }
}

class NumberInput extends Component{
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(e){
        this.props.change({[e.target.name]: e.target.value});
    }

    render(){
        return(
            <Input
                name={this.props.name}
                placeholder={this.props.label}
                type="number"
                onChange={this.onChange}
            />
        )
    }
}

class Radio extends Component{
    constructor(props){
        super(props);

        this.onCheck = this.onCheck.bind(this);
    }

    onCheck(e){
        this.props.change({[e.target.name]: e.target.value});
    }

    render(){
        return(
            <RadioButtonGroup name={this.props.name} onChange={this.onCheck}>
                <RadioButton
                    value={this.props.value[0]}
                    label={this.props.value[0]}
                />
                <RadioButton
                    value={this.props.value[1]}
                    label={this.props.value[1]}
                />
                <RadioButton
                    value={this.props.value[2]}
                    label={this.props.value[2]}
                />
            </RadioButtonGroup>
        )
    }
}

class FilterForm extends Component{
    render(){
        let fuelRadio = ["Бензин", "Дизель", "Не выбрано"];
        let transmissionRadio = ["Механика", "Автомат", "Не выбрано"];
        return(
            <form>
                <fieldset>
                    <legend>Параметры автомобиля</legend>

                    <div className="form-group">
                        <Selection
                            changeBrand={this.props.changeForm}
                            changeModel={this.props.changeForm}
                        />
                    </div>

                    <div className="form-group">
                        <label>Год выпуска
                            <NumberInput
                                name="yearFrom"
                                label="С"
                                change={this.props.changeForm}
                            />
                            <NumberInput
                                name="yearTo"
                                label="По"
                                change={this.props.changeForm}
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Цена, BYN
                            <NumberInput
                                name="costFrom"
                                label="От"
                                change={this.props.changeForm}
                            />
                            <NumberInput
                                name="costTo"
                                label="До"
                                change={this.props.changeForm}
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Объем двигателя
                            <NumberInput
                                name="volumeFrom"
                                label="От"
                                change={this.props.changeForm}
                            />
                            <NumberInput
                                name="volumeTo"
                                label="До"
                                change={this.props.changeForm}
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Тип топлива
                            <Radio
                                name="typeOfFuel"
                                value={fuelRadio}
                                change={this.props.changeForm}
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Тип трансмиссии
                            <Radio
                                name="transmission"
                                value={transmissionRadio}
                                change={this.props.changeForm}
                            />
                        </label>
                    </div>

                    <Button secondary onClick={this.props.onClick}>Применить фильтр</Button>

                </fieldset>
            </form>
        )
    }
}

class FilterPage extends Component{
    constructor(props){
        super(props);

        this.changeForm = this.changeForm.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e){
        e.preventDefault();
        alert(JSON.stringify(this.state));
    }

    changeForm(obj){
        for(let key in obj){
            this.setState({
                [key] : obj[key]
            })
        }
    }

    render(){
        return(
            <FilterForm
                changeForm = {this.changeForm}
                onClick = {this.onClick}
            />
        )
    }
}

export default FilterPage;