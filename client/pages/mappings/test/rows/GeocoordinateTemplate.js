/**
 * Created by ismaro3 on 24/07/17.
 * GeocoordinateTemplate
 */
'use strict';
const React = require('react');
const PropTypes = require('prop-types');
const ButtonGroup = require('../../../../components/button-group.jsx');
const propTypes = {
    onClose: PropTypes.func,
    childLevel: PropTypes.number
};

const name = 'GeocoordinateTemplate';
const required = ['ontologyProperty','coordinate'];

/**
 * Possible children: None.
 */
class RowGeocoordinateTemplate extends React.Component {


    //this.state.content has TemplateMapping content
    constructor(props){

        super(props);
        this.state = {
            content: {
                name,
                parameters: {
                    ontologyProperty: '',
                    coordinate: '',
                    latitude: '',
                    longitude: '',
                    latitudeDegrees: '',
                    latitudeMinutes: '',
                    latitudeSeconds: '',
                    latitudeDirection: '',
                    longitudeDegrees: '',
                    longitudeMinutes: '',
                    longitudeSeconds: '',
                    longitudeDirection: ''
                },
                _alias: 'Empty' //This attribute should be removed before POST
            },
            errors: {

            }

        };

        //In edit mode
        if (this.props.content) {
            this.state.content = this.props.content;
        }

    }


    /**
     * To handle inputs.
     */
    handleChange(attribute,event){

        let value = event.target.value;
        let content = {...this.state.content};
        content.parameters[attribute] = value;
        this.setState({content});

    }



    createAlias(){
        return name + ' (' + this.state.content.parameters.ontologyProperty + ')';
    }

    /**
     * Called when this mapping is closed.
     * Called by: this component.
     */
    onMeClose(save){

        const errors = {};
        let hasError = false;
        for(let i = 0; i < required.length ; i++){
            const field = this.state.content.parameters[required[i]];
            const fieldName = required[i];
            if (!field){
                errors[fieldName] = true;
                hasError = true;
            }
            if ((typeof field === 'string' || field instanceof Array) && field.trim().length === 0 ){
                errors[fieldName] = true;
                hasError = true;
            }
            if (Object.keys(field).length === 0 && field.constructor === Object){
                errors[fieldName] = true;
                hasError = true;
            }
        }

        if (save && hasError){
            this.setState({errors});
            return;
        }


        if (!save) {
            return window.confirm("Are you sure? Data can't be recovered.") && this.props.onClose(save,name,this.state.content);
        }

        let c = {...this.state.content};
        c._alias = this.createAlias();
        this.setState({ content:c }, () => {
            return this.props.onClose(save,name,this.state.content);
        });


    }


    render(){

        const buttons = [
            { type: 'btn-success',
                text: <span><i className="fa fa-check" aria-hidden="true"></i>&nbsp;Save</span>,
                action: this.onMeClose.bind(this,true),
                sizeClass: 'btn-sm'
            },
            { type: 'btn-danger',
                text: <span><i className="fa fa-times" aria-hidden="true"></i>&nbsp;Cancel</span>,
                action: this.onMeClose.bind(this,false),
                sizeClass: 'btn-sm'
            }
        ];


        return (

            <div style={ {marginLeft: this.props.childLevel*5 + 'px'}}>
                <div className={'templateEditRow panel panel-default ' + (this.state.hasChild ? 'disabled' : '')}>
                    <div className="panel-heading clearfix">
                        <h5 className="panel-title pull-left" style={{paddingTop: '7.5px'}}>Geocoordinate Template</h5>
                        <ButtonGroup float='right' buttons={buttons}  />
                    </div>
                    <div className="panel-body">
                        {Object.keys(this.state.errors).length > 0 &&
                        <div><span style={{color:"red"}}>Please, fill all the required fields (*)</span><br/><br/></div>}

                        <div className="row">

                            <div className="col-sm-6"> {/* Column of properties */}

                                <form className="form-horizontal" onSubmit={(event) => event.preventDefault()}>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="ontologyProperty">Ontology Property{required.indexOf('ontologyProperty') > -1 ? '*' : ''}</label>
                                        <div className="col-sm-10">
                                            <input type="text"
                                                   className={'form-control ' + (this.state.errors.ontologyProperty ? 'error' : '')}
                                                   id="ontologyProperty"
                                                   placeholder=''
                                                   value={this.state.content.parameters.ontologyProperty}
                                                   onChange={this.handleChange.bind(this,'ontologyProperty')}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="property">Coordinate{required.indexOf('coordinate') > -1 ? '*' : ''}</label>
                                        <div className="col-sm-10">
                                            <input type="text"
                                                   className={'form-control ' + (this.state.errors.coordinate ? 'error' : '')}
                                                   id="coordinate"
                                                   placeholder=''
                                                   value={this.state.content.parameters.coordinate}
                                                   onChange={this.handleChange.bind(this,'coordinate')}/>
                                        </div>
                                    </div>


                                </form>
                            </div>

                            <div className="col-sm-6"> {/* Column of mappings */}
                                <form className="form-horizontal" onSubmit={(event) => event.preventDefault()}>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="latitude">Latitude{required.indexOf('latitude') > -1 ? '*' : ''}</label>
                                        <div className="col-sm-10">
                                            <input type="text"
                                                   className={'form-control ' + (this.state.errors.latitude ? 'error' : '')}
                                                   id="latitude"
                                                   placeholder=''
                                                   value={this.state.content.parameters.latitude}
                                                   onChange={this.handleChange.bind(this,'latitude')}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="longitude">Longitude{required.indexOf('longitude') > -1 ? '*' : ''}</label>
                                        <div className="col-sm-10">
                                            <input type="text"
                                                   className={'form-control ' + (this.state.errors.longitude ? 'error' : '')}
                                                   id="longitude"
                                                   placeholder=''
                                                   value={this.state.content.parameters.longitude}
                                                   onChange={this.handleChange.bind(this,'longitude')}/>
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-sm-6">
                                <h4>Latitude</h4>
                                <form className="form-horizontal" onSubmit={(event) => event.preventDefault()}>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="latitudeDegrees">Degrees{required.indexOf('latitudeDegrees') > -1 ? '*' : ''}</label>
                                        <div className="col-sm-10">
                                            <input type="text"
                                                   className={'form-control ' + (this.state.errors.latitudeDegrees ? 'error' : '')}
                                                   id="latitudeDegrees"
                                                   placeholder=''
                                                   value={this.state.content.parameters.latitudeDegrees}
                                                   onChange={this.handleChange.bind(this,'latitudeDegrees')}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="latitudeMinutes">Minutes{required.indexOf('latitudeMinutes') > -1 ? '*' : ''}</label>
                                        <div className="col-sm-10">
                                            <input type="text"
                                                   className={'form-control ' + (this.state.errors.latitudeMinutes ? 'error' : '')}
                                                   id="latitudeMinutes"
                                                   placeholder=''
                                                   value={this.state.content.parameters.latitudeMinutes}
                                                   onChange={this.handleChange.bind(this,'latitudeMinutes')}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="latitudeSeconds">Seconds{required.indexOf('latitudeSeconds') > -1 ? '*' : ''}</label>
                                        <div className="col-sm-10">
                                            <input type="text"
                                                   className={'form-control ' + (this.state.errors.latitudeSeconds ? 'error' : '')}
                                                   id="latitudeSeconds"
                                                   placeholder=''
                                                   value={this.state.content.parameters.latitudeSeconds}
                                                   onChange={this.handleChange.bind(this,'latitudeSeconds')}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="latitudeDirection">Direction{required.indexOf('latitudeDirection') > -1 ? '*' : ''}</label>
                                        <div className="col-sm-10">
                                            <input type="text"
                                                   className={'form-control ' + (this.state.errors.latitudeDirection ? 'error' : '')}
                                                   id="latitudeDirection"
                                                   placeholder=''
                                                   value={this.state.content.parameters.latitudeDirection}
                                                   onChange={this.handleChange.bind(this,'latitudeDirection')}/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-sm-6">
                                <h4>Longitude</h4>
                                <form className="form-horizontal" onSubmit={(event) => event.preventDefault()}>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="longitudeDegrees">Degrees{required.indexOf('longitudeDegrees') > -1 ? '*' : ''}</label>
                                        <div className="col-sm-10">
                                            <input type="text"
                                                   className={'form-control ' + (this.state.errors.longitudeDegrees ? 'error' : '')}
                                                   id="longitudeDegrees"
                                                   placeholder=''
                                                   value={this.state.content.parameters.longitudeDegrees}
                                                   onChange={this.handleChange.bind(this,'longitudeDegrees')}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="longitudeMinutes">Minutes{required.indexOf('longitudeMinutes') > -1 ? '*' : ''}</label>
                                        <div className="col-sm-10">
                                            <input type="text"
                                                   className={'form-control ' + (this.state.errors.longitudeMinutes ? 'error' : '')}
                                                   id="longitudeMinutes"
                                                   placeholder=''
                                                   value={this.state.content.parameters.longitudeMinutes}
                                                   onChange={this.handleChange.bind(this,'longitudeMinutes')}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="longitudeSeconds">Seconds{required.indexOf('longitudeSeconds') > -1 ? '*' : ''}</label>
                                        <div className="col-sm-10">
                                            <input type="text"
                                                   className={'form-control ' + (this.state.errors.longitudeSeconds ? 'error' : '')}
                                                   id="longitudeSeconds"
                                                   placeholder=''
                                                   value={this.state.content.parameters.longitudeSeconds}
                                                   onChange={this.handleChange.bind(this,'longitudeSeconds')}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label col-sm-2" htmlFor="longitudeDirection">Direction{required.indexOf('longitudeDirection') > -1 ? '*' : ''}</label>
                                        <div className="col-sm-10">
                                            <input type="text"
                                                   className={'form-control ' + (this.state.errors.longitudeDirection ? 'error' : '')}
                                                   id="longitudeDirection"
                                                   placeholder=''
                                                   value={this.state.content.parameters.longitudeDirection}
                                                   onChange={this.handleChange.bind(this,'longitudeDirection')}/>
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>


                    </div>
                </div>
            </div>


        );
    }


}

RowGeocoordinateTemplate.propTypes = propTypes;


module.exports = RowGeocoordinateTemplate;
