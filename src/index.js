const bodyParser = require("body-parser");
const { invalidRequest } = require("./response.json");

function response(res, data, status = 200) {
    if (res.json) {
        return res.status(status).json(data);
    } else if (res.end) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(data));
    }
}

async function handleTrigger(config, body, headers, level = 0) {
    const { op } = body.event;
    const { schema, name: table } = body.table;
    if (typeof config === "undefined") return invalidRequest;
    if (typeof config === "function") return await config(body, headers);
    if (typeof config === "object") {
        if (level === 0 && config[schema]) return await handleTrigger(config[schema], body, headers, ++level);
        if (level === 1 && config[table]) return await handleTrigger(config[table], body, headers, ++level);
        if (level === 2 && config[op]) return await handleTrigger(config[op], body, headers, ++level);
    }
    return { config, level };
}

async function handler(config) {
    return function (req, res, next) {
        return bodyParser.json()(req, res, function () {
            if (req.method !== "POST") return next(req, res, next);
            if (!req.body.id || !req.body.event) return response(res, invalidRequest, 400);
            let result = await handleTrigger(config, req.body, req.headers);
            if (result.config && typeof result.level !== "undefined")
                return response(res, result, 400);
            return response(res, result);
        });
    };
}

module.exports = handler;
