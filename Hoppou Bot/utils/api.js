module.exports = {
    init: () => {
        console.log('a');
    },
    PostEndpoint: async (endpoint, data) => {
        if (!data) data = {};
        const server = process.env.SERVER;
        const got = require('got');
        data.secret = process.env.SECRET;
        const response = await got.post(`${server}/${endpoint}`, { json: true, body: data });
        return response.body;
    },
    PutEndpoint: async (endpoint, data) => {
        if (!data) data = {};
        const server = process.env.SERVER;
        const got = require('got');
        data.secret = process.env.SECRET;
        const response = await got.put(`${server}/${endpoint}`, { json: true, body: data });
        return response.body;
    },
};