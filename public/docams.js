//variabili globali
var utente={
    infoUtente: {},
    accesso: {},
    materie: []
}
var graficoTrimestre
var graficoPentamestre
var caricato=false

//costruttori
function Materia(nome){
    this.nome=nome
    this.trimestre={
        obiettivo: null,
        media: null,
        votiSufficienti: 0,
        votiInsufficienti: 0,
        voti: []
    }
    this.pentamestre={
        obiettivo: null,
        media: null,
        votiSufficienti: 0,
        votiInsufficienti: 0,
        voti: []
    }
}

function Voto(voto,materia,tipo,data){
    this.voto=voto
    this.materia=materia
    this.tipo=tipo
    this.data=data
    this.mese=this.data.split("-")[1]

    //non si può mettere in un prototipo perchè al savataggio non funzionerebbe
    this.getDati=function(){
        let temp=""
        temp+=this.materia+","
        temp+=this.voto+","
        temp+=this.tipo+","
        temp+=this.data

        return temp
    }
}

//funzioni che vengono usate da altre funzioni. Se ci fosse un livello di visibilità, sarebbero private. Queste NON vengono chiamate da un bottone
trovaIndirizzoMateria=function(materia){
    //funzione che restituisce l'indirizzo della materia passata come parametro
    for (i=0;i<utente.materie.length;i++){
        if (utente.materie[i].nome==materia.nome) return i
    }
    return -1
}

getDatiVoto=function(voto){
    let temp=""
    temp+=voto.materia+","
    temp+=voto.voto+","
    temp+=voto.tipo+","
    temp+=voto.data

    return temp
}

trovaIndirizzoVoto=function(materia,voto){

    //funzione che restituisce l'indirizzo del voto di una materia, con materia e voto passati in parametro
    //il voto va passato in un formato compatibile con quello del metodo getDati() del prototipo: materia,voto,tipo,data
    let indirizzoMateria=trovaIndirizzoMateria(materia)
    let periodoVotoNumero
    let periodoVoto
    let temp=voto.split(",")
    temp=temp[3].split("-")
    periodoVotoNumero=temp[1]

    if (periodoVotoNumero>=9 && periodoVotoNumero<=12) periodoVoto="trimestre"
    else periodoVoto="pentamestre"

    for (i=0;i<utente.materie[indirizzoMateria][periodoVoto].voti.length;i++){
        if (voto==getDatiVoto(utente.materie[indirizzoMateria][periodoVoto].voti[i])) return {indirizzoVotoRimuovi: i, periodoVoto}
    }
    return {indirizzoVotoRimuovi: -1, periodoVoto}
}

aggiornaInformazioniMateria=function(materia,indirizzoMateria){
    let sommaTrimestre=0
    let mediaTrimestre

    let sommaPentamestre=0
    let mediaPentamestre

    for (i=0;i<materia.trimestre.voti.length;i++) sommaTrimestre+=materia.trimestre.voti[i].voto
    mediaTrimestre=(sommaTrimestre/materia.trimestre.voti.length).toPrecision(3)
    materia.trimestre.media=mediaTrimestre

    for (i=0;i<materia.pentamestre.voti.length;i++) sommaPentamestre+=materia.pentamestre.voti[i].voto
    mediaPentamestre=(sommaPentamestre/materia.pentamestre.voti.length).toPrecision(3)
    materia.pentamestre.media=mediaPentamestre

    utente.materie[indirizzoMateria]=materia
}

//funzioni che vengono chiamate alla pressione di un bottone
creaUtente=function(){
    let nuovoNome
    let nuovoCognome
    let nuovoClasse
    let nuovoScuola
    let nuovoUsername
    let nuovoPassword
    let infoUtente={}
    let accesso={}
    let mancante=false

    nuovoNome=document.getElementById("inputNuovoNome").value
    nuovoCognome=document.getElementById("inputNuovoCognome").value
    nuovoClasse=document.getElementById("inputNuovoClasse").value
    nuovoScuola=document.getElementById("inputNuovoScuola").value
    nuovoUsername=document.getElementById("inputNuovoUsername").value
    nuovoPassword=document.getElementById("inputNuovoPassword").value


    if (nuovoNome=="") mancante=true
    if (nuovoCognome=="") mancante=true
    if (nuovoClasse=="") mancante=true
    if (nuovoScuola=="") mancante=true
    if (nuovoUsername=="") mancante=true
    if (nuovoPassword=="") mancante=true
    

    if (mancante==false){
        infoUtente.nome=nuovoNome
        infoUtente.cognome=nuovoCognome
        infoUtente.classe=nuovoClasse
        infoUtente.scuola=nuovoScuola
        utente={}
        utente.infoUtente=infoUtente
        utente.materie=[]
        accesso.username=nuovoUsername
        accesso.password=nuovoPassword
        utente.accesso=accesso
        salvaSuServer()
        document.getElementById("inputNuovoNome").value=""
        document.getElementById("inputNuovoCognome").value=""
        document.getElementById("inputNuovoClasse").value=""
        document.getElementById("inputNuovoScuola").value=""
        document.getElementById("inputNuovoUsername").value=""
        document.getElementById("inputNuovoPassword").value=""
    }
    else {
        $('#collapseCompilaTutto').collapse("show")
        setInterval(()=>{
            $('#collapseCompilaTutto').collapse("hide")
        },3000)
    }

    document.getElementById("downloadButton").setAttribute("download",utente.infoUtente.nome+utente.infoUtente.cognome+"DocamJS.json")
}

creaMateria=function(){
    let nomeSupporto=document.getElementById("inputNuovoMateria").value
    let tempNome=nomeSupporto.replace(/ /g, "_")

/*     let tempObiettivo=document.getElementById("inputNuovoObiettivo") */

    utente.materie.push(new Materia(tempNome))
    aggiornaGraficiAggiungiMateria(tempNome)

    document.getElementById("inputNuovoMateria").value=""
    aggiornaSuServer()
}

creaVoto=function(){
    let tempMateria
    let tempVoto
    let tempTipo
    let tempData
    let indirizzoMateria=0
    let arrayData

    tempMateria=document.getElementById("selectNuovoVotoMateria").value
    tempVoto=document.getElementById("inputNuovoVoto").value
    tempTipo=document.getElementById("inputNuovoVotoTipo").value
    tempData=document.getElementById("inputNuovoVotoData").value
    arrayData=tempData.split("-")

    indirizzoMateria=trovaIndirizzoMateria(tempMateria)

    if (Number(arrayData[1])>8 && Number(arrayData[1])<=12) {
        utente.materie[indirizzoMateria].trimestre.voti.push(new Voto(Number(tempVoto),tempMateria,tempTipo,tempData))
        if (Number(tempVoto)>=6) utente.materie[indirizzoMateria].trimestre.votiSufficienti+=1
        else utente.materie[indirizzoMateria].trimestre.votiInsufficienti+=1
    }
    else{
        utente.materie[indirizzoMateria].pentamestre.voti.push(new Voto(Number(tempVoto),tempMateria,tempTipo,tempData))
        if (Number(tempVoto)>=6) utente.materie[indirizzoMateria].pentamestre.votiSufficienti+=1
        else utente.materie[indirizzoMateria].pentamestre.votiInsufficienti+=1
    }

    aggiornaInformazioniMateria(utente.materie[indirizzoMateria],indirizzoMateria)
    calcolaProssimoVoto(utente.materie[indirizzoMateria])
    aggiornaInformazioniStampate(utente.materie[indirizzoMateria])
    aggiornaGraficiMedia(utente.materie[indirizzoMateria])
    document.getElementById("selectNuovoVotoMateria").value="Scegli una materia..."
    document.getElementById("inputNuovoVoto").value="Scegli un voto..."
    document.getElementById("inputNuovoVotoTipo").value=""
    document.getElementById("inputNuovoVotoData").value=""
    aggiornaSuServer()
}

rimuoviVoto=function(){
    const materiaRimuovi=document.getElementById("selectRimuoviVotoMateria").value
    let votoRimuovi
    let indirizzoMateriaRimuovi
    let indirizzoVotoRimuovi
    let periodoVotiRimuovi
    let infoVotoRimuovi
    let tempArrayVoti=[]

    votoRimuovi=document.getElementById("selectRimuoviVotoVoto").value
    indirizzoMateriaRimuovi=trovaIndirizzoMateria(materiaRimuovi)
    infoVotoRimuovi=trovaIndirizzoVoto(materiaRimuovi,votoRimuovi)

    indirizzoVotoRimuovi=infoVotoRimuovi.indirizzoVotoRimuovi
    periodoVotiRimuovi=infoVotoRimuovi.periodoVoto

    if (utente.materie[indirizzoMateriaRimuovi][periodoVotiRimuovi].voti[indirizzoVotoRimuovi]<6) utente.materie[indirizzoMateriaRimuovi][periodoVotiRimuovi].votiSufficienti-=1
    else utente.materie[indirizzoMateriaRimuovi][periodoVotiRimuovi].votiInsufficienti-=1

    for (i=0;i<utente.materie[indirizzoMateriaRimuovi][periodoVotiRimuovi].voti.length;i++){
        if (i!=indirizzoVotoRimuovi) tempArrayVoti.push(utente.materie[indirizzoMateriaRimuovi][periodoVotiRimuovi].voti[i])
    }

    utente.materie[indirizzoMateriaRimuovi][periodoVotiRimuovi].voti=tempArrayVoti
    aggiornaInformazioniMateria(utente.materie[indirizzoMateriaRimuovi],indirizzoMateriaRimuovi)
    preparaSelectVoti(materiaRimuovi,"selectRimuoviVotoMateria")
    aggiornaInformazioniStampate(utente.materie[indirizzoMateriaRimuovi])
    aggiornaSuServer()
}

salvaInformazioniUtente=function(){
    utente.infoUtente.nome=document.getElementById("inputImpostazioniNome").value
    utente.infoUtente.cognome=document.getElementById("inputImpostazioniCognome").value
    utente.infoUtente.classe=document.getElementById("inputImpostazioniClasse").value
    utente.infoUtente.scuola=document.getElementById("inputImpostazioniScuola").value

    $('#collapseInformazioniUtenteSalvate').collapse("show")
    setInterval(()=>{
        $('#collapseInformazioniUtenteSalvate').collapse("hide")
    },3000)
    aggiornaSuServer()
}

salvaInformazioniConsiderazioneVoti=function(){
    utente.infoUtente.votoPositivo=document.getElementById("inputImpostazioniVotoPositivo").value
    utente.infoUtente.votoAccettabile=document.getElementById("inputImpostazioniVotoAccettabile").value
    utente.infoUtente.votoNegativo=document.getElementById("inputImpostazioniVotoNegativo").value
    $('#collapseImpostazioniVotiSalvate').collapse("show")
    setInterval(()=>{
        $('#collapseImpostazioniVotiSalvate').collapse("hide")
    },3000)

    for (i=0;i<utente.materie.length;i++){
        creaTabellaMateriaD(utente.materie[i].trimestre.voti,"tabellaVotiTrimestre"+utente.materie[i].nome)
        creaTabellaMateriaD(utente.materie[i].pentamestre.voti,"tabellaVotiPentamestre"+utente.materie[i].nome)
    }
    aggiornaSuServer()
}

impostaObiettivoMateria=function(materia,periodo){
    let periodoObiettivo
    let obiettivoVoto
    let indirizzoMateria=trovaIndirizzoMateria(materia)

    if (periodo=="trimestre") periodoObiettivo="Trimestre"
    else periodoObiettivo="Pentamestre"

    obiettivoVoto=document.getElementById("inputObiettivo"+periodoObiettivo+materia).value

    utente.materie[indirizzoMateria][periodo].obiettivo=Number(obiettivoVoto)
    document.getElementById("inputObiettivo"+periodoObiettivo+materia).value=obiettivoVoto
    calcolaProssimoVoto(utente.materie[indirizzoMateria])
    aggiornaSuServer()
}

modificaVoto=function(){
    const materiaRimuovi=document.getElementById("selectModificaVotoMateria").value
    let votoModifica
    let indirizzoMateriaModifica
    let indirizzoVotoModifica
    let periodoVotoModifica
    let infoVotoModifica
    let nuovoVoto
    let nuovoTipo
    let nuovaData

    votoModifica=document.getElementById("selectModificaVotoVoto").value
    indirizzoMateriaModifica=trovaIndirizzoMateria(materiaRimuovi)
    infoVotoModifica=trovaIndirizzoVoto(materiaRimuovi,votoModifica)

    indirizzoVotoModifica=infoVotoModifica.indirizzoVotoRimuovi
    periodoVotoModifica=infoVotoModifica.periodoVoto

    nuovoVoto=document.getElementById("inputModificaVoto").value
    nuovoTipo=document.getElementById("inputModificaVotoTipo").value
    nuovaData=document.getElementById("inputModificaVotoData").value

    utente.materie[indirizzoMateriaModifica][periodoVotoModifica].voti[indirizzoVotoModifica].voto=Number(nuovoVoto)
    utente.materie[indirizzoMateriaModifica][periodoVotoModifica].voti[indirizzoVotoModifica].tipo=nuovoTipo
    utente.materie[indirizzoMateriaModifica][periodoVotoModifica].voti[indirizzoVotoModifica].data=nuovaData

    for (i=0;i<utente.materie.length;i++) aggiornaInformazioniStampate(utente.materie[i])
    for (i=0;i<utente.materie.length;i++) aggiornaGraficiAggiungiMateria(utente.materie[i].nome)
    for (i=0;i<utente.materie.length;i++) aggiornaGraficiMedia(utente.materie[i])
    aggiornaInformazioniMateria(utente.materie[indirizzoMateriaModifica],indirizzoMateriaModifica)
    aggiornaInformazioniStampate(utente.materie[indirizzoMateriaModifica])
    aggiornaGraficiMedia(utente.materie[indirizzoMateriaModifica])
    mostraMediaGenerale()
}

calcolaProssimoVoto=function(materia){
    let sommaVotiTrimestre=0
    let numeroVotiTrimestre
    let sommaObiettivoTrimestre
    let prossimoVotoTrimestre

    let sommaVotiPentamestre=0
    let numeroVotiPentamestre
    let sommaObiettivoPentamestre
    let prossimoVotoPentamestre

    let obiettivoTrimestre=materia.trimestre.obiettivo
    let obiettivoPentamestre=materia.pentamestre.obiettivo

    if (materia.trimestre.obiettivo>=1 && materia.trimestre.obiettivo<=10){
        for (i=0;i<utente.materie[i].voti.length;i++) sommaVotiTrimestre+=materia.trimestre.voti[i].voto
        numeroVotiTrimestre=materia.trimestre.voti.length
        sommaObiettivoTrimestre=obiettivoTrimestre*(numeroVotiTrimestre+1)
        prossimoVotoTrimestre=sommaObiettivoTrimestre-sommaVotiTrimestre
        if (prossimoVotoTrimestre<=10) document.getElementById("h4ProssimoVotoTrimestre"+materia.nome).innerText=prossimoVotoTrimestre
        else document.getElementById("h4ProssimoVotoTrimestre"+materia.nome).innerText="10"
    }
    else document.getElementById("h4ProssimoVotoTrimestre"+materia.nome).innerText="-"

    if (materia.pentamestre.obiettivo>=1 && materia.pentamestre.obiettivo<=10){
        for (i=0;i<materia.pentamestre.voti.length;i++) sommaVotiPentamestre+=materia.pentamestre.voti[i].voto
        numeroVotiPentamestre=materia.pentamestre.voti.length
        sommaObiettivoPentamestre=obiettivoPentamestre*(numeroVotiPentamestre+1)
        prossimoVotoPentamestre=sommaObiettivoPentamestre-sommaVotiPentamestre
        if (prossimoVotoPentamestre<=10) document.getElementById("h4ProssimoVotoPentamestre"+materia.nome).innerText=prossimoVotoPentamestre
        else document.getElementById("h4ProssimoVotoPentamestre"+materia.nome).innerText="10"
    }
    else document.getElementById("h4ProssimoVotoPentamestre"+materia.nome).innerText="-"
}

calcolaMediaGeneralePeriodo=function(periodo){
    let sommaMedie=0
    let materieConVoto=0
    let media

    for (i=0;i<utente.materie.length;i++){
        
        if (utente.materie[i][periodo].media!="NaN" && utente.materie[i][periodo].media!=null) {
            sommaMedie+=Number(utente.materie[i][periodo].media)
            materieConVoto+=1
        }
    }

    media=(sommaMedie/materieConVoto).toPrecision(3)
    if (media=="NaN") media="-"
    return media
}

aggiornaInformazioniStampate=function(materia){
    let h1MediaTrimestre=document.getElementById("h1MediaTrimestre"+materia.nome)
    let h1MediaPentamestre=document.getElementById("h1MediaPentamestre"+materia.nome)

    let votiSufficientiTrimestre=document.getElementById("pVotiSufficientiTrimestre"+materia.nome)
    let votiInsufficientiTrimestre=document.getElementById("pVotiInsufficientiTrimestre"+materia.nome)
    let votiSufficientiPentamestre=document.getElementById("pVotiSufficientiPentamestre"+materia.nome)
    let votiInsufficientiPentamestre=document.getElementById("pVotiInsufficientiPentamestre"+materia.nome)

    let mediaGeneraleTrimestre=calcolaMediaGeneralePeriodo("trimestre")
    let mediaGeneralePentamestre=calcolaMediaGeneralePeriodo("pentamestre")

    if (materia.trimestre.media!="NaN") h1MediaTrimestre.innerText=materia.trimestre.media
    if (materia.pentamestre.media!="NaN") h1MediaPentamestre.innerText=materia.pentamestre.media
    votiSufficientiTrimestre.innerText=materia.trimestre.votiSufficienti+" voti sufficienti"
    votiInsufficientiTrimestre.innerText=materia.trimestre.votiInsufficienti+" voti insufficienti"
    votiSufficientiPentamestre.innerText=materia.pentamestre.votiSufficienti+" voti sufficienti"
    votiInsufficientiPentamestre.innerText=materia.pentamestre.votiInsufficienti+" voti insufficienti"
    calcolaProssimoVoto(materia)
    creaTabellaMateriaD(materia.trimestre.voti,"tabellaVotiTrimestre"+materia.nome)
    creaTabellaMateriaD(materia.pentamestre.voti,"tabellaVotiPentamestre"+materia.nome)

    document.getElementById("mediaGeneraleTrimestre").innerText=mediaGeneraleTrimestre
    document.getElementById("mediaGeneralePentamestre").innerText=mediaGeneralePentamestre

}

mostraMediaGenerale=function(){
    let mediaGeneraleTrimestre=calcolaMediaGeneralePeriodo("trimestre")
    let mediaGeneralePentamestre=calcolaMediaGeneralePeriodo("pentamestre")
    document.getElementById("mediaGeneraleTrimestre").innerText=mediaGeneraleTrimestre
    document.getElementById("mediaGeneralePentamestre").innerText=mediaGeneralePentamestre
}

creaTabellaMateriaD=function(voti,id){
    let tabella
    let riga
    let colonnaData
    let colonnaVoto
    let colonnaTipo
    let dimensioneTabella

    tabella=document.getElementById(id)
    dimensioneTabella=tabella.rows.length

    for (j=0;j<dimensioneTabella;j++){
        tabella.deleteRow(-1)
    }

    riga=tabella.insertRow(-1)
    colonnaData=riga.insertCell(0)
    colonnaData.innerText="Data"
    colonnaVoto=riga.insertCell(1)
    colonnaVoto.innerText="Voto"
    colonnaTipo=riga.insertCell(2)
    colonnaTipo.innerText="Tipo"

    for (j=0;j<voti.length;j++){
        riga=tabella.insertRow(-1)

        colonnaData=riga.insertCell(0)
        colonnaData.innerText=voti[j].data
        colonnaVoto=riga.insertCell(1)
        colonnaVoto.innerText=voti[j].voto
        if (voti[j].voto<utente.infoUtente.votoNegativo){
            //colonnaVoto.style.color="red"
            colonnaVoto.className="votoNegativo"
        }
        else if (voti[j].voto>=utente.infoUtente.votoNegativo && voti[j].voto<utente.infoUtente.votoAccettabile){
            //colonnaVoto.style.color="#ff6600"
            colonnaVoto.className="votoIntermedio"
        }
        else if (voti[j].voto>=utente.infoUtente.votoAccettabile && voti[j].voto<utente.infoUtente.votoPositivo){
            //colonnaVoto.style.color="yellow"
            colonnaVoto.className="votoAccettabile"
        }
        else if (voti[j].voto>=utente.infoUtente.votoPositivo){
            //colonnaVoto.style.color="#00cc00"
            colonnaVoto.className="votoPositivo"
        }
        colonnaTipo=riga.insertCell(2)
        colonnaTipo.innerText=voti[j].tipo
    }

}

preparaDownloadFile=function(){
    let json=JSON.stringify(utente)
    let blobFile=new Blob ([json], {type: "json"})
    document.getElementById("downloadButton").href=URL.createObjectURL(blobFile)
}

controllaValiditaVoto=function(listaInput){
    let nonValido=false

    for (i=0;i<listaInput.length;i++){
        if (document.getElementById(listaInput[i])<1 || document.getElementById(listaInput[i])>10) {
            document.getElementById(listaInput[i]).style.borderColor="red"
            nonValido=true
        }
    }
    prompt("INPUT NON VALIDO")
    return nonValido
}

rimuoviMateria=function(){
    let materiaRimuovi=document.getElementById("selectRimuoviMateria").value
    let indirizzoMateria=trovaIndirizzoMateria(materiaRimuovi)
    let labelGrafico=utente.materie[indirizzoMateria].nome
    let arrayTemp=[]
    let tempMateria

    tempMateria=utente.materie[indirizzoMateria]
    for (i=0;i<utente.materie.length;i++){
        if (i!=indirizzoMateria){
            arrayTemp.push(utente.materie[i])
        }
    }
    utente.materie=arrayTemp
    for (i=0;i<utente.materie.length;i++) {
        aggiornaInformazioniStampate(utente.materie[i])
    }
    aggiornaGraficiMediaRimuovi(tempMateria)
    aggiornaGraficoRimuoviMateria(labelGrafico)
    aggiornaSuServer()
    document.getElementById("selectRimuoviMateria").value="Scegli una materia..."
}

caricaFile=function() {
    let inputFiles=document.getElementById("inputFile").files
    let fileLoad=inputFiles[0]
    let fileReaderUno=new FileReader()

    fileReaderUno.addEventListener("loadend",()=>{
        mostraHomeCarica()
    })

    fileReaderUno.onload=function() {
        utente=JSON.parse(fileReaderUno.result)
    }
    

    fileReaderUno.readAsText(fileLoad)
}

creaGrafici=function(){
    let graficoTrimestreDOM=document.getElementById("graficoTrimestre").getContext("2d")
    let graficoPentamestreDOM=document.getElementById("graficoPentamestre").getContext("2d")

    graficoTrimestre=new Chart(graficoTrimestreDOM, {
        type: "bar",
        data:{
            labels: [],
            datasets: [{
                label: null,
                data: [],
                backgroundColor: []
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    beginAtZero: true,
                    ticks:{
                        max: 10,
                        min: 0,
                        suggestedMax: 0,
                        suggestedMin: 0
                    }

                }]
            },
            responsive: true
        }
    })

    graficoPentamestre=new Chart(graficoPentamestreDOM,{
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: null,
                data: [],
                backgroundColor: []
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    beginAtZero: true,
                    ticks:{
                        max: 10,
                        min: 0,
                        suggestedMax: 0,
                        suggestedMin: 0
                    }

                }]
            },
            responsive: true
        }
    })

}

aggiornaGraficiAggiungiMateria=function(label){
    graficoTrimestre.data.labels.push(label)
    graficoPentamestre.data.labels.push(label)
    graficoTrimestre.update()
    graficoPentamestre.update()
}

aggiornaGraficiMedia=function(materia){
    let indirizzoMateria=trovaIndirizzoMateria(materia.nome)

    graficoTrimestre.data.datasets[0].data[indirizzoMateria]=Number(materia.trimestre.media)
    graficoTrimestre.data.datasets[0].label="Media trimestre"
    graficoTrimestre.data.datasets[0].backgroundColor[indirizzoMateria]=("rgb("+(Math.random()*1000)%255+", "+(Math.random()*1000)%255+", "+(Math.random()*1000)%255+", 1)")
    graficoTrimestre.update()

    graficoPentamestre.data.datasets[0].data[indirizzoMateria]=Number(materia.pentamestre.media)
    graficoPentamestre.data.datasets[0].label="Media pentamestre"
    graficoPentamestre.data.datasets[0].backgroundColor[indirizzoMateria]=("rgb("+(Math.random()*1000)%255+", "+(Math.random()*1000)%255+", "+(Math.random()*1000)%255+", 1)")
    graficoPentamestre.update()
}

aggiornaGraficoRimuoviMateria=function(label){
    let indirizzoLabel
    let tempArrayLabels=[]

    //trimestre
    for (i=0;i<graficoTrimestre.data.labels.length;i++){
        if (graficoTrimestre.data.labels[i]==label) indirizzoLabel=i
    }

    for (i=0;i<graficoTrimestre.data.labels.length;i++){
        if (i!=indirizzoLabel) tempArrayLabels.push(graficoTrimestre.data.labels[i])
    }

    graficoTrimestre.data.labels=tempArrayLabels
    graficoTrimestre.update()

    //pentamestre
    tempArrayLabels=[]
    for (i=0;i<graficoPentamestre.data.labels.length;i++){
        if (graficoPentamestre.data.labels[i]==label) indirizzoLabel=i
    }

    for (i=0;i<graficoPentamestre.data.labels.length;i++){
        if (i!=indirizzoLabel) tempArrayLabels.push(graficoPentamestre.data.labels[i])
    }

    graficoPentamestre.data.labels=tempArrayLabels
    graficoPentamestre.update()
}

aggiornaGraficiMediaRimuovi=function(materia){
    let indirizzoDataRimuovi
    let tempArrayData=[]

    //trimestre
    for (i=0;i<graficoTrimestre.data.datasets[0].data.length;i++){
        if (graficoTrimestre.data.datasets[0].data[i]==materia.trimestre.media) indirizzoDataRimuovi=i
    }
    for (i=0;i<graficoTrimestre.data.datasets[0].data.length;i++){
        if (i!=indirizzoDataRimuovi){
            tempArrayData.push(graficoTrimestre.data.datasets[0].data[i])
        }
    }
    graficoTrimestre.data.datasets[0].data=tempArrayData
    graficoTrimestre.update()

    //pentamestre
    tempArrayData=[]
    for (i=0;i<graficoPentamestre.data.datasets[0].data.length;i++){
        if (graficoPentamestre.data.datasets[0].data[i]==materia.pentamestre.media) indirizzoDataRimuovi=i
    }
    for (i=0;i<graficoPentamestre.data.datasets[0].data.length;i++){
        if (i!=indirizzoDataRimuovi){
            tempArrayData.push(graficoPentamestre.data.datasets[0].data[i])
        }
    }
    graficoPentamestre.data.datasets[0].data=tempArrayData
    graficoPentamestre.update()
}

mostraInformazioniAttualiVoto=function(){
    let materiaVoto
    let votoModifica
    let indirizzoMateriaModifica
    let informazioniVotoModifica

    materiaVoto=document.getElementById("selectModificaVotoMateria").value
    indirizzoMateriaModifica=trovaIndirizzoMateria(materiaVoto)

    votoModifica=document.getElementById("selectModificaVotoVoto").value
    informazioniVotoModifica=trovaIndirizzoVoto(materiaVoto,votoModifica)

    document.getElementById("inputModificaVoto").value=utente.materie[indirizzoMateriaModifica][informazioniVotoModifica.periodoVoto].voti[informazioniVotoModifica.indirizzoVotoRimuovi].voto
    document.getElementById("inputModificaVotoTipo").value=utente.materie[indirizzoMateriaModifica][informazioniVotoModifica.periodoVoto].voti[informazioniVotoModifica.indirizzoVotoRimuovi].tipo
    document.getElementById("inputModificaVotoData").value=utente.materie[indirizzoMateriaModifica][informazioniVotoModifica.periodoVoto].voti[informazioniVotoModifica.indirizzoVotoRimuovi].data
}

modificaMateria=function(){
    let nuovoNome=document.getElementById("inputNuovoNomeMateria").value
    let nuovoNomeOk=nuovoNome.replace(/ /g, "_")
    let nomeMateriaModifica=document.getElementById("selectModificaMateria").value
    let indirizzoMateria=trovaIndirizzoMateria(nomeMateriaModifica)

    document.getElementById("inputNuovoNome").value=""

    utente.materie[indirizzoMateria].nome=nuovoNomeOk
    creaSezioneMaterie()
    rimuoviTuttoGrafici()
    for (i=0;i<utente.materie.length;i++) aggiornaGraficiAggiungiMateria(utente.materie[i].nome)
    for (i=0;i<utente.materie.length;i++) aggiornaGraficiMedia(utente.materie[i])
    aggiornaSuServer()
}

rimuoviTuttoGrafici=function(){
    let dimensione
    
    //trimestre
    dimensione=graficoTrimestre.data.labels.length
    for (j=0;j<dimensione;j++){
        graficoTrimestre.data.labels.pop()
    }
    for (j=0;j<dimensione;j++){
        graficoTrimestre.data.datasets[0].data.pop()
    }

    //pentamestre
    dimensione=graficoPentamestre.data.labels.length
    for (j=0;j<dimensione;j++){
        graficoPentamestre.data.labels.pop()
    }
    for (j=0;j<dimensione;j++){
        graficoPentamestre.data.datasets[0].data.pop()
    }
}

const salvaSuServer=async ()=>{
    fetch("/crea",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(utente)
    })
    .then(result=>result.json())
    .then(data=>{
        if (utente!=null) {
            utente.accesso.password=data
            window.onbeforeunload=()=>logout()
            mostraHomeCarica()            
        }
        else console.log("Già esiste")
    })
    .catch(err=>{
        console.log(err)
        $('#collapseGiaPresente').collapse('show')
        setTimeout(()=>$('#collapseGiaPresente').collapse('hide'),3000)
    })
}

const aggiornaSuServer=async ()=>{
    const result = await fetch("/salva",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(utente)
    })
    if (result.status=="ok") console.log("ok")
    else console.log(result.status)
}

const accedi=()=>{
    let datiAccesso={}
    let mancante=false
    datiAccesso.username=document.getElementById("accediUsername").value
    datiAccesso.password=document.getElementById("accediPassword").value

    if (document.getElementById("accediUsername").value=="") mancante=true
    if (document.getElementById("accediPassword").value=="") mancante=true 

    if (!mancante){
        fetch("/accedi",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(datiAccesso)
        })
        .then(result=>result.json())
        .then(data=>{
            utente=JSON.parse(data)
            window.onbeforeunload=()=>logout()
            mostraHomeCarica()
            document.getElementById("accediUsername").value=""
            document.getElementById("accediPassword").value=""
            $('#modalAccesso').modal('hide')
        })
        .catch(err=>{
            $('#collapseDatiErrati').collapse('show')
            setTimeout(()=>$('#collapseDatiErrati').collapse('hide'),3000)
        })
    }
    else {
        $('#collapseDatiNonInseriti').collapse('show')
        setTimeout(()=>$('#collapseDatiNonInseriti').collapse('hide'),3000)
    }
    
}

logout=function(){
    let username={username: utente.accesso.username}
    utente={
        infoUtente: {},
        accesso: {},
        materie: []
    }
    fetch("/logout",{
        method: "POST",
        headers: {
            'Content-Type': 'Application/JSON'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(username)
    })
    .then(result=>{
        console.log(result)
        rimuoviTuttoGrafici()
    })
    .catch(err=>console.log(err))
}