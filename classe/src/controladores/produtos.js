const knex = require('../conexao');
const {
    schemaNewProduct,
    schemaUpdateProduct
} = require('../validacoes/schemaYupForProducts');

const listarProdutos = async(req, res) => {
    const { user } = req;
    const { categoria } = req.query;

    try {
        if (categoria) {
            const findProductByCategory = await knex('produtos')
                .where({
                    categoria,
                    usuario_id: user.id
                });
            return res.status(200).json(findProductByCategory);
        } else {
            const findProducts = await knex('produtos')
                .where({
                    usuario_id: user.id
                });
            if (!findProducts) {
                return res.status(404).json({ message: 'Não foram encontrados produtos para este usuário.' });
            };
            return res.status(200).json(findProducts);
        };
    } catch ({ message }) {
        return res.status(400).json({ message: message });
    };
};

const obterProduto = async(req, res) => {
    const { user } = req;
    const { id } = req.params;

    try {
        const findProduto = await knex('produtos')
            .where({
                usuario_id: user.id,
                id: id
            })
            .first();

        if (!findProduto) {
            return res.status(404).json({
                message: 'Produto não encontrado'
            });
        };

        return res.status(200).json(findProduto);
    } catch ({ message }) {
        return res.status(400).json({ message: message });
    };
};

const cadastrarProduto = async(req, res) => {
    const { user } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    try {
        await schemaNewProduct.validate(req.body);

        await knex('produtos')
            .insert({
                nome,
                estoque,
                preco,
                categoria,
                descricao,
                imagem,
                usuario_id: user.id,
            });

        return res.status(201).json('O produto foi cadastrado com sucesso.');
    } catch ({ message }) {
        return res.status(400).json({ message: message });
    };
};

const atualizarProduto = async(req, res) => {
    const { user } = req;
    const { id } = req.params;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(404).json({
            message: 'Informe ao menos um campo para atualizaçao do produto'
        });
    };

    try {
        await schemaUpdateProduct.validate(req.body);

        const findproduct = await knex('produtos')
            .where({ usuario_id: user.id, id })
            .first();

        if (!findproduct) {
            return res.status(404).json({
                message: 'Produto não encontrado'
            });
        };

        await knex('produtos').update({
            nome: nome ? nome : findproduct.nome,
            estoque: estoque ? estoque : findproduct.estoque,
            categoria: categoria ? categoria : findproduct.categoria,
            descricao: descricao ? descricao : findproduct.descricao,
            preco: preco ? preco : findproduct.preco,
            imagem: imagem ? imagem : findproduct.imagem,
        }).where({
            id,
            usuario_id: user.id
        });


        return res.status(200).json('produto foi atualizado com sucesso.');
    } catch ({ message }) {
        return res.status(400).json({
            message: message
        });
    };
};

const excluirProduto = async(req, res) => {
    const { user } = req;
    const { id } = req.params;

    try {
        const findProduct = await knex('produtos')
            .where({
                usuario_id: user.id,
                id
            }).first();

        if (!findProduct) {
            return res.status(404).json({
                message: 'Produto não encontrado'
            });
        };

        await knex('produtos')
            .where({ id })
            .del();

        return res.status(200).json('Produto excluido com sucesso');
    } catch ({ message }) {
        return res.status(400).json({ message: message });
    };
};

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
};