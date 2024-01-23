let timer
let level=0
let score = 0
let round
let playerName= "Jane Doe"
let board = document.querySelector('#boardGame')
let nbBlock = 16
let sqrt = 100 / Math.sqrt(nbBlock)
let rando
let oldrand
let molesForLevelUp = 10
let victory = false
let defeat = false
let interval = 1000
let bloodtimer
let loosetimer
let tempo = 100
let highscore = 0
let highscore_value
let highscore_name
const sound = new Audio()

document.querySelector('#startGame').addEventListener('click', () => {
    //TODO permettre au joueur de rentrer son nom
    document.querySelector('#startGame').classList.add('none')
    for(let i = 1; i <= nbBlock; i++)
    {
        let element = `<div class='block' data-id='${i}'></div>`
        board.innerHTML += element
    }
    document.querySelectorAll('.block').forEach((block) => {
        block.style.width = `${sqrt-1}%`
        block.style.height = `${sqrt}%`
    })
    //localStorage.clear()
    checkHighscore()
    displayHighscore()
    gameStart()
})
function initGame()
{
    tempo = 100
    interval = 1000
    level = 0
    score = 0
    highscore = 0
    clearInterval(timer)
    gameStart()
}
function rand() {
    let max = nbBlock
    let min = 1
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function removeImageClass() {
    document.querySelector('.character').classList.remove('img1')
    document.querySelector('.character').classList.remove('img2')
    document.querySelector('.character').classList.remove('img3')
}
function removeCharacter() {
    document.querySelector('.character').removeEventListener('click', hammerDown)
    removeImageClass()
    document.querySelector('.character').classList.remove('character')
    clearInterval(timer)
    timer = setInterval(nextCharacter, interval)
}
function checkHighscore(){
    if(!localStorage.getItem("highscore_value")) {
        let hghscr = ["100", "80", "60", "40", "20"]
        let string = JSON.stringify(hghscr)
        localStorage.setItem("highscore_value", string)
        hghscr = ["Anonymous", "Anonymous", "Anonymous", "Anonymous", "Anonymous"]
        string = JSON.stringify(hghscr)
        localStorage.setItem("highscore_name", string)
    }
}
function displayHighscore()
{
    let highScore_json = localStorage.getItem("highscore_value")
    highscore_value = JSON.parse(highScore_json)
    highScore_json = localStorage.getItem("highscore_name")
    highscore_name = JSON.parse(highScore_json)
    let high = `<h3>HIGH SCORE</h3><table><tbody>`
    for(let i=0; i<highscore_value.length; i++)
    {
        high += `<tr><td>`+highscore_name[i]+`</td><td>`+highscore_value[i].toString()+`</td></tr>`
    }
    high += `</tbody></table>`
    document.getElementById("highscore").innerHTML = high
}
function setHighscore()
{
    if(localStorage.getItem("highscore_value"))
    {
        let highScore_json = localStorage.getItem("highscore_value")
        highscore_value = JSON.parse(highScore_json)
        highScore_json = localStorage.getItem("highscore_name")
        highscore_name = JSON.parse(highScore_json)
        for(let i=0; i<highscore_value.length; i++)
        {
            if(highscore>parseInt(highscore_value[i]))
            {
                highscore_value.splice(i, 0, highscore.toString())
                highscore_name.splice(i, 0, playerName)
                highscore_value.pop()
                highscore_name.pop()
                let highStr = JSON.stringify(highscore_value)
                localStorage.setItem("highscore_value", highStr)
                highStr = JSON.stringify(highscore_name)
                localStorage.setItem("highscore_name", highStr)
                break
            }
        }
    }
}
function displayDefeat()
{
    if(tempo > 0)
    {
        if(document.getElementById('affichageResultat').classList.contains('none'))
        {
            if(tempo == 10)
            {
                   document.getElementById('timer').classList.add('clignotant')
            }
            tempo--
            document.getElementById('timer').innerHTML = tempo.toString()
            loosetimer = setTimeout(displayDefeat, 1000)
        }
    }
    else
    {
        document.getElementById('timer').classList.remove('clignotant')
        document.body.classList.remove('hammer')
        document.getElementById('affichageResultat').innerHTML = "<div class='flex'><h1>Vous avez perdu !</h1>" + "<button id=\"continue\">Continue</button></div>"
        document.getElementById('continue').addEventListener('click', initGame)
        if(document.getElementById('affichageResultat').classList.contains('none'))
        {
            document.getElementById('affichageResultat').classList.remove('none')
            document.querySelector('.character').removeEventListener('click', hammerDown)
            removeImageClass()
            document.querySelector('.character').classList.remove('character')
        }
        clearInterval(timer)
        playerName = prompt("Veuillez entrer votre nom");
        setHighscore()
        displayHighscore()
    }

}
function displayVictory() {
    playSound('Victory')
    clearInterval(timer)
    document.getElementById('affichageResultat').classList.remove('none')
    document.getElementById('affichageResultat').innerHTML = "<div class='flex'><h1>Bravo, vous passez au niveau suivant !</h1>" + "<button id=\"continue\">Continue</button></div>"
    document.getElementById('continue').addEventListener('click', gameStart)
    document.body.classList.remove('hammer')
}
function removeBlood()
{
    document.querySelector('.blood').classList.remove('blood')
}
function playSound(file) {
    switch(file)
    {
        case 'blood':
            sound.src =`./public/audio/blood.mp3`
            break
        case 'Victory':
            sound.src =`./public/audio/Victory.mp3`
            break
        default:
            break
    }

    let playPromise = sound.play()

    if (playPromise !== undefined) {
        playPromise.then(_ => {
        })
            .catch(error => {
                console.log(error)
            });
    }
}
function hammerDown() {
    playSound('blood')
    document.querySelector('.character').classList.add('blood')
    bloodtimer = setTimeout(removeBlood, 300)
    removeCharacter()
    score++
    highscore = score
    document.getElementById('score').innerHTML = score.toString()
    if(score >= molesForLevelUp*level)
        displayVictory()
    else
        displayCharacter()
}
function displayCharacter() {
    if(rando)
    {
        do {
            rando = rand().toString()
        }while(oldrand == rando)
    }
    else
    {
        rando = rand().toString()
    }
    oldrand = rando
    let block = document.querySelector(`[data-id='${rando}']`)
    block.classList.add('character')
    let image = Math.floor((Math.random() * 3)+1)
    document.querySelector('.character').classList.add('img'+image.toString())
    document.querySelector('.character').addEventListener('click', hammerDown)
}
function nextCharacter() {

    removeCharacter()
    displayCharacter()
    if(score>0)
        score--
    document.getElementById('score').innerHTML = score.toString()
}
function gameStart() {
    document.body.classList.add('hammer')
    if(level!==0) {
        document.getElementById('continue').removeEventListener('click', gameStart)
        if(interval>500)
            interval-=50
    }

    loosetimer = setTimeout(displayDefeat, 1000)
    timer = setInterval(nextCharacter, interval)
    document.getElementById('affichageResultat').classList.add('none')
    level++
    document.getElementById('level').innerHTML = "Level "+level.toString()
    displayCharacter()
}

