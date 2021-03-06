/* global window */
'use strict';
const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');

class Actions {
    static getDetails(id) {
        ApiActions.get(
            `/api/accounts/${id}`,
            undefined,
            Store,
            Constants.GET_DETAILS,
            Constants.GET_DETAILS_RESPONSE
        );
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

    static getStatusOptions() {
        const query = {
            pivot: 'Account',
            limit: 99
        };
        ApiActions.get(
            '/api/statuses',
            query,
            Store,
            Constants.GET_STATUS_OPTIONS,
            Constants.GET_STATUS_OPTIONS_RESPONSE
        );
    }

    static saveDetails(id, data) {
        ApiActions.put(
            `/api/accounts/${id}`,
            data,
            Store,
            Constants.SAVE_DETAILS,
            Constants.SAVE_DETAILS_RESPONSE
        );
    }

    static changeActive(id, data) {
        ApiActions.put(
            `/api/accounts/${id}/active`,
            data,
            Store,
            Constants.CHANGE_ACTIVE,
            Constants.CHANGE_ACTIVE_RESPONSE
        );
    }

    static hideDetailsSaveSuccess() {
        Store.dispatch({
            type: Constants.HIDE_DETAILS_SAVE_SUCCESS
        });
    }

    static linkUser(id, data) {
        ApiActions.put(
            `/api/accounts/${id}/user`,
            data,
            Store,
            Constants.LINK_USER,
            Constants.LINK_USER_RESPONSE
        );
    }

    static unlinkUser(id) {
        ApiActions.delete(
            `/api/accounts/${id}/user`,
            undefined,
            Store,
            Constants.UNLINK_USER,
            Constants.UNLINK_USER_RESPONSE
        );
    }

    static hideUserSaveSuccess() {
        Store.dispatch({
            type: Constants.HIDE_USER_SAVE_SUCCESS
        });
    }

    static saveGroups(id, data) {
        ApiActions.put(
            `/api/accounts/${id}/groups`,
            data,
            Store,
            Constants.SAVE_GROUPS,
            Constants.SAVE_GROUPS_RESPONSE
        );
    }

    static hideGroupsSaveSuccess() {
        Store.dispatch({
            type: Constants.HIDE_GROUPS_SAVE_SUCCESS
        });
    }

    static savePermissions(id, data) {
        ApiActions.put(
            `/api/accounts/${id}/permissions`,
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

    static newStatus(id, data) {
        if (data.status === data.current.id) {
            return Store.dispatch({
                type: Constants.NEW_STATUS_RESPONSE,
                err: new Error('same status'),
                response: {
                    message: 'That is the current status.'
                }
            });
        }

        delete data.current;
        ApiActions.post(
            `/api/accounts/${id}/status`,
            data,
            Store,
            Constants.NEW_STATUS,
            Constants.NEW_STATUS_RESPONSE
        );
    }

    static hideStatusSaveSuccess() {
        Store.dispatch({
            type: Constants.HIDE_STATUS_SAVE_SUCCESS
        });
    }

    static savePassword(id, data) {
        if (data.password !== data.passwordConfirm) {
            return Store.dispatch({
                type: Constants.SAVE_PASSWORD_RESPONSE,
                err: new Error('password mismatch'),
                response: {
                    message: 'Passwords do not match.'
                }
            });
        }

        delete data.passwordConfirm;

        ApiActions.put(
            `/api/accounts/${id}/password`,
            data,
            Store,
            Constants.SAVE_PASSWORD,
            Constants.SAVE_PASSWORD_RESPONSE
        );
    }

    static hidePasswordSaveSuccess() {
        Store.dispatch({
            type: Constants.HIDE_PASSWORD_SAVE_SUCCESS
        });
    }

    static newNote(id, newNote) {
        const data = {
            data: newNote
        };
        ApiActions.post(
            `/api/accounts/${id}/notes`,
            data,
            Store,
            Constants.NEW_NOTE,
            Constants.NEW_NOTE_RESPONSE
        );
    }

    static hideNoteSaveSuccess() {
        Store.dispatch({
            type: Constants.HIDE_NOTE_SAVE_SUCCESS
        });
    }

    static delete(id, history) {
        ApiActions.delete(
            `/api/accounts/${id}`,
            undefined,
            Store,
            Constants.DELETE,
            Constants.DELETE_RESPONSE,
            (err, response) => {

                if (!err) {
                    history.push('/accounts');

                    window.scrollTo(0, 0);
                }
            }
        );
    }
}
module.exports = Actions;
