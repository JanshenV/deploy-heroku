const yup = require('yup');
const { setLocale } = require('yup');
const { pt } = require('yup-locales');
setLocale(pt);


const schemaNewProduct = yup.object().shape({
    nome: yup.string().required(),
    estoque: yup.number().required(),
    preco: yup.number().strict().required(),
    categoria: yup.string(),
    descricao: yup.string(),
    imagem: yup.string()
});

const schemaUpdateProduct = yup.object().shape({
    nome: yup.string(),
    estoque: yup.number(),
    preco: yup.number().strict(),
    categoria: yup.string(),
    descricao: yup.string(),
    imagem: yup.string()
});

module.exports = {
    schemaNewProduct,
    schemaUpdateProduct
};