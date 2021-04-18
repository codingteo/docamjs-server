const { request, response } = require("express")
const express=require("express")
const morgan=require("morgan")
const bodyParser=require("body-parser")
const fs=require("fs")
const crittografia=require("./crittografia")
const bcrypt=require("bcrypt")
const { render } = require("ejs")
const { text } = require("body-parser")

//utilità per Docams
const portaDocams=3000

//variabile utente e di utilità per il server
var utentiLoggati=[]
const rimuoviUtenteLoggato=(utente)=>{
    let temp=[]
    for (i=0;i<utentiLoggati.length;i++){
        if (utentiLoggati[i]!=utente){
            temp.push(utentiLoggati[i])
        }
    }

    utentiLoggati=temp
}

const app=express()
app.listen(portaDocams,"192.168.1.60",()=>console.log("Ascoltando richieste sulla porta "+portaDocams))

//registro il view engine
app.set('view engine', 'ejs')

//middleware e file statici (CSS, nel cartella "public")
app.use(express.static("public"))
app.use(express.static("node_modules/bootstrap/dist/css/boostrap.css"))
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan("dev"))

app.get("/",(request,response)=>{
    response.render("index.ejs")
})

app.post("/crea",async (request,response)=>{
    const passwordCriptata=await crittografia.criptaPasswordPerInvio(request.body.accesso.password)
    let utenteCrea=request.body
    utenteCrea.accesso.password=passwordCriptata.toString()
    utenteCrea=JSON.stringify(utenteCrea)
    
    const nomeUtente=request.body.accesso.username
    const crittografato=crittografia.encrypt(utenteCrea)

    //per evitare che un utente già presente sia sovrascritto
    fs.readFile("users/"+nomeUtente,(err,data)=>{
        if (data==null) {
            fs.writeFile("users/"+nomeUtente,crittografato.content,()=>console.log("fatto"))
            fs.writeFile("users/"+nomeUtente+"_iv",crittografato.iv,()=>console.log("fatto iv"))
            utentiLoggati.push(nomeUtente)
            response.status(200).json(passwordCriptata)
        }
        else response.sendStatus(403)
    })
    
})

app.post("/salva",(request,response)=>{
    // const utenteCrea=JSON.stringify(request.body)
    const nomeUtente=request.body.accesso.username
    // const passwordCriptata=request.body.accesso.password

    // const crittografato=crittografia.encrypt(utenteCrea)
    // fs.readFile("users/"+nomeUtente,(err,data)=>{
    //     if (data!=null) {
    //         fs.writeFile("users/"+nomeUtente,crittografato.content,()=>console.log("fatto"))
    //         response.status=200
    //     }
    //     else response.status=403
    // })
    const datiRichiesta=request.body
    let oggettoDati={}
    let utente
    const ivFile=fs.createReadStream("users/"+datiRichiesta.accesso.username+"_iv",{encoding: "utf-8"})
    ivFile.on("data",(chunk)=>{
        oggettoDati.iv=chunk
    })

    const datiFile=fs.createReadStream("users/"+datiRichiesta.accesso.username,{encoding: "utf-8"})
    datiFile.on("data",async (chunk)=>{
        oggettoDati.content=chunk
        utente=crittografia.decrypt(oggettoDati)
        utente=JSON.parse(utente)
        const datiFinali=crittografia.encrypt(JSON.stringify(request.body))

        //datiRichiesta.password==utente.accesso.password
        if (utente.accesso.password==request.body.accesso.password) {
            const trovato=utentiLoggati.find(utenteVerifica=>utenteVerifica==datiRichiesta.accesso.username)
            if (trovato!=null){
                fs.writeFile("users/"+nomeUtente,datiFinali.content,()=>console.log("fatto"))
                fs.writeFile("users/"+nomeUtente+"_iv",datiFinali.iv,()=>console.log("fatto"))
            }
            else response.sendStatus(403)
        }
        else console.log("password non ok")
    })
})

app.post("/accedi",(request,response)=>{
    const datiRichiesta=request.body
    let oggettoDati={}
    let utente

    if (fs.existsSync("users/"+datiRichiesta.username)==true){
        const ivFile=fs.createReadStream("users/"+datiRichiesta.username+"_iv",{encoding: "utf-8"})
        ivFile.on("data",(chunk)=>{
            oggettoDati.iv=chunk
        })

        const datiFile=fs.createReadStream("users/"+datiRichiesta.username,{encoding: "utf-8"})
        datiFile.on("data",async (chunk)=>{
            oggettoDati.content=chunk
            utente=crittografia.decrypt(oggettoDati)
            utente=JSON.parse(utente)

            //datiRichiesta.password==utente.accesso.password
            if (await bcrypt.compare(datiRichiesta.password, utente.accesso.password)) {
                response.status(200).json(JSON.stringify(utente))
                utentiLoggati.push(datiRichiesta.username)
            }
            else {
                console.log("password non ok")
                response.sendStatus(403)
            }
        })
    }
    else response.sendStatus(403)
    
})

app.post("/logout",(request,response)=>{
    const userLogout=request.body
    const trovato=utentiLoggati.find(utente=>utente==userLogout.username)
    if (trovato!=null){
        response.sendStatus(200)
    }
    else response.sendStatus(403)
})