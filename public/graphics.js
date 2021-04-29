//variabili globali
var listaDivSezioni=[
    "impostazioni",
    "homeSezione",
    "materie",
    "voti",
    "informazioni"
]
var materie=false

//funzioni grafiche
mostraHome=function(){
    let nuovoNome
    let nuovoCognome
    let nuovoClasse
    let nuovoScuola
    let nuovoUsername
    let nuovoPassword
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

    if (!mancante){
        document.getElementById("nuovoUtente").style.display="none"
        document.getElementById("home").style.display="block"
        mostraDivSezione("homeSezione")
        mostraInfoUtente()
        creaGrafici()
        if (utente.materie.length==0){
            materie=false
            mostraJumbotronNoMaterie()
        }
    }
    else {
        $('#collapseCompilaTutto').collapse("show")
        setInterval(()=>{
            $('#collapseCompilaTutto').collapse("hide")
        },3000)
    }
}

mostraHomeCarica=function(){
    document.getElementById("nuovoUtente").style.display="none"
    document.getElementById("home").style.display="block"
    mostraDivSezione("homeSezione")
    mostraInfoUtente()
    mostraImpostazioniVoti()
    creaGrafici()
    creaSezioneMaterie()
    creaSezionePrevisioneVotiInPagela()
    if (utente.materie.length!=0){
        mostraMediaGenerale()
        for (j=0;j<utente.materie.length;j++) calcolaProssimoVoto(utente.materie[j])
        for (i=0;i<utente.materie.length;i++) aggiornaGraficiAggiungiMateria(utente.materie[i].nome)
        for (i=0;i<utente.materie.length;i++) aggiornaGraficiMedia(utente.materie[i])
    }
    if (utente.materie.length==0){
        materie=false
        mostraJumbotronNoMaterie()
    }

}

mostraJumbotronNoMaterie=function(){
    let listaDivNo=document.getElementsByClassName("noMaterie")
    let listaDivSi=document.getElementsByClassName("siMaterie")

    for (i=0;i<listaDivNo.length;i++) listaDivNo[i].style.display="block"
    for (i=0;i<listaDivSi.length;i++) listaDivSi[i].style.display="none"
}

annullaMostraJumbotronNoMaterie=function(){
    let listaDivNo=document.getElementsByClassName("noMaterie")
    let listaDivSi=document.getElementsByClassName("siMaterie")

    for (i=0;i<listaDivNo.length;i++) listaDivNo[i].style.display="none"
    for (i=0;i<listaDivSi.length;i++) listaDivSi[i].style.display="block"
}

controllaVotoFunzione=function(){
    if (utente.materie.length>0) annullaMostraJumbotronNoMaterie()
}

mostraDivSezione=function(divMostra){
    for (i=0;i<listaDivSezioni.length;i++){
        document.getElementById(listaDivSezioni[i]).style.display="none"
    }

    document.getElementById(divMostra).style.display="inline"

    if (utente.materie.length==0) mostraJumbotronNoMaterie()
    else annullaMostraJumbotronNoMaterie()
}

mostraInfoUtente=function(){
    document.getElementById("labelMostraNome").innerText=utente.infoUtente.nome
    document.getElementById("labelMostraCognome").innerText=utente.infoUtente.cognome
    document.getElementById("labelMostraClasse").innerText=utente.infoUtente.classe
    document.getElementById("labelMostraScuola").innerText=utente.infoUtente.scuola
    mostraInfoImpostazioni()
}

mostraInfoImpostazioni=function(){
    document.getElementById("inputImpostazioniNome").value=utente.infoUtente.nome
    document.getElementById("inputImpostazioniCognome").value=utente.infoUtente.cognome
    document.getElementById("inputImpostazioniClasse").value=utente.infoUtente.classe
    document.getElementById("inputImpostazioniScuola").value=utente.infoUtente.scuola
}

mostraImpostazioniVoti=function(){
    document.getElementById("inputImpostazioniVotoPositivo").value=utente.infoUtente.votoPositivo
    document.getElementById("inputImpostazioniVotoAccettabile").value=utente.infoUtente.votoAccettabile
    document.getElementById("inputImpostazioniVotoNegativo").value=utente.infoUtente.votoNegativo
}

esci=function(){
    document.getElementById("inputNuovoNome").value=""
    document.getElementById("inputNuovoCognome").value=""
    document.getElementById("inputNuovoClasse").value=""
    document.getElementById("inputNuovoScuola").value=""
    document.getElementById("inputNuovoUsername").value=""
    document.getElementById("inputNuovoPassword").value=""

    document.getElementById("home").style.display="none"
    document.getElementById("nuovoUtente").style.display="block"
}

creaSezioneMaterie=function(){
    if (document.getElementById("accordionMaterie")!=null){
        document.getElementById("accordionMaterie").remove()
    }

    //questa funzione crea il "Collapsible group" delle materie
    let sezioneMaterie
    let cardMateria
    let cardHeaderMateria
    let cardHeaderh1Materia
    let cardHeadrButton
    let cardCollapse
    let cardCollapseBody
    let contenutoTab


    //elemento principale: il div dell'intera sezione
    sezioneMaterie=document.createElement("div")
    sezioneMaterie.className="accordion"
    sezioneMaterie.id="accordionMaterie"

    for (i=0;i<utente.materie.length;i++){
        //creazione degli elementi che poi verranno incapsulati
        cardMateria=document.createElement("div")
        cardHeaderMateria=document.createElement("div")
        cardHeaderh1Materia=document.createElement("h1")
        cardHeadrButton=document.createElement("button")
        cardCollapse=document.createElement("div")
        cardCollapseBody=document.createElement("div")

        //aggiunta degli attributi degli elementi
        cardMateria.className="card"

        cardHeaderMateria.className="card-header"
        cardHeaderMateria.id="header"+utente.materie[i].nome

        cardHeaderh1Materia.className="mb-0"

        cardHeadrButton.className="btn btn-link btn-block text-left contrasto"
        cardHeadrButton.type="button"
        cardHeadrButton.dataset.toggle="collapse"
        cardHeadrButton.dataset.target="#collapse"+utente.materie[i].nome
        cardHeadrButton.setAttribute("aria-expanded","true")
        cardHeadrButton.setAttribute("aria-controls","collapse"+utente.materie[i].nome)
        cardHeadrButton.innerText=utente.materie[i].nome

        cardCollapse.id="collapse"+utente.materie[i].nome
        cardCollapse.className="collapse"
        cardCollapse.setAttribute("aria-labelledy","headingOne")
        cardCollapse.setAttribute("data-parent","#accordionMaterie")

        contenutoTab=creaTabsMateria(utente.materie[i])

        cardCollapseBody.className="card-body"
        cardCollapseBody.appendChild(contenutoTab)

        //incapsulamento degli elementi
        cardHeaderh1Materia.appendChild(cardHeadrButton)
        cardHeaderMateria.appendChild(cardHeaderh1Materia)

        cardCollapse.appendChild(cardCollapseBody)

        cardMateria.appendChild(cardHeaderMateria)
        cardMateria.appendChild(cardCollapse)
        sezioneMaterie.appendChild(cardMateria)
    }

    document.querySelector("div#materie>div.siMaterie").appendChild(sezioneMaterie)
}

creaTabsMateria=function(materia){
    let elemento
    let ulTabs
    let liTabTrimestre
    let liTabPentamestre
    let aTabTrimestre
    let aTabPentamestre
    let divContenutoTab
    let divTrimestre
    let divPentamestre

    elemento=document.createElement("div")
    ulTabs=document.createElement("ul")
    liTabTrimestre=document.createElement("li")
    liTabPentamestre=document.createElement("li")
    aTabTrimestre=document.createElement("a")
    aTabPentamestre=document.createElement("a")

    divContenutoTab=document.createElement("div")
    divTrimestre=document.createElement("div")
    divPentamestre=document.createElement("div")

    ulTabs.className="nav nav-pills mb-3"
    ulTabs.setAttribute("role", "tablist")

    liTabTrimestre.className="nav-item"
    liTabTrimestre.setAttribute("role","presentation")

    aTabTrimestre.className="nav-link active"
    aTabTrimestre.dataset.toggle="pill"
    aTabTrimestre.href="#tabTrimestre"+materia.nome
    aTabTrimestre.setAttribute("role","tab")
    aTabTrimestre.setAttribute("aria-controls","tabTrimestre"+materia.nome)
    aTabTrimestre.setAttribute("aria-selected","true")
    aTabTrimestre.innerText="Trimestre"


    liTabPentamestre.className="nav-item"
    liTabPentamestre.setAttribute("role","presentation")

    aTabPentamestre.className="nav-link"
    aTabPentamestre.dataset.toggle="pill"
    aTabPentamestre.href="#tabPentamestre"+materia.nome
    aTabPentamestre.setAttribute("role","tab")
    aTabPentamestre.setAttribute("aria-controls","tabPentamestre"+materia.nome)
    aTabPentamestre.setAttribute("aria-selected","false")
    aTabPentamestre.innerText="Pentamestre"

    divContenutoTab.className="tab-content"
    divTrimestre.className="tab-pane fade show active"
    divTrimestre.id="tabTrimestre"+materia.nome
    divTrimestre.setAttribute("role","tabpanel")
    divTrimestre.setAttribute("aria-labelledby","pills-home-tab")
    divTrimestre.appendChild(creaTabTrimestre(materia))

    divPentamestre.className="tab-pane fade"
    divPentamestre.id="tabPentamestre"+materia.nome
    divPentamestre.setAttribute("role","tabpanel")
    divPentamestre.setAttribute("aria-labelledby","pills-home-tab")
    divPentamestre.appendChild(creaTabPentamestre(materia))

    liTabTrimestre.appendChild(aTabTrimestre)
    liTabPentamestre.appendChild(aTabPentamestre)
    ulTabs.appendChild(liTabTrimestre)
    ulTabs.appendChild(liTabPentamestre)

    divContenutoTab.appendChild(divTrimestre)
    divContenutoTab.appendChild(divPentamestre)

    elemento.appendChild(ulTabs)
    elemento.appendChild(divContenutoTab)
    
    return elemento
}

creaTabTrimestre=function(materia){
    let divContainer
    let divPrimaRiga
    let divMedia
    let h1Media
    let divVoti
    let rigaNumeroVoti
    let divVotiSufficienti
    let pVotiSufficienti
    let divVotiInsufficienti
    let pVotiInsufficienti
    let divObiettivo
    let labelInputObiettivo
    let inputObiettivo
    let h4ProssimoVoto
    let smallProssimoVoto
    let divInputGroupObiettivo
    let divAppend
    let buttonImpostaObiettivo
    let divTabella
    let pVoti
    let tabella

    divContainer=document.createElement("div")
    divPrimaRiga=document.createElement("div")
    divMedia=document.createElement("div")
    h1Media=document.createElement("h1")
    divVotiSufficienti=document.createElement("div")
    divVotiInsufficienti=document.createElement("div")
    rigaNumeroVoti=document.createElement("div")
    divVoti=document.createElement("div")
    pVotiSufficienti=document.createElement("p")
    pVotiInsufficienti=document.createElement("p")
    h4ProssimoVoto=document.createElement("h4")
    smallProssimoVoto=document.createElement("small")
    divInputGroupObiettivo=document.createElement("div")
    divAppend=document.createElement("div")
    buttonImpostaObiettivo=document.createElement("button")
    divTabella=document.createElement("div")
    pVoti=document.createElement("p")
    tabella=document.createElement("table")

    divObiettivo=document.createElement("div")
    labelInputObiettivo=document.createElement("label")
    inputObiettivo=document.createElement("input")

    divContainer.className="container fluid"
    divPrimaRiga.className="row"

    h1Media.id="h1MediaTrimestre"+materia.nome
    if (materia.trimestre.voti.length==0){
        h1Media.innerText="Nessun voto"
    }
    else h1Media.innerText=materia.trimestre.media
    divMedia.appendChild(h1Media)
    divMedia.className="col-md-4"

    divVoti.className="col-md-4"
    rigaNumeroVoti.className="row"

    pVotiSufficienti.id="pVotiSufficientiTrimestre"+materia.nome
    pVotiInsufficienti.id="pVotiInsufficientiTrimestre"+materia.nome
    pVotiSufficienti.innerText=materia.trimestre.votiSufficienti+" voti sufficienti"
    pVotiInsufficienti.innerText=materia.trimestre.votiInsufficienti+" voti insufficienti"
    divVotiSufficienti.className="col-md-12"
    divVotiInsufficienti.className="col-md-12"

    divVotiSufficienti.appendChild(pVotiSufficienti)
    divVotiInsufficienti.appendChild(pVotiInsufficienti)
    rigaNumeroVoti.appendChild(divVotiSufficienti)
    rigaNumeroVoti.appendChild(divVotiInsufficienti)
    divVoti.appendChild(rigaNumeroVoti)

    labelInputObiettivo.innerText="Obiettivo voto della materia"

    divInputGroupObiettivo.className="input-group mb-3"
    inputObiettivo.type="number"
    inputObiettivo.min="0"
    inputObiettivo.max="10"
    inputObiettivo.className="form-control"
    inputObiettivo.id="inputObiettivoTrimestre"+materia.nome
    inputObiettivo.placeholder="Obiettivo trimestre"
    if (materia.trimestre.obiettivo!=null) inputObiettivo.value=materia.trimestre.obiettivo
    divAppend.className="input-group-append"
    buttonImpostaObiettivo.className="btn btn-outline-secondary"
    buttonImpostaObiettivo.type="button"
    buttonImpostaObiettivo.addEventListener("click",()=>impostaObiettivoMateria(materia.nome,"trimestre"))
    buttonImpostaObiettivo.innerText="Imposta"

    divObiettivo.className="col-md-4"
    if (document.getElementById("inputObiettivoTrimestre"+materia.nome)!=null) h4ProssimoVoto.innerText=calcolaProssimoVoto(materia)
    else h4ProssimoVoto.innerText="-"
    h4ProssimoVoto.id="h4ProssimoVotoTrimestre"+materia.nome
    smallProssimoVoto.className="form-text text-muted"
    smallProssimoVoto.innerText="Il prossimo voto che devi prendere"

    tabella=creaTabellaMateria(materia.trimestre.voti,"Trimestre",materia.nome)
    pVoti.innerText="Voti presi in questo periodo in "+materia.nome
    divTabella.appendChild(pVoti)
    divTabella.appendChild(tabella)

    divAppend.appendChild(buttonImpostaObiettivo)
    divInputGroupObiettivo.appendChild(inputObiettivo)
    divInputGroupObiettivo.appendChild(divAppend)
    divObiettivo.appendChild(labelInputObiettivo)
    divObiettivo.appendChild(divInputGroupObiettivo)
    divObiettivo.appendChild(h4ProssimoVoto)
    divObiettivo.appendChild(smallProssimoVoto)

    divPrimaRiga.appendChild(divMedia)
    divPrimaRiga.appendChild(rigaNumeroVoti)
    divPrimaRiga.appendChild(divObiettivo)
    divContainer.appendChild(divPrimaRiga)
    divContainer.appendChild(divTabella)

    return divContainer
}

creaTabPentamestre=function(materia){
    let divContainer
    let divPrimaRiga
    let divMedia
    let h1Media
    let divVoti
    let rigaNumeroVoti
    let divVotiSufficienti
    let pVotiSufficienti
    let divVotiInsufficienti
    let pVotiInsufficienti
    let divObiettivo
    let labelInputObiettivo
    let inputObiettivo
    let h4ProssimoVoto
    let smallProssimoVoto
    let divInputGroupObiettivo
    let divAppend
    let buttonImpostaObiettivo
    let divTabella
    let pVoti
    let tabella

    divContainer=document.createElement("div")
    divPrimaRiga=document.createElement("div")
    divMedia=document.createElement("div")
    h1Media=document.createElement("h1")
    divVotiSufficienti=document.createElement("div")
    divVotiInsufficienti=document.createElement("div")
    rigaNumeroVoti=document.createElement("div")
    divVoti=document.createElement("div")
    pVotiSufficienti=document.createElement("p")
    pVotiInsufficienti=document.createElement("p")
    h4ProssimoVoto=document.createElement("h4")
    smallProssimoVoto=document.createElement("small")
    divInputGroupObiettivo=document.createElement("div")
    divAppend=document.createElement("div")
    buttonImpostaObiettivo=document.createElement("button")
    divTabella=document.createElement("div")
    pVoti=document.createElement("p")
    tabella=document.createElement("table")

    divObiettivo=document.createElement("div")
    labelInputObiettivo=document.createElement("label")
    inputObiettivo=document.createElement("input")

    divContainer.className="container fluid"
    divPrimaRiga.className="row"

    h1Media.id="h1MediaPentamestre"+materia.nome
    if (materia.pentamestre.voti.length==0){
        h1Media.innerText="Nessun voto"
    }
    else h1Media.innerText=materia.pentamestre.media
    divMedia.appendChild(h1Media)
    divMedia.className="col-md-4"

    divVoti.className="col-md-4"
    rigaNumeroVoti.className="row"

    pVotiSufficienti.id="pVotiSufficientiPentamestre"+materia.nome
    pVotiInsufficienti.id="pVotiInsufficientiPentamestre"+materia.nome
    pVotiSufficienti.innerText=materia.pentamestre.votiSufficienti+" voti sufficienti"
    pVotiInsufficienti.innerText=materia.pentamestre.votiInsufficienti+" voti insufficienti"
    divVotiSufficienti.className="col-md-12"
    divVotiInsufficienti.className="col-md-12"

    divVotiSufficienti.appendChild(pVotiSufficienti)
    divVotiInsufficienti.appendChild(pVotiInsufficienti)
    rigaNumeroVoti.appendChild(divVotiSufficienti)
    rigaNumeroVoti.appendChild(divVotiInsufficienti)
    divVoti.appendChild(rigaNumeroVoti)

    labelInputObiettivo.innerText="Obiettivo voto della materia"

    divInputGroupObiettivo.className="input-group mb-3"
    inputObiettivo.type="number"
    inputObiettivo.min="0"
    inputObiettivo.max="10"
    inputObiettivo.className="form-control"
    inputObiettivo.id="inputObiettivoPentamestre"+materia.nome
    inputObiettivo.placeholder="Obiettivo pentamestre"
    if (materia.pentamestre.obiettivo!=null) inputObiettivo.value=materia.pentamestre.obiettivo
    divAppend.className="input-group-append"
    buttonImpostaObiettivo.className="btn btn-outline-secondary"
    buttonImpostaObiettivo.type="button"
    buttonImpostaObiettivo.addEventListener("click",()=>impostaObiettivoMateria(materia.nome,"pentamestre"))
    buttonImpostaObiettivo.innerText="Imposta"

    divObiettivo.className="col-md-4"
    if (document.getElementById("inputObiettivoPentamestre"+materia.nome)!=null) h4ProssimoVoto.innerText=calcolaProssimoVoto(materia)
    else h4ProssimoVoto.innerText="-"
    h4ProssimoVoto.id="h4ProssimoVotoPentamestre"+materia.nome
    smallProssimoVoto.className="form-text text-muted"
    smallProssimoVoto.innerText="Il prossimo voto che devi prendere"

    tabella=creaTabellaMateria(materia.pentamestre.voti,"Pentamestre",materia.nome)
    pVoti.innerText="Voti presi in questo periodo in "+materia.nome
    divTabella.appendChild(pVoti)
    divTabella.appendChild(tabella)

    divAppend.appendChild(buttonImpostaObiettivo)
    divInputGroupObiettivo.appendChild(inputObiettivo)
    divInputGroupObiettivo.appendChild(divAppend)
    divObiettivo.appendChild(labelInputObiettivo)
    divObiettivo.appendChild(divInputGroupObiettivo)
    divObiettivo.appendChild(h4ProssimoVoto)
    divObiettivo.appendChild(smallProssimoVoto)

    divPrimaRiga.appendChild(divMedia)
    divPrimaRiga.appendChild(rigaNumeroVoti)
    divPrimaRiga.appendChild(divObiettivo)
    divContainer.appendChild(divPrimaRiga)
    divContainer.appendChild(divTabella)

    return divContainer
}

creaTabellaMateria=function(voti,periodo,nomeMateria){
    let tabella
    let riga
    let colonnaData
    let colonnaVoto
    let colonnaTipo

    tabella=document.createElement("table")
    tabella.className="table table-striped table-bordered"

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
        colonnaTipo=riga.insertCell(2)
        colonnaTipo.innerText=voti[j].tipo
    }

    tabella.id="tabellaVoti"+periodo+nomeMateria

    return tabella
}

preparaSelectMaterie=function(id){
    let select=document.getElementById(id)
    let dimensioneSelectRimuovi=select.length
    let opzioneAggiungi=document.createElement("option")

    //rimozione delle opzioni già dentro al select, in modo che venga aggiornato correttamente se si aggiunge una materia
    for (i=0;i<dimensioneSelectRimuovi;i++) select.remove(0)

    opzioneAggiungi.innerText="Scegli una materia..."
    select.appendChild(opzioneAggiungi)

    for (i=0;i<utente.materie.length;i++){
        opzioneAggiungi=document.createElement("option")
        opzioneAggiungi.innerText=utente.materie[i].nome
        select.appendChild(opzioneAggiungi)
    }
    if (id=="selectRimuoviVotoMateria"){
        select.addEventListener("change",(e)=>preparaSelectVoti(e.target.value,"selectRimuoviVotoVoto"))
    }
    if (id=="selectModificaVotoMateria"){
        select.addEventListener("change",(e)=>preparaSelectVoti(e.target.value,"selectModificaVotoVoto"))
    }
}

trovaIndirizzoMateria=function(materia){
    //funzione che restituisce l'indirizzo della materia passata come parametro
    for (i=0;i<utente.materie.length;i++){
        if (utente.materie[i].nome==materia) return i
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

chiudiModalCancellaVoto=function(){
    document.getElementById("selectRimuoviVotoVoto").value="Scegli un voto..."
}

preparaSelectVoti=function(nomeMateria,id){
    let select=document.getElementById(id)
    let opzione
    let indirizzoMateria=trovaIndirizzoMateria(nomeMateria)
    let dimensioneSelectRimuovi=select.length
    let stringaVoto

    //rimozione delle opzioni già dentro al select, in modo che venga aggiornato correttamente se si aggiunge una materia
    for (i=0;i<dimensioneSelectRimuovi;i++) select.remove(0)
    
    opzione=document.createElement("option")
    opzione.innerText="Scegli un voto..."
    select.appendChild(opzione)

    for (i=0;i<utente.materie[indirizzoMateria].trimestre.voti.length;i++){
        opzione=document.createElement("option")
        stringaVoto=getDatiVoto(utente.materie[indirizzoMateria].trimestre.voti[i])
        opzione.innerText=stringaVoto
        select.appendChild(opzione)
    }
    for (i=0;i<utente.materie[indirizzoMateria].pentamestre.voti.length;i++){
        opzione=document.createElement("option")
        stringaVoto=getDatiVoto(utente.materie[indirizzoMateria].pentamestre.voti[i])
        opzione.innerText=stringaVoto
        select.appendChild(opzione)
    }

    if (id=="selectModificaVotoVoto"){
        select.addEventListener("change",(e)=>mostraInformazioniAttualiVoto(e.target.value))
    }
}

creaSezionePrevisioneVotiInPagela=function(){
    let tabellaTrimestre
    let tabellaPentamestre
    let dimensioneTabella
    let nuovaRiga
    let colonnaMateria
    let colonnaVoto
    let previsioneVotoTrimestre
    let previsioneVotoPentamestre

    tabellaTrimestre=document.getElementById("previsioneVotiTrimestre")
    tabellaPentamestre=document.getElementById("previsioneVotiPentamestre")

    dimensioneTabella=tabellaTrimestre.rows.length
    for (i=0;i<dimensioneTabella;i++) tabellaTrimestre.deleteRow(-1)
    nuovaRiga=tabellaTrimestre.insertRow(-1)
    colonnaMateria=nuovaRiga.insertCell(0)
    colonnaMateria.innerText="Materia"
    colonnaVoto=nuovaRiga.insertCell(1)
    colonnaVoto.innerText="Voto"

    dimensioneTabella=tabellaPentamestre.rows.length
    for (i=0;i<dimensioneTabella;i++) tabellaPentamestre.deleteRow(-1)
    nuovaRiga=tabellaPentamestre.insertRow(-1)
    colonnaMateria=nuovaRiga.insertCell(0)
    colonnaMateria.innerText="Materia"
    colonnaVoto=nuovaRiga.insertCell(1)
    colonnaVoto.innerText="Voto"

    for (i=0;i<utente.materie.length;i++){
        nuovaRiga=tabellaTrimestre.insertRow(-1)
        colonnaMateria=nuovaRiga.insertCell(0)
        colonnaMateria.innerText=utente.materie[i].nome
        colonnaVoto=nuovaRiga.insertCell(1)
        previsioneVotoTrimestre=Math.round(utente.materie[i].trimestre.media)
        if (previsioneVotoTrimestre>0) {
            colonnaVoto.innerText=previsioneVotoTrimestre
            if (previsioneVotoTrimestre<utente.infoUtente.votoNegativo){
                //colonnaVoto.style.color="red"
                colonnaVoto.className="votoNegativo"
            }
            else if (previsioneVotoTrimestre>=utente.infoUtente.votoNegativo && previsioneVotoTrimestre<utente.infoUtente.votoAccettabile){
                //colonnaVoto.style.color="#ff6600"
                colonnaVoto.className="votoIntermedio"
            }
            else if (previsioneVotoTrimestre>=utente.infoUtente.votoAccettabile && previsioneVotoTrimestre<utente.infoUtente.votoPositivo){
                //colonnaVoto.style.color="yellow"
                colonnaVoto.className="votoAccettabile"
            }
            else if (previsioneVotoTrimestre>=utente.infoUtente.votoPositivo){
                //colonnaVoto.style.color="#00cc00"
                colonnaVoto.className="votoPositivo"
            }
        }
        else colonnaVoto.innerText="-"

        nuovaRiga=tabellaPentamestre.insertRow(-1)
        colonnaMateria=nuovaRiga.insertCell(0)
        colonnaMateria.innerText=utente.materie[i].nome
        colonnaVoto=nuovaRiga.insertCell(1)
        previsioneVotoPentamestre=Math.round(utente.materie[i].pentamestre.media)
        if (previsioneVotoPentamestre>0) {
            colonnaVoto.innerText=previsioneVotoPentamestre
            if (previsioneVotoPentamestre<utente.infoUtente.votoNegativo){
                //colonnaVoto.style.color="red"
                colonnaVoto.className="votoNegativo"
            }
            else if (previsioneVotoPentamestre>=utente.infoUtente.votoNegativo && previsioneVotoPentamestre<utente.infoUtente.votoAccettabile){
                //colonnaVoto.style.color="#ff6600"
                colonnaVoto.className="votoIntermedio"
            }
            else if (previsioneVotoPentamestre>=utente.infoUtente.votoAccettabile && previsioneVotoPentamestre<utente.infoUtente.votoPositivo){
                //colonnaVoto.style.color="yellow"
                colonnaVoto.className="votoAccettabile"
            }
            else if (previsioneVotoPentamestre>=utente.infoUtente.votoPositivo){
                //colonnaVoto.style.color="#00cc00"
                colonnaVoto.className="votoPositivo"
            }
        }
        else colonnaVoto.innerText="-"
    }
}

// creaGrafici=function(){
//     let graficoTrimestreDOM=document.getElementById("graficoTrimestre").getContext("2d")
//     //dataset: materia, con i dati della materia per mese
//     //labels per i dataset: nomi delle materie
//     //data dei dataset: voti per mese delle materie
    
//     let tempLabels=[]
//     let tempDataset={
//         label: null,
//         data: []
//     }

//     for (i=0;i<utente.materie.length;i++){
//         tempLabels.push(utente.materie[i].nome)
//     }
//     for (i=0;i<utente.materie.length;i++) {
//         tempDataset.label="Media"
//         tempDataset.data.push(utente.materie[i].trimestre.media) 
//     }

//     /* for (i=0;i<4;i++){ //i: mese
//         tempDataset={}
//         tempDataset.label=mesi[i]
//         for (j=0;j<utente.materie.length;j++) { //j: materia
//             //tempSomma=0
//             //numVotiMese=0

//             //impostazione dei voti in un dato mese
//             for (x=0;x<utente.materie[j].trimestre.voti.length;x++){ //x: voto
//                 dataVoto=utente.materie[j].trimestre.voti[x].data.split("-")
//                 console.log(dataVoto) 
//                 if (Number(dataVoto[1])==i+9) {
//                     console.log(true)
//                     tempSomma+=utente.materie[j].trimestre.voti[x].voto
//                     numVotiMese+=1
//                 }
//             }
//             tempDatasetData.push(utente.materie[j].trimestre.media)
//             //tempDatasetData.push(utente.materie[j].trimestre.media)
//         }
//         tempDataset.data=tempDatasetData
//         dataSets.push(tempDataset)
//         tempDataset.backgroundColor="red"
//     } */
//     document.getElementById('graficoTrimestre').innerText=""

//     var ctx = document.getElementById('graficoTrimestre').getContext('2d');
//             var myChart = new Chart(ctx, {
//                 type: 'bar',
//                 data: {
//                     labels: tempLabels,
//                     datasets: [{
//                         label: 'Media trimestre',
//                         data: tempDataset.data,
//                         backgroundColor: [
//                             'rgba(255, 99, 132, 0.2)',
//                             'rgba(54, 162, 235, 0.2)',
//                             'rgba(255, 206, 86, 0.2)',
//                             'rgba(75, 192, 192, 0.2)',
//                             'rgba(153, 102, 255, 0.2)',
//                             'rgba(255, 159, 64, 0.2)'
//                         ],
//                         borderColor: [
//                             'rgba(255, 99, 132, 1)',
//                             'rgba(54, 162, 235, 1)',
//                             'rgba(255, 206, 86, 1)',
//                             'rgba(75, 192, 192, 1)',
//                             'rgba(153, 102, 255, 1)',
//                             'rgba(255, 159, 64, 1)'
//                         ],
//                         borderWidth: 1
//                     }]
//                 },
//                 options: {
//                     scales: {
//                         yAxes: {
//                             beginAtZero: true,
//                             ticks: {
//                                 min: 0,
//                                 max: 10
//                             }
//                         }
//                     }
//                 }
//             });

//     console.log(graficoTrimestre)
// }
