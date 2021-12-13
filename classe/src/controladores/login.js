const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../conexao');
const { schemaUserLogin } = require('../validacoes/schemaYupForUser');

const login = async(req, res) => {
    const { email, senha } = req.body;

    try {
        await schemaUserLogin.validate(req.body);

        const findUser = await knex('usuarios')
            .where({ email })
            .first();

        if (!findUser) {
            return res.status(400).json({
                message: "Não foi possível encontrar usuário."
            });
        };

        const passwordCompare = await bcrypt.compare(senha, findUser.senha);
        if (!passwordCompare) {
            return res.status(400).json({
                message: "Email e senha não confere"
            });
        };

        const token = jwt.sign({ id: findUser.id }, process.env.SECRET_JWT, { expiresIn: '8h' });
        const { senha: _, ...userData } = findUser;
        return res.status(200).json({
            user: userData,
            token
        });
    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};

module.exports = login;