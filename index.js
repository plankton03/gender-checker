
const basicURL = 'https://api.genderize.io/'

window.onload = function(){
    updateSavedResultsBox()
    showMessage('info', 'Welcome to Genderize!')
}


function OnSubmit(button){
    form = document.getElementById("submission-form")
    
    console.log(button.name + " button")
    updateResultsBox(form["name"].value)
    showMessage('info', 'Name submitted')
}

function OnSave(button){
    form = document.getElementById("submission-form")
    name = form["name"].value
    gender = form["gender"].value
    probability = 0
    console.log(button.name + " button")
    if (gender === ""){
        gender = document.getElementById('result-gender').innerHTML
        probability = document.getElementById('result-probability').innerHTML
    }
    console.log(name, gender, probability)
    saveRecordToLocalStorage(name, gender, probability)
    showMessage('info', 'Name saved')
    resetForm(form)
    updateSavedResultsBox()
}

function resetForm(form){
    form.reset()
}

function ResetSavedResults(){

    resetLocalStorage()
    updateSavedResultsBox()
    showMessage('warn', 'Saved name cleared')
}


function saveRecordToLocalStorage(name, gender, probability) {
    localStorage.setItem("previous_name", `{"name": "${name}" , "gender" :"${gender}", "probability":"${probability}"}`)
}

function resetLocalStorage(){
    localStorage.removeItem('previous_name')
}

function getSavedResult(){
    saved = localStorage.getItem("previous_name")
    if ( saved === null) {
        return {error:"No Results"}
    } 

    lsobj = JSON.parse(saved)
    return lsobj
}

function updateSavedResultsBox(){
    prevRes = getSavedResult()
    console.log(prevRes)
    res = ''
    if(prevRes.error === undefined ){res = `${prevRes.name} : ${prevRes.gender}`}
    else{
        res = prevRes.error
    }
    document.getElementById('saved-results-box').innerHTML = res
}

function updateResultsBox(name){
    prevRes = getSavedResult()
    console.log(prevRes)

    if (prevRes.name === name){
        document.getElementById('result-gender').innerHTML = prevRes.gender
        document.getElementById('result-probability').innerHTML = prevRes.probability
        return
    }

    getDataFromAPI(name)
        .then(data =>{
            console.log(data)
            if (data.gender === 'male'){
                document.getElementById('result-gender').innerHTML =  'Man'
                document.getElementById('result-probability').innerHTML = data.probability
            }else{
                document.getElementById('result-gender').innerHTML =  'Woman'
                document.getElementById('result-probability').innerHTML = data.probability
            }
        return
    }).catch(error => {
        showMessage('error', error.Error)
    })
    
}

function getDataFromAPI(name){
    return fetch(basicURL+ `?name=${name}`, {
        method: 'GET',
    }).then(res => {
        if (!res.ok){
            resp = res.json()
            console.log(resp)
            throw new Error(`Error: API response was not ok!, ${error.error}`)
        }

        return res.json()
    }).catch(error => {
        showMessage('error', error)
    })
    
}

function showMessage(type, msg){
    var messageBox = document.getElementById('bottom-message-box')
    var msgStyle
    if (type === 'info'){
        msgStyle = 'info-box'
    }else if(type === 'warn'){
        msgStyle = 'error-box'
    }
    messageBox.className = msgStyle
    messageBox.innerHTML = msg
    messageBox.style.opacity = 100
    messageBox.setAttribute('hidden', 'false')
    setTimeout(() => {
        messageBox.style.opacity = 0
    }, 5000);
}