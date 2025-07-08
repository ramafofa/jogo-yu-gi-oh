const state = {
    score:{
        playerScore:0,
        computerScore:0,
        scoreBox: document.getElementById("score_points"),
    },
    cardsSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
    player1: "player-cards",
    computer: "computer-cards",
    },
    actions:{
    button:document.getElementById("next-duel"),
    },
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
}
const pathImages = "./src/assets/icons/"
const cardData = [
    {
        id:1,
        name:"Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf:[0],
        loseOf:[2],
    },
    {
        id:2,
        name:"Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf:[1],
        loseOf:[0],
    },
      {
        id:0,
        name:"Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf:[2],
        loseOf:[1],
    },
];

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random()*cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard,fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height","100px");
    cardImage.setAttribute("src","./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");


    if(fieldSide === playerSides.player1){
         cardImage.addEventListener("mouseover",()=>{
        drawSelectedCard(IdCard);
         });
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }
    return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResult = await checkDuelResult(cardId,computerCardId);

    await updateScore();
    await drawButton(duelResult);
}

async function checkDuelResult(playercardId, computerCardId){
    let duelResults = "Draw";
    let playerCard = cardData[playercardId];

    if(playerCard.winOf.includes(computerCardId)){
        duelResults = "win";
        await playAudio(duelResults);
        state.score.playerScore++;
    }

    if(playerCard.loseOf.includes(computerCardId)){
        duelResults = "lose";
        await playAudio(duelResults);
        state.score.computerScore++;
    }

    return duelResults;
}

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";

}

async function updateScore(){
    state.score.scoreBox.innerText = `Venceu: ${state.score.playerScore} | Perdeu: ${state.score.computerScore}`;
}

async function removeAllCardsImages() {
    let cards = document.querySelector("#computer-cards");
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img)=>img.remove());

    cards = document.querySelector("#player-cards");
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img)=>img.remove());
}

async function drawSelectedCard(index) {
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = "Atribute : " + cardData[index].type;
}

 async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers ; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel(){
    state.cardsSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play()
}

function init(){
    drawCards(5,playerSides.player1);
    drawCards(5,playerSides.computer);
    const bgm = document.getElementById("bgm");
    bgm.play();
}

init()
