const responseStructure = () => {
    const successResponse = (mensagem, status, resultado) => {
        return {
            mensagem,
            resultado: resultado || '',
            status,
        }
    };
    const errorResponse = (error, status) => {
        return {
            error,
            status
        }
    };
    return { successResponse, errorResponse };
};

module.exports = responseStructure;