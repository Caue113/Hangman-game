/**
 *  TO-DO
 *      Finish Game logic;
 *      Finish Interface Updates;
 *      Create Visuals with Canvas;
 *      Implement Player 1 Mechanics and option to choose;
 *      Reorganize javascript files; 
 * 
 */


/**
 * A word class to be storaged in database.
 */
class Word {
    /**@type {string} The word itself */
    word;
    /**@type {string} The theme/genre of the word */
    type;

    constructor(word, type){
        this.word = word;

        type != null ? this.type = type : this.type = "No type specified";
    }
    
}

//HTML Interface Variables - Player 2
let roundNumber = document.getElementById("roundNumber");

let txtSecretWord = document.getElementById("txtSecretWord");
let txtChancesLeft = document.getElementById("txtChancesLeft");
let txtLettersAlreadyTyped = document.getElementById("txtLettersAlreadyTyped");

let inputPlayer2 = document.getElementById("inputPlayer2");
let btnGuess = document.getElementById("btnGuess");


//Game Configurations. Check readme.md for magic numbers
let playerLifes = 6;


//Game variables
/**
 * @type {number} The current number of the round.
 */
let currentRoundNumber = 1;
/**
 * @type {string} The player input letter
 */
let inputLetter = "";
/**
 * @type {string} A list of already typed letters by the player
 */
let typedLetters = [];
/**
 * @type {Object} The original secret word chosen by Player 1 or randomly set by computer.
 */
let secretWord;
/**
 * @type {string} The secret word shown to Player 2. Its letters must be hidden until Player 2 guesses them.
 */
let dummySecretWord = "";



/**@type {HTMLCanvasElement} */
const canvasHTML = document.getElementById("canvas");

/**
 * @type {Array<string>}
 * Categories that describe the words 
 */
let wordType = {
    animal : "Animal",
    food : "Food",
    city : "City",
    country : "Country",
    place : "Place",
    object : "Object",
    person : "Person",
    character : "Character",
    color : "Color",
    flag :  "Flag",
    book : "Book",
    movie : "Movie",
    game : "Game",
    body_part: "Body Part",
};

/**
 * @type {Array}
 * The full list of words to access. Each entry is an object.
 */
let words = [
    new Word("Hair", wordType.body_part),
    new Word("Germany", wordType.country),
    new Word("Blue", wordType.color),
    new Word("Banana", wordType.banana),
    new Word("Duke Nukem", wordType.game),
    new Word("Bunny", wordType.animal),
    new Word("Cow", wordType.animal),
    new Word("Brazil", wordType.country),
    new Word("Chocolate", wordType.food),
    new Word("Mahatma Gandhi", wordType.person),
    new Word("Nikola Tesla", wordType.person),
    new Word("Albert Einstein", wordType.person),
    new Word("Minecraft", wordType.game),
    new Word("Star Wars", wordType.movie),
    new Word("Home Alone", wordType.movie)
];

/**
 * @type {Array<States>}
 * An array containing canvas path drawings of the stick buddy. Each index represents
 * a different limb
 * 
 */
 let stickBuddyStates = [
    {
        1:
        {
            "draw": () => {
            }
        }
    }
];





//Fallback to get canvas context, recommended by Mozilla Docs
if (canvasHTML.getContext("2d")) {
    //var NOT reccomended. im using because scopes and i dont want everything inside a single if right now
    var ctx = canvasHTML.getContext("2d");
}
else {
    alert("Seu navegador não suporta Canvas :[");
}


//Player 1 code -- Defining what the logic to present and get the inputs


function Start() {

    //The machine selects a random word
    secretWord = selectRandomSecretWord();
    dummySecretWord = HideWord(secretWord.word);

    UpdateAllUI();


    
    btnGuess.addEventListener("click", ()=>{GuessTheLetter(inputPlayer2.value)});
}

/**
 * @param {string} letter The typed letter by player 2
 */
function GuessTheLetter(letter)
{
    //Get input
    //Validate input
    
    console.log("flux start: ", letter);
    letter = letter.toLowerCase();


    //"If guard" zone. Must clean later
    if(!isCharacterValid(letter))
    {
        console.log("invalid input");
        return;
    }

    //Check if input has already been typed
    if(typedLetters.includes(letter))
    {
        console.log("Already typed letter!");
        return;
    }
    else
    {
        console.log("Added: ", letter);

        typedLetters.push(letter);
        UpdateTypedLetters();
    }
    

    BuildDummyWord();

    


    //Sucess and Mistake
    if(hasPlayerFoundALetter(letter))
    {
        console.log("Hooray, you got a letter!");
        
    }
    else
    {
        console.log("Ooh shoot. That wasn't in the secret word");
        playerLifes--;
        //stickState++;
    }

    //I suppose that all validations are right so we can go 1 round independently
    currentRoundNumber++;
    
    

    




    UpdateAllUI();
}

/**
 * Selects a random word object from words[] from index = 0 to words.length 
 * @returns A random word object from words[].
 */
function selectRandomSecretWord()
{
    //Script to get random integers by W3Schools. Slightly edited
    let rng = Math.floor(Math.random() * (words.length - 0 + 1) ) + 0;

    return words[rng];
}

/**
 * @param {string} character [OBLIGATORY] The character to test. 
 * @param {RegExp} filter [Optional] A regular expression string filter to which you want apply on the character. Default regex is lowercase letters [a-z].
 * @returns The function returns a bool
 */
function isCharacterValid(character, filter = /[a-z]/)
{
    let isValid = filter.test(character);

    return isValid;    
}

/**
 * Visually updates all fields in screen interface
 */
function UpdateAllUI()
{
    UpdateCurrentRound();
    UpdateChancesLeft();
    UpdateTypedLetters();
    UpdateDummySecretWord();

    //UpdateHangman();
}

function UpdateCurrentRound()
{
    roundNumber.innerText = currentRoundNumber.toString();
}

function UpdateChancesLeft()
{
    txtChancesLeft.innerText = playerLifes.toString();
}

function UpdateTypedLetters()
{
    let tempStr = "";

    //Método O(n) para atualizar texto. Utilize string.append() para tornar um O(1).
    typedLetters.forEach(letter => {
        tempStr += letter;
    });

    txtLettersAlreadyTyped.innerText = tempStr;

}

function UpdateDummySecretWord()
{
    

    txtSecretWord.innerText = dummySecretWord.toString();
}

/**
 * 
 * @param {String} word The string you want to hide 
 * @param {String} symbol A single character to substitue the entire string as that symbol
 * @returns a string with same length replaced with 'Symbol'
 */
function HideWord(word, symbol = '#')
{
    let encryptedWord = "";

    word.split("").forEach(() =>{
        encryptedWord += symbol;
    })
    return encryptedWord;
}

/**
 * Updates the dummy word to either reveal new characters or keep the hidden ones
 */
function BuildDummyWord()
{
    let typedChar = inputPlayer2.value;
    
    let buildStr = "";
    
    //Build string to replace dummy with original
    for (let i = 0; i < secretWord.word.length; i++) {
        let char = secretWord.word.toLowerCase().charAt(i);
    
        if(typedChar == char)
            buildStr += secretWord.word.substring(i, i + 1);
        else
            buildStr += dummySecretWord.substring(i, i + 1);
        
        console.log("buildStr: ", buildStr);
    }

    dummySecretWord = buildStr;  
}

/**
 * Checks if the player's input match a character from the secret word
 * @param {string} inputLetter The player 2 input. 
 * @returns true or true
 */
function hasPlayerFoundALetter(inputLetter)
{
    if(secretWord.word.toLowerCase().includes(inputLetter))
        return true;
    else
        return false;
}



/*

@param {string} flag

function DrawFlag(flag) {
    //Clear canvas for next flag
    ClearCanvas();

    flag = flag.toUpperCase();

    for (let i = 0; i < flagDrawPaths.length; i++) {
        if (flagDrawPaths[i][flag] != undefined) {
            console.log("Desenhando bandeira: ", flag)
            flagDrawPaths[i][flag].draw();
        }
    }
}

*/

function ClearCanvas() {
    ctx.clearRect(0, 0, canvasHTML.width, canvasHTML.height);
}


































/*
Reference canvas codes

fillStyle   --Enche o retangulo com algum estilo (cor)
fillRect    --Desenha o retangulo
clearRect   --"Apaga" onde deseja do retangulo
strokeRect  --Borda do retângulo


beginPath   --Inicia forma livre
closePath   --Finaliza forma livre

stroke      --Desenha fazendo a borda
fill        --Desenha a forma enchendo seu conteudo

moveTo      --Move cursor para uma posicao [X,Y]
lineTo      --Faz uma linha do ponto atual "p" até o ponto desejado "p2" [Px, Py]

arc         --Desenha um arco com sua posição e centro. Útil para circulos
arcoTo      --Desenha um arco do ponto atual "p" com um destino "p2"

quadracticCurveTo   --Desenha um bézier quadratico do ponto atual ate o desejado. Este bézier usa apenas 1 ponto de controle para ambos vértices se alinharem (simétrico)
bezierCurveTo       --Desenha um bézier quadrático etc. Essa função possui dois pontos de controle, um para cada vértice. 

*/