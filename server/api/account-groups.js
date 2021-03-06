'use strict';
const Boom = require('boom');
const EscapeRegExp = require('escape-string-regexp');
const Joi = require('joi');

const internals = {};

internals.applyRoutes = function (server, next) {
    const AccountGroup = server.plugins['hapi-mongo-models'].AccountGroup;
    server.route({
        method: 'GET',
        path: '/account-groups',
        config: {
            auth: {
                strategy: 'session',
                scope: '111111111111111111111111'
            },
            validate: {
                query: {
                    name: Joi.string().allow(''),
                    fields: Joi.string(),
                    sort: Joi.string().default('_id'),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            },
            pre: [
                ////AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {
            const query = {};
            if (request.query.name) {
                query.name = new RegExp('^.*?' + EscapeRegExp(request.query.name) + '.*$', 'i');
            }
            if (request.query._id){
                query._id = new RegExp('^.*?' + EscapeRegExp(request.query._id) + '.*$', 'i');
            }
            const fields = request.query.fields;
            const sort = request.query.sort;
            const limit = request.query.limit;
            const page = request.query.page;

            AccountGroup.pagedFind(query, fields, sort, limit, page, (err, results) => {
                if (err) {
                    return reply(err);
                }
                reply(results);
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/account-groups/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: '111111111111111111111111'
            },
            pre: [
                //AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            AccountGroup.findById(request.params.id, (err, accountGroup) => {

                if (err) {
                    return reply(err);
                }

                if (!accountGroup) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(accountGroup);
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/account-groups',
        config: {
            auth: {
                strategy: 'session',
                scope: '111111111111111111111111'
            },
            validate: {
                payload: {
                    name: Joi.string().required()
                }
            },
            pre: [
                //AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            const name = request.payload.name;

            AccountGroup.create(name, (err, accountGroup) => {

                if (err) {
                    return reply(err);
                }

                reply(accountGroup);
            });
        }
    });

    server.route({
        method: 'PUT',
        path: '/account-groups/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: '111111111111111111111111'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('root')
                },
                payload: {
                    name: Joi.string().required()
                }
            },
            pre: [
                //AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            const id = request.params.id;
            const update = {
                $set: {
                    name: request.payload.name
                }
            };

            AccountGroup.findByIdAndUpdate(id, update, (err, accountGroup) => {

                if (err) {
                    return reply(err);
                }

                if (!accountGroup) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(accountGroup);
            });
        }
    });

    server.route({
        method: 'PUT',
        path: '/account-groups/{id}/permissions',
        config: {
            auth: {
                strategy: 'session',
                scope: '111111111111111111111111'
            },
            validate: {
                params: {
                    id: Joi.string().invalid('root')
                },
                payload: {
                    permissions: Joi.object().required()
                }
            },
            pre: [
                //AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            const id = request.params.id;
            const update = {
                $set: {
                    permissions: request.payload.permissions
                }
            };

            AccountGroup.findByIdAndUpdate(id, update, (err, accountGroup) => {

                if (err) {
                    return reply(err);
                }

                reply(accountGroup);
            });
        }
    });

    server.route({
        method: 'DELETE',
        path: '/account-groups/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: '111111111111111111111111'
            },
            validate: {
                //Account and Admin groups cannot be removed
                params: {
                    id: Joi.string().invalid('111111111111111111111111','000000000000000000000000')
                }
            },
            pre: [
                //AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            AccountGroup.findByIdAndDelete(request.params.id, (err, accountGroup) => {

                if (err) {
                    return reply(err);
                }

                if (!accountGroup) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply({ success: true });
            });
        }
    });
    next();
};

exports.register = function (server, options, next) {
    server.dependency(['auth', 'hapi-mongo-models'], internals.applyRoutes);
    next();
};

exports.register.attributes = {
    name: 'account-groups'
};
