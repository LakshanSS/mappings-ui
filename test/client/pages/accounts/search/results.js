'use strict';
const Code = require('code');
const Lab = require('lab');
const React = require('react');
const ReactRouter = require('react-router-dom');
const ReactTestUtils = require('react-dom/test-utils');
const Results = require('../../../../../client/pages/accounts/search/results.jsx');


const lab = exports.lab = Lab.script();
const MemoryRouter = ReactRouter.MemoryRouter;


lab.experiment('Accounts Search Results', () => {

    lab.test('it renders information', (done) => {

        const props = {
            data: [{
                _id: 'abcxyz',
                name: {
                    first: 'Ren',
                    middle: '',
                    last: 'Hoek'
                },
                username: 'renhoek',
                groups: {}
            }, {
                _id: 'xyzabc',
                name: {
                    first: 'Stimpson',
                    middle: '',
                    last: 'Cat'
                },
                username: 'stimpsoncat',
                groups: {}
            }]
        };
        const ResultsEl = React.createElement(Results, props);
        const RootEl = React.createElement(MemoryRouter, {}, ResultsEl);
        const root = ReactTestUtils.renderIntoDocument(RootEl);
        const results = ReactTestUtils.findRenderedComponentWithType(root, Results);

        Code.expect(results).to.exist();

        done();
    });
});
