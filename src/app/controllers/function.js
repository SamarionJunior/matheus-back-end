export function formatErrorMessageBackEnd(message, error){
    const outputs = ["/n", message, "/n", error, "/n"]
    outputs.forEach(output => console.log(output))
}

export function formatErrorMessageFrontEnd(typeRsponse, message){
    return res.status(typeRsponse).send({erro: message})
}

export function Erro(error, message){
    formatErrorMessageBackEnd(message, error)
    return formatErrorMessageFrontEnd(400, message)
}