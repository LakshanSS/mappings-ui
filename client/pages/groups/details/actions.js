/* global window */
'use strict';
const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');

class Actions {
    static getDetails(id) {
        ApiActions.get(
            `/api/account-groups/${id}`,
            undefined,
            Store,
            Constants.GET_DETAILS,
            Constants.GET_DETAILS_RESPONSE
        );
    }

    static saveDetails(id, data) {
        ApiActions.put(
            `/api/account-groups/${id}`,
            data,
            Store,
            Constants.SAVE_DETAILS,
            Constants.SAVE_DETAILS_RESPONSE
        );
    }

    static hideDetailsSaveSuccess() {
        Store.dispatch({
            type: Constants.HIDE_DETAILS_SAVE_SUCCESS
        });
    }

    static savePermissions(id, data) {
        ApiActions.put(
            `/api/account-groups/${id}/permissions`,
            data,
            Store,
            Constants.SAVE_PERMISSIONS,
            Constants.SAVE_PERMISSIONS_RESPONSE
        );
    }

    static hidePermissionsSaveSuccess() {
        Store.dispatch({
            type: Constants.HIDE_PERMISSIONS_SAVE_SUCCESS
        });
    }

    static delete(id, history) {
        ApiActions.delete(
            `/api/account-groups/${id}`,
            undefined,
            Store,
            Constants.DELETE,
            Constants.DELETE_RESPONSE,
            (err, response) => {

                if (!err) {
                    history.push('/groups');

                    window.scrollTo(0, 0);
                }
            }
        );
    }
}
module.exports = Actions;
