function handler(config) {
    return function (req, res, next) {
        res.send("Not ready yet");
    };
}

export default handler;

export {
    handler
};
