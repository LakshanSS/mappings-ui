/* global window */
'use strict';
const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');
const Qs = require('qs');

class Actions {
    static getResults(data) {
        ApiActions.get(
            '/api/mappings',
            data,
            Store,
            Constants.GET_RESULTS,
            Constants.GET_RESULTS_RESPONSE
        );
    }

    static changeSearchQuery(data, history) {
        history.push({
            pathname: '/mappings',
            search: `?${Qs.stringify(data)}`
        });
        window.scrollTo(0, 0);
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
            '/api/mappings',
            data,
            Store,
            Constants.CREATE_NEW,
            Constants.CREATE_NEW_RESPONSE,
            (err, response) => {
                if (!err) {
                    this.hideCreateNew();
                    const path = `/mappings/edit/${response._id.template}/${response._id.lang}`;
                    history.push(path);
                    window.scrollTo(0, 0);
                }
            }
        );
    }
}
module.exports = Actions;
