'use strict';
const Actions = require('./actions');
const DeleteForm = require('../components/delete-form.jsx');
const DetailsForm = require('./details-form.jsx');
const PermissionsForm = require('./permissions-form.jsx');
const PropTypes = require('prop-types');
const React = require('react');
const ReactRouter = require('react-router-dom');
const Store = require('./store');


const Link = ReactRouter.Link;
const propTypes = {
    history: PropTypes.object,
    match: PropTypes.object
};


class DetailsPage extends React.Component {
    constructor(props) {

        super(props);

        Actions.getDetails(this.props.match.params.id);

        this.state = Store.getState();
    }

    componentDidMount() {

        this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));
    }

    componentWillUnmount() {

        this.unsubscribeStore();
    }

    onStoreChange() {

        this.setState(Store.getState());
    }

    render() {

        if (!this.state.details.hydrated) {
            return (
                <section className="container">
                    <h1 className="page-header">
                        <Link to="/groups">Groups</Link> / loading...
                    </h1>
                </section>
            );
        }

        if (this.state.details.showFetchFailure) {
            return (
                <section className="container">
                    <h1 className="page-header">
                        <Link to="/groups">Groups</Link> / Error
                    </h1>
                    <div className="alert alert-danger">
                        {this.state.details.error}
                    </div>
                </section>
            );
        }

        const id = this.state.details._id;
        const name = this.state.details.name;

        return (
            <section className="container">
                <h1 className="page-header">
                    <Link to="/groups">Groups</Link> / {name}
                </h1>
                <div className="row">
                    <div className="col-sm-8">
                        <DetailsForm {...this.state.details} />
                        <PermissionsForm {...this.state.permissions} />
                        <DeleteForm
                            {...this.state.delete}
                            action={Actions.delete.bind(Actions, id, this.props.history)}
                        />
                    </div>
                </div>
            </section>
        );
    }
}

DetailsPage.propTypes = propTypes;


module.exports = DetailsPage;