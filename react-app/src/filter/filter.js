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
            this.props.change('');
        }
        else {
            this.props.changeFlag("");
            this.props.changeSelectedBrand(data.value);
            this.props.change(data.value);
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

    onChange(e){
        this.props.change(e.target.value);
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
        this.props.change(e.target.value);
    }

    render(){
        return(
            <Input
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
        this.props.change(e.target.value);
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
                            changeBrand={this.props.changeBrand}
                            changeModel={this.props.changeModel}
                        />
                    </div>

                    <div className="form-group">
                        <label>Год выпуска
                            <NumberInput
                                label="С"
                                change={this.props.changeYearFrom}
                            />
                            <NumberInput
                                label="По"
                                change={this.props.changeYearTo}
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Цена, BYN
                            <NumberInput
                                label="От"
                                change={this.props.changeCostFrom}
                            />
                            <NumberInput
                                label="До"
                                change={this.props.changeCostTo}
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Объем двигателя
                            <NumberInput
                                label="От"
                                change={this.props.changeVolumeFrom}
                            />
                            <NumberInput
                                label="До"
                                change={this.props.changeVolumeTo}
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Тип топлива
                            <Radio
                                name="typeOfFuel"
                                value={fuelRadio}
                                change={this.props.changeTypeOfFuel}
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Тип трансмиссии
                            <Radio
                                name="transmission"
                                value={transmissionRadio}
                                change={this.props.changeTransmission}
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
        this.state = {
            brand: '',
            model: '',
            yearFrom: '',
            yearTo: '',
            costFrom: '',
            costTo: '',
            volumeFrom: '',
            volumeTo: '',
            transmission: '',
            typeOfFuel: ''
        };

        this.changeBrand = this.changeBrand.bind(this);
        this.changeModel = this.changeModel.bind(this);
        this.changeYearFrom = this.changeYearFrom.bind(this);
        this.changeYearTo = this.changeYearTo.bind(this);
        this.changeCostFrom = this.changeCostFrom.bind(this);
        this.changeCostTo = this.changeCostTo.bind(this);
        this.changeVolumeFrom = this.changeVolumeFrom.bind(this);
        this.changeVolumeTo = this.changeVolumeTo.bind(this);
        this.changeTransmission = this.changeTransmission.bind(this);
        this.changeTypeOfFuel = this.changeTypeOfFuel.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e){
        e.preventDefault();
        alert(JSON.stringify(this.state));
    }

    changeForm(obj){
        for(let key in obj){
            this.setState({
                form : obj[key]
            })
        }
    }

    changeBrand(value){
        this.setState({
            brand : value
        })
    }

    changeModel(value){
        this.setState({
            model : value
        })
    }

    changeYearFrom(value){
        this.setState({
            yearFrom : value
        })
    }

    changeYearTo(value){
        this.setState({
            yearTo : value
        })
    }

    changeCostFrom(value){
        this.setState({
            costFrom : value
        })
    }

    changeCostTo(value){
        this.setState({
            costTo : value
        })
    }

    changeVolumeFrom(value){
        this.setState({
            volumeFrom : value
        })
    }

    changeVolumeTo(value){
        this.setState({
            volumeTo : value
        })
    }

    changeTypeOfFuel(value){
        this.setState({
            typeOfFuel : value
        });
    }

    changeTransmission(value){
        this.setState({
            transmission : value
        })
    }


    render(){
        return(
            <FilterForm
                changeBrand = {this.changeBrand}
                changeModel = {this.changeModel}
                changeYearFrom = {this.changeYearFrom}
                changeYearTo = {this.changeYearTo}
                changeCostFrom = {this.changeCostFrom}
                changeCostTo = {this.changeCostTo}
                changeVolumeFrom = {this.changeVolumeFrom}
                changeVolumeTo = {this.changeVolumeTo}
                changeTypeOfFuel = {this.changeTypeOfFuel}
                changeTransmission = {this.changeTransmission}
                onClick = {this.onClick}
            />
        )
    }
}

export default FilterPage;