const bcrypt = require('bcrypt');
const knex = require('../conexao');
const {
    schemaNewUser,
    schemaEditProfile
} = require('../validacoes/schemaYupForUser');

const cadastrarUsuario = async(req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    try {
        await schemaNewUser.validate(req.body);

        const existingEmail = await knex('usuarios')
            .where({ email })
            .first();
        if (existingEmail) {
            return res.status(400).json({
                message: "Este email já está sendo utilizado por outro usuário."
            });
        };

        const passwordEcryption = await bcrypt.hash(senha, 10);
        await knex('usuarios')
            .insert({
                nome: nome,
                email: email,
                senha: passwordEcryption,
                nome_loja: nome_loja
            });

        return res.status(201).json({
            message: "Usuário foi cadastrado com sucesso!"
        });
    } catch ({ message }) {
        return res.status(400).json({ message: message });
    };
};

const obterPerfil = async(req, res) => {
    const { user } = req;
    return res.status(200).json(user);
};

const atualizarPerfil = async(req, res) => {
    const { nome, email, senha, nome_loja } = req.body;
    const { user } = req;

    try {
        await schemaEditProfile(req.body);

        if (email) {
            const existingEmail = await knex('usuarios')
                .where({ email })
                .whereNot({ id: user.id })
                .first();

            if (existingEmail) {
                return res.status(400).json({
                    message: "Email já se encontra em uso."
                });
            };
        };

        let encryptedPassword;
        if (senha) {
            encryptedPassword = bcrypt.hash(senha, 10);
        };

        await knex('usuarios')
            .update({
                nome: nome ? nome : user.nome,
                email: email ? email : user.email,
                senha: senha ? encryptedPassword : user.senha,
                nome_loja: nome_loja ? nome_loja : user.nome_loja
            })
            .where({ id });

        return res.status(200).json({
            message: 'Usuario foi atualizado com sucesso.'
        });
    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
};