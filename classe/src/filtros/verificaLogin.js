const jwt = require('jsonwebtoken');
const knex = require('../conexao');

const verificaLogin = async(req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            message: 'Acess Denied.'
        });
    };

    try {
        const token = authorization.replace('Bearer ', '').trim();
        const { id } = jwt.verify(token, process.env.SECRET_JWT);

        const findUser = await knex('usuarios')
            .where({ id })
            .first();

        if (!findUser) {
            return res.status(404).json({
                message: 'Usuario não encontrado'
            });
        };

        const { senha: _, ...userData } = findUser;
        req.user = userData;

        next();
    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};

module.exports = verificaLogin;