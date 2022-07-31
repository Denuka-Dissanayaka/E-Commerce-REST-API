function errorHandler(err, req, res, next) {
    if(err.name = 'UnauthorizeError') {
       return res.status(401).json({message: err});
    }
    res.status(500).json({message: err});
}

module.exports = errorHandler;