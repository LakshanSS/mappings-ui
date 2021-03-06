/* global window */
'use strict';
const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');
const Qs = require('qs');

class Actions {
    static getResults(data) {
        ApiActions.get(
            '/api/accounts',
            data,
            Store,
            Constants.GET_RESULTS,
            Constants.GET_RESULTS_RESPONSE
        );
    }

    static changeSearchQuery(data, history) {
        history.push({
            pathname: '/accounts',
            search: `?${Qs.stringify(data)}`
        });

        window.scrollTo(0, 0);
    }

    static getGroupOptions() {
        ApiActions.get(
            '/api/account-groups?limit=0',
            undefined,
            Store,
            Constants.GET_GROUP_OPTIONS,
            Constants.GET_GROUP_OPTIONS_RESPONSE
        );
    }

    static showCreateNew() {
        Store.dispatch({
            type: Constants.SHOW_CREATE_NEW
        });
    }

    static hideCreateNew() {
        Store.dispatch({
            type: Constants.HIDE_CREATE_NEW
        });
    }

    static createNew(data, history) {
        ApiActions.post(
            '/api/accounts',
            data,
            Store,
            Constants.CREATE_NEW,
            Constants.CREATE_NEW_RESPONSE,
            (err, response) => {

                if (!err) {
                    this.hideCreateNew();

                    const path = `/accounts/${response._id}`;

                    history.push(path);

                    window.scrollTo(0, 0);
                }
            }
        );
    }
}
module.exports = Actions;
