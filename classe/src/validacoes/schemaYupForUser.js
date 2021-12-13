const yup = require('yup');
const { setLocale } = require('yup');
const { pt } = require('yup-locales');
setLocale(pt);

const schemaNewUser = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().email().required(),
    senha: yup.string().min(10).required(),
    nome_loja: yup.string().required()
});

const schemaUserLogin = yup.object().shape({
    email: yup.string().email().required(),
    senha: yup.string().min(10).required()
});


const schemaEditProfile = yup.object().shape({
    nome: yup.string(),
    email: yup.string().email(),
    senha: yup.string().min(10),
    nome_loja: yup.string()
});


module.exports = {
    schemaNewUser,
    schemaUserLogin,
    schemaEditProfile
};