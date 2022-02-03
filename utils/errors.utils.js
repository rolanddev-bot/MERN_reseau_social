module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' }
    if (err.message.includes('pseudo'))
        errors.pseudo = "Pseudo incorrect ou existe déjà!";

    if (err.message.includes('email'))
        errors.email = "email incorrect ! ";


    if (err.message.includes('password'))
        errors.password = "Le mot de passe doit faire 6 caracteres minimum!";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
        errors.email = "Cet email existe déjà!";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
        errors.pseudo = "Cet pseudo existe déjà!";

    return errors;
}

module.exports.signInErrors = (err) => {
    let errors = { email: '', password: '' }

    if (err.message.includes('email'))
        errors.email = "Email incorrect ! ";


    if (err.message.includes('password'))
        errors.password = "Le mot de passe ne correspond pas";

    return errors;
}


module.exports.uploadErrors = (err) => {
    let errors = { format: '', maxZize: '' }

    if (err.message.includes('fichier invalide'))
        errors.format = 'format incompatible';

    if (err.message.includes('la taille est trop grande'))
        errors.maxZize = 'le fichier depasse 500 ko';

    return errors;
}