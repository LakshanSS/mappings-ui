'use strict';
const AccountGroupsPlugin = require('../../../server/api/posts');
const AccountsPlugin = require('../../../server/api/accounts');
const AuthPlugin = require('../../../server/auth');
const AuthenticatedAdmin = require('../fixtures/credentials-admin');
const AuthenticatedUser = require('../fixtures/credentials-account');
const AuthenticatedCustom = require('../fixtures/credentials-custom-account');

const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-cookie');
const Lab = require('lab');
const MakeMockModel = require('../fixtures/make-mock-model');
const Manifest = require('../../../manifest');
const Path = require('path');
const Proxyquire = require('proxyquire');


const lab = exports.lab = Lab.script();
let request;
let server;
let stub;

const charLimit = Config.get('/posts/charLimit');


lab.before((done) => {

    stub = {
        Post: MakeMockModel(),
        Account: MakeMockModel()
    };


    const proxy = {};
    proxy[Path.join(process.cwd(), './server/models/post')] = stub.Post;
    proxy[Path.join(process.cwd(), './server/models/account')] = stub.Account;

    const ModelsPlugin = {
        register: Proxyquire('hapi-mongo-models', proxy),
        options: Manifest.get('/registrations').filter((reg) => {

            if (reg.plugin &&
                reg.plugin.register &&
                reg.plugin.register === 'hapi-mongo-models') {

                return true;
            }

            return false;
        })[0].plugin.options
    };

    const plugins = [HapiAuth, ModelsPlugin, AuthPlugin, AccountGroupsPlugin,AccountsPlugin];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.register(plugins, (err) => {

        if (err) {
            return done(err);
        }

        server.initialize(done);
    });
});


lab.after((done) => {

    server.plugins['hapi-mongo-models'].MongoModels.disconnect();
    done();
});


lab.experiment('Posts Plugin Result List', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/posts',
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when paged find fails', (done) => {

        stub.Post.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('paged find failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns an array of documents successfully', (done) => {

        stub.Post.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });


    lab.test('it returns an array of documents successfully (using filters)', (done) => {

        stub.Post.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        request.url += '?title=ren&lasteditor=me&visible=true&creator=you';

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });


    lab.test('it returns an error if using wrong filter', (done) => {

        stub.Post.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        request.url += '?title=ren&_id=wrongfilter';

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(400);

            done();
        });
    });


    lab.test('it returns an error when no needed permission', (done) => {

        request = {
            method: 'GET',
            url: '/posts',
            credentials: AuthenticatedUser
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(403);
            done();
        });
    });


    lab.test('it returns correctly when account and has can-list-posts permission', (done) => {

        request = {
            method: 'GET',
            url: '/posts',
            credentials: AuthenticatedCustom(['can-list-posts'])
        };



        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });



});


lab.experiment('Posts Plugin Public Result List', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/posts/public',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when paged find fails', (done) => {

        stub.Post.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(Error('paged find failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });



    lab.test('it returns an array of documents successfully', (done) => {

        stub.Post.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });

    lab.test('it asks only for visible posts', (done) => {

        stub.Post.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            Code.expect(args[0].visible).to.be.true();


            callback(null, { data: [{}, {}, {}] });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });


    lab.test('it returns an array of documents successfully (using filters)', (done) => {

        stub.Post.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        request.url += '?title=ren';

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });


    lab.test('it returns an error if using wrong filter', (done) => {

        stub.Post.pagedFind = function () {

            const args = Array.prototype.slice.call(arguments);
            const callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        request.url += '?title=ren&_id=wrongfilter';

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(400);

            done();
        });
    });





});


lab.experiment('Post Plugin Read', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/posts/test-post',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when find by id fails', (done) => {

        stub.Post.findOne = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns a not found when find by id misses', (done) => {

        stub.Post.findOne = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });



    lab.test('it returns an error when page is not visible and user is no admin', (done) => {

        stub.Post.findOne = function (id, callback) {

            callback(null,{ _id: 'test-post', visible:false });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(403);
            Code.expect(response.result.message).to.match(/Document not visible/i);

            done();
        });
    });


    lab.test('it returns a document successfully', (done) => {

        stub.Post.findOne = function (id, callback) {

            callback(null, { _id: 'test-post', visible:true });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Posts Plugin Create', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'POST',
            url: '/posts',
            payload: {
                title: 'Test Post',
                markdown: '**Test Text**',
                visible: true
            },
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when create fails', (done) => {

        stub.Post.create = function (title,markdown, username, visible, callback) {

            callback(Error('create failed'));
        };

        stub.Post.findOne = function (id, callback) {

            callback();
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns an error when markdown is more than limit', (done) => {

        let moreThanLimit = '';
        for (let i = 0; i <= charLimit; i = i + 1){
            moreThanLimit += 'a';
        }
        request = {
            method: 'PUT',
            url: '/posts/test-post',
            payload: {
                title: 'test-post-modified',
                markdown: moreThanLimit,
                visible: false
            },
            credentials: AuthenticatedAdmin
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });



    lab.test('it returns an error when there is a page with that title already', (done) => {

        stub.Post.findOne = function (conditions, callback) {

            callback(null,{ postId:'test' });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });

    lab.test('it creates a document successfully', (done) => {

        stub.Post.create = function (title,markdown, username, visible, callback) {

            callback(null, { title,markdown,lastEditor:username,visible });
        };

        stub.Post.findOne = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Code.expect(response.result.title).to.equal('Test Post');
            Code.expect(response.result.markdown).to.equal('**Test Text**');
            Code.expect(response.result.visible).to.equal(true);
            Code.expect(response.result.lastEditor).to.equal('admin');

            done();
        });
    });


    lab.test('it returns an error when no needed permission', (done) => {

        request = {
            method: 'POST',
            url: '/posts',
            payload: {
                title: 'Test Post',
                markdown: '**Test Text**',
                visible: true
            },
            credentials: AuthenticatedUser
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(403);
            done();
        });
    });


    lab.test('it returns correctly when account and has can-create-posts permission', (done) => {


        request = {
            method: 'POST',
            url: '/posts',
            payload: {
                title: 'Test Post',
                markdown: '**Test Text**',
                visible: true
            },
            credentials:   AuthenticatedCustom(['can-create-posts'])
        };




        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });



});


lab.experiment('Posts Plugin Update', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'PUT',
            url: '/posts/test-post',
            payload: {
                title: 'test-post-modified',
                markdown: 'updated-text',
                visible: false
            },
            credentials: AuthenticatedAdmin
        };

        done();
    });


    lab.test('it returns an error when update fails', (done) => {

        stub.Post.findOneAndUpdate = function (id, update, callback) {

            callback(Error('update failed'));
        };

        stub.Post.findOne = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });


    lab.test('it returns an error when markdown is more than limit', (done) => {

        let moreThanLimit = '';
        for (let i = 0; i <= charLimit; i = i + 1){
            moreThanLimit += 'a';
        }
        request = {
            method: 'PUT',
            url: '/posts/test-post',
            payload: {
                title: 'test-post-modified',
                markdown: moreThanLimit,
                visible: false
            },
            credentials: AuthenticatedAdmin
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });




    lab.test('it returns not found when find by id misses', (done) => {

        stub.Post.findOneAndUpdate = function (id, update, callback) {

            callback(null, undefined);
        };

        stub.Post.findOne = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            done();
        });
    });



    lab.test('it returns an error when there is a page with that title already', (done) => {

        stub.Post.findOne = function (conditions, callback) {

            callback(null,{ postId:'test' });
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(409);
            done();
        });
    });


    lab.test('it updates a document successfully', (done) => {

        stub.Post.findOneAndUpdate = function (id, update, callback) {

            Code.expect(update.$set.title).to.be.equal('test-post-modified');
            Code.expect(update.$set.visible).to.be.equal(false);
            Code.expect(update.$set.postId).to.be.equal('test-post-modified');
            Code.expect(update.$set.markdown).to.be.equal('updated-text');
            callback(null, update.$set);
        };


        stub.Post.findOne = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Code.expect(response.result.lastEdition.username).to.equal('admin');

            done();
        });
    });

    lab.test('it updates home page successfully, not changing postId, title and visible', (done) => {

        request = {
            method: 'PUT',
            url: '/posts/home',
            payload: {
                title: 'newtitle',
                markdown: 'new markdown',
                visible: false
            },
            credentials: AuthenticatedAdmin
        };

        stub.Post.findOneAndUpdate = function (id, update, callback) {

            Code.expect(update.$set.title).to.be.undefined();
            Code.expect(update.$set.visible).to.be.undefined();
            Code.expect(update.$set.postId).to.be.undefined();
            Code.expect(update.$set.markdown).to.be.equal('new markdown');

            callback(null, update.$set);
        };


        stub.Post.findOne = function (id, callback) {

            callback();
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Code.expect(response.result.lastEdition.username).to.equal('admin');

            done();
        });
    });

    lab.test('it updates a document successfully when title is not updated', (done) => {

        request = {
            method: 'PUT',
            url: '/posts/test-post',
            payload: {
                title: 'test-post',
                markdown: 'updated-text',
                visible: false
            },
            credentials: AuthenticatedAdmin
        };

        stub.Post.findOneAndUpdate = function (id, update, callback) {

            callback(null, update.$set);
        };



        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();
            Code.expect(response.result.lastEdition.username).to.equal('admin');

            done();
        });
    });

    lab.test('it returns an error when no needed permission', (done) => {

        request = {
            method: 'PUT',
            url: '/posts/test-post',
            payload: {
                title: 'Test Post',
                markdown: '**Test Text**',
                visible: true
            },
            credentials: AuthenticatedUser
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(403);
            done();
        });
    });


    lab.test('it returns correctly when account and has can-edit-posts permission', (done) => {


        request = {
            method: 'PUT',
            url: '/posts/test-post',
            payload: {
                title: 'Test Post',
                markdown: '**Test Text**',
                visible: true
            },
            credentials:   AuthenticatedCustom(['can-edit-posts'])
        };




        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });

});




lab.experiment('Posts Plugin Delete', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'DELETE',
            url: '/posts/test-post',
            credentials: AuthenticatedAdmin
        };

        done();
    });

    lab.test('it returns an error when delete by id fails', (done) => {

        stub.Post.findOneAndDelete = function (id, callback) {

            callback(Error('delete by id failed'));
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(500);
            done();
        });
    });

    lab.test('it returns an error when trying to delete home' , (done) => {

        request = {
            method: 'DELETE',
            url: '/posts/home',
            credentials: AuthenticatedAdmin
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(405);
            Code.expect(response.result.message).to.match(/Home page cannot be deleted/i);
            done();
        });
    });





    lab.test('it returns a not found when delete by id misses', (done) => {

        stub.Post.findOneAndDelete = function (id, callback) {

            callback(null, undefined);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it deletes a document successfully', (done) => {

        stub.Post.findOneAndDelete = function (id, callback) {

            callback(null, 1);
        };

        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.success).to.be.true();

            done();
        });
    });

    lab.test('it returns an error when no needed permission', (done) => {

        request = {
            method: 'DELETE',
            url: '/posts/test-post',
            credentials: AuthenticatedUser
        };


        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(403);
            done();
        });
    });


    lab.test('it returns correctly when account and has can-remove-posts permission', (done) => {


        request = {
            method: 'DELETE',
            url: '/posts/test-post',
            credentials:   AuthenticatedCustom(['can-remove-posts'])
        };




        server.inject(request, (response) => {

            Code.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});

