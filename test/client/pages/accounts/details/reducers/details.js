'use strict';
const Code = require('code');
const Constants = require('../../../../../../client/pages/accounts/details/constants');
const Lab = require('lab');
const Store = require('../../../../../../client/pages/accounts/details/store');


const lab = exports.lab = Lab.script();


lab.experiment('Admin Accounts Details Reducer', () => {

    lab.test('it handles a GET_DETAILS action', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS
        });

        const state = Store.getState().details;

        Code.expect(state.loading).to.be.true();
        Code.expect(state.hydrated).to.be.false();

        done();
    });


    lab.test('it handles a GET_DETAILS_RESPONSE action (success)', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: null,
            response: {
                name: {}
            }
        });

        const state = Store.getState().details;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.hydrated).to.be.true();

        done();
    });


    lab.test('it handles a GET_DETAILS_RESPONSE action (error)', (done) => {

        Store.dispatch({
            type: Constants.GET_DETAILS_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'something else failed'
            }
        });

        const state = Store.getState().details;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.showFetchFailure).to.be.true();
        Code.expect(state.error).to.equal('something else failed');

        done();
    });


    lab.test('it handles a SAVE_DETAILS action', (done) => {

        Store.dispatch({
            type: Constants.SAVE_DETAILS,
            request: {
                data: {
                    name: {
                        first: 'Ren',
                        middle: '',
                        last: 'Hoek'
                    },
                    email: 'mail@mail.com',
                    username: 'renhoek'
                }
            }
        });

        const state = Store.getState().details;

        Code.expect(state.loading).to.be.true();
        Code.expect(state.name.first).to.equal('Ren');
        Code.expect(state.name.middle).to.equal('');
        Code.expect(state.name.last).to.equal('Hoek');
        Code.expect(state.email).to.equal('mail@mail.com');
        Code.expect(state.username).to.equal('renhoek');

        done();
    });


    lab.test('it handles a SAVE_DETAILS_RESPONSE action (success)', (done) => {

        Store.dispatch({
            type: Constants.SAVE_DETAILS_RESPONSE,
            err: null,
            response: {
                name: {
                    first: 'Ren',
                    middle: '',
                    last: 'Hoek'
                },
                email: 'mail@mail.com',
                username: 'renhoek'
            }
        });

        const state = Store.getState().details;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.name.first).to.equal('Ren');
        Code.expect(state.name.middle).to.equal('');
        Code.expect(state.name.last).to.equal('Hoek');
        Code.expect(state.email).to.equal('mail@mail.com');
        Code.expect(state.username).to.equal('renhoek');

        done();
    });


    lab.test('it handles a SAVE_DETAILS_RESPONSE action (failure)', (done) => {

        Store.dispatch({
            type: Constants.SAVE_DETAILS_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'something else failed'
            }
        });

        const state = Store.getState().details;

        Code.expect(state.loading).to.be.false();
        Code.expect(state.error).to.equal('something else failed');

        done();
    });


    lab.test('it handles a CHANGE_ACTIVE action', (done) => {

        Store.dispatch({
            type: Constants.CHANGE_ACTIVE,
            request: {
                data: {
                    isActive: false
                }
            }
        });

        const state = Store.getState().details;

        Code.expect(state.activeChangeLoading).to.be.true();
        Code.expect(state.isActive).to.equal(false);

        done();
    });

    lab.test('it handles a CHANGE_ACTIVE_RESPONSE action (success)', (done) => {

        Store.dispatch({
            type: Constants.CHANGE_ACTIVE_RESPONSE,
            err: null,
            response: {
                isActive:false
            }
        });

        const state = Store.getState().details;

        Code.expect(state.activeChangeLoading).to.be.false();
        Code.expect(state.isActive).to.equal(false);

        done();
    });


    lab.test('it handles a CHANGE_ACTIVE_RESPONSE action (failure)', (done) => {

        Store.dispatch({
            type: Constants.CHANGE_ACTIVE_RESPONSE,
            err: new Error('sorry pal'),
            response: {
                message: 'something else failed'
            }
        });

        const state = Store.getState().details;

        Code.expect(state.activeChangeLoading).to.be.false();
        Code.expect(state.error).to.equal('something else failed');

        done();
    });

    lab.test('it handles a HIDE_DETAILS_SAVE_SUCCESS action', (done) => {

        Store.dispatch({
            type: Constants.HIDE_DETAILS_SAVE_SUCCESS
        });

        const state = Store.getState().details;

        Code.expect(state.showSaveSuccess).to.be.false();

        done();
    });
});
