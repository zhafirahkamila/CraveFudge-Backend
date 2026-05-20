const response = (statusCode, data, message, res) => {
    res.status(statusCode).json ({
        payload: {
            status_code: statusCode,
            datas: data,
            message: message
        },
        pagination: {
            prev: "",
            next: "",
            max: ""
        }
    })
}

const errorResponse = (statusCode, message, errors, res) => {
    res.status(statusCode).json({
        payload: {
            status_code: statusCode,
            datas: null,
            message: message,
            errors: errors || null
        },
        pagination: {
            prev: "",
            next: "",
            max: ""
        }
    })
}

module.exports = response;
module.exports.errorResponse = errorResponse;
