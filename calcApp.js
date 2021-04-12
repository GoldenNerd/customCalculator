"use strict";

// global variables
let keyPressed;
let operand1=null;
let operand2=null;
let operator=null;
let finalResult=null;
let preservedFinalResult=null;
let preservedEqualsResult=null;
let currentOpKey=null;
let numInMem=null;
let subtotal=null;
let previousOpKey=null;
let keyFormatListenerFlag;
let previousOperand;

// Flags used by operators event listeners
let keyPressedUnary=null;
let keyPressedNumber=false;
let keyPressedDot=false;
let keyPressedExp=false;
let keyPressedChgSign=false;
let keyPressedBackspace=false;
let keyPressedInv=false;
let keyPressedSqrt=false;
let keyPressedSquare=false;
let keyPressedAdd=false;
let keyPressedSubstract=false;
let keyPressedMultiply=false;
let keyPressedDivide=false;
let keyPressedPercentage=false;
let keyPressedEquals=false;
let keyPressedMS=false;
let keyPressedMR=false;
let keyPressedMC=false;
let keyPressedFormat=false;

// Grab debugg items
const lastOpDebug = document.querySelector('#last-op-debug');
const lcdDebug = document.querySelector('#lcd-debug');
const operand1Debug = document.querySelector('#operand1Debug');
// const mainAccDebug = document.querySelector('#mainAccDebug');
const operand2Debug = document.querySelector('#operand2Debug');
// const minusAccDebug = document.querySelector('#minusAccDebug');
const opNowDebug = document.querySelector('#opNowDebug');
// const divAccDebug = document.querySelector('#divAccDebug');
const resultDebug = document.querySelector('#resultDebug');
// const dotAccDebug = document.querySelector('#dotAccDebug');
const subTot=document.querySelector('#sub-tot');

// Grab memory and format keys
const keyMS = document. querySelector('#ms');
const keyMR = document.querySelector('#mr');
const keyMC = document.querySelector('#mc');
const keyFormat = document.querySelector('#scissors1');

// Grab number keys
const key0 = document.querySelector('#key0');
const key1 = document.querySelector('#key1');
const key2 = document.querySelector('#key2');
const key3 = document.querySelector('#key3');
const key4 = document.querySelector('#key4');
const key5 = document.querySelector('#key5');
const key6 = document.querySelector('#key6');
const key7 = document.querySelector('#key7');
const key8 = document.querySelector('#key8');
const key9 = document.querySelector('#key9');
const dotKey = document.querySelector('#dotKey');
const expKey = document.querySelector('#expKey');

// Grab binary operation keys
const sumKey = document.querySelector('#sum');
const minusKey = document.querySelector('#minus');
const multiplyKey = document.querySelector('#multiply');
const divideKey = document.querySelector('#divide');
const equalKey = document.querySelector('#equal');
const percentageKey = document.querySelector('#percentage');

// Grab unary operation keys
const clearKey = document.querySelector('#clear');
const changeSignKey = document.querySelector('#change-sign');
const backspaceKey = document.querySelector('#backspace');
const invertKey = document.querySelector('#invert');
const sqrtKey = document.querySelector('#sqrt');
const squareKey = document.querySelector('#square');

// Grab items to display the last operator on LCD
const lastOpDispl = document.querySelector('#lastOpDispl');
// Grab LCD to display calculation numbers and signs
const lcd=document.querySelector('#lcd');
// Notifications area
const notificationText=document.querySelector('#notification-text');
const notificationAreaStyle=document.querySelector ('#notification-area').style;

// English language messages:
const engMsgs = {
/* there are 3 message categories:
inf - Informational; informs the user that Calc performed an action to correct a minor mistake by the user, and no further action is required by the user.
int - Interventional; Calc detected user entries that are abnormal, but it can recover from the entry error if the user does a simple correction.
fat - Fatal: Calc detected anomaly in the user entries and is unable to recover from the errors. Consequently it had to terminate the current calculation and reset to start a new whole calculation. It could also request user to reset Calculator and start all over again.
clr - Clear the notification area.
tst - Test message for debugging purposes
*/
inf00: `           😁 Welcome to EASYCALC 😁
           Your arithmetics assistant.
               For help press ❔`,
inf01: `Error, nothing was saved.\nBut saving nothing erases memory.`,
inf02: `
                   ⚠  Error
       There is nothing in memory.
       continue.`,
inf03: `Your duplicate dot was ignored. \nContinue.`,
inf04: `Your duplicate 'e' was ignored. Continue.`,
int00: `Error. The number of decimal digits of your original number was not that large. \n Please try with a smaller number.`,
int01: `For a positive exponent delete negative sign using backspace key.`,
int02: `Now in Recycle Mode. Press your key again to modify the final result.`,
int03: `
                   ⚠  Error
       Try again with a non zero value.`,
int04: ` ⚠  Error.
Try again with a non zero value. Entry so far:
${operand1} ${operator}`,
int05: `                   ⚠  Error.
 Only positive numbers for square root operator.
 Modify your number, or clear to try again.`,
int06: `
      You need a number on display to use this feature!`,
int07: `
      ⚠ Your first entry must be a number or a dot!`,
int08: `ERROR! You had already entered an operator. Entries so far:\n${operand1} ${keyPressed}
To continue: Enter your next number, OR\nPress the operator you really wanted.`,
fat00: `             ⚠  Error.\n              Divide by zero is not allowed.\n              I had to cancel your calculation.`,
fat01: `⚠  Error. Two numbers and an operator are required to perform a calculation. Clear and start all over again.`,
fat02: `
                   ⚠  Error
       Calculation canceled. You attempted to divide by zero.
       Enter a number a for new calculation.`,
fat03: `⚠  Error. Two numbers and an operator are required to perform a calculation. Clear and start all over again.`,
fat04: `Error:\nThis Calculator  version can only handle integer exponentials.`,
clr00: ``,
tst00: `Notice!\nThis is a mocked error message\nIt is for test purposes only.`
};

// Spanish language messages:
const spaMsgs = {
/* there are 3 message categories:
inf - Informational; informs the user that Calc performed an action to correct a minor mistake by the user, and no further action is required by the user.
int - Interventional; Calc detected user entries that are abnormal, but it can recover from the entry error if the user does a simple correction.
fat - Fatal: Calc detected anomaly in the user entries and is unable to recover from the errors. Consequently it had to terminate the current calculation and reset to start a new whole calculation. It could also request user to reset Calculator and start all over again.
clr - Clear the notification area.
tst - Test message for debugging purposes
*/
inf00: `           😁 Bienvenido a FÁCIL CALC 😁
           Su asistente aritmético.
               Para ayuda presione❔`,
inf01: `Error, no se guardó nada.\nPero salvar nada a la memoria borra la memoria.`,
inf02: `
                   ⚠  Error
       No es posible. No había nada en memoria.
       continue.`,
inf03: `El punto que repitió fué ignorado. \nContinue.`,
inf04: `La 'e' que repitió fué ignorada. Continue.`,
int00: `Error. La cantidad de lugares decimales del número original no era tan grande. \n Por favor trate de nuevo con un número más pequeño.`,
int01: `Para que el exponencial sea positivo, elimine el signo negativo borrándolo con la tecla de borrar.`,
int02: `Calc ahora en Modo de Reciclaje.  Presione su tecla nuevamente para modificar el resultado final.`,
int03: `
                   ⚠  Error
       Trate nuevamente con un valor que no sea cero.`,
int04: ` ⚠  Error.
Trate nuevamente con un valor que no sea cero. Datos al presente:
${operand1} ${operator}`,
int05: `                   ⚠  Error.
 Solo números positivos para el operador raíz cuadrada.
 Modifique su número y trate otra vez.`,
int06: `
      ¡Se requiere un número en pantalla para utilizar esta función!`,
int07: `
      ⚠ ¡Lo primero que escriba debe ser un número o un punto!`,
int08: `Error. Usted ya había entrado un operador. Lo que ha entrado hasta ahora es:\n${operand1} ${keyPressed}\n
Para continuar: Entre su próximo número, O\nPresione el operador que necesitaba.`,

fat00: '             ⚠  Error.\n              No es posible dividir por cero.\n              Tuve que cancelar su cálculo.',
fat01: '⚠  Error. Se requieren dos números y un operador para obtener un resultado final. Oprima la tecla "C", y comience de nuevo.',
fat02: `
                   ⚠  Error
       Operación cancelada. Usted intentó dividir por cero.
       Entre un número para iniciar un nuevo cálculo.`,
fat03: '⚠  Error. Se requieren dos números y un operador para realizar un cálculo. Oprima la tecla "C", y comience de nuevo.',
fat04: `Error:\nEsta version de FÁCIL CALC solo puede manejar exponenciales enteros.`,
clr00: ``,
tst00: `¡Atención!\nEste es la simulación de un mensaje de error.\nTan solo con propósitos de prueba.`
};

// Notification colors
const notifColors = {
infColor: {bgColor: 'var(--noti-board-bg)', fontColor: `var(--noti-greeting-txt-color)`},
intColor: {bgColor: 'var(--noti-board-bg)', fontColor: 'orange'}, 
fatColor: {bgColor: 'var(--noti-fatal-error-bg-color:)', fontColor: 'var(--noti-fatal-error-txt)'}, 
clrColor: {bgColor: 'transparent', fontColor: 'transparent'}, 
tstColor: {bgColor: 'blue', fontColor: 'yellow'},
greetColor: {bgColor: 'var(--noti-greeting-bg-color)', fontColor: 'var(--noti-greeting-txt-color)'},
};

// Post a notification
function postANotification (msgCode, bgColr, fontColr){
if(englishLanguageRadio.checked){
notificationText.innerHTML=engMsgs[ `${msgCode}`];
}else if(spanishLanguageRadio.checked){
notificationText.innerHTML=spaMsgs[ `${msgCode}`];
}else{
//NOP
}
/*
notificationAreaStyle.backgroundColor='blue';
notificationText.style.color='yellow';
*/
notificationAreaStyle.backgroundColor=bgColr;
notificationText.style.color=fontColr;
return;}
 
// Axiliary function of reset:
function updDebug (){
lastOpDispl.innerHTML = operator; // magenta colored last op on LCD upper left hand corner
// DEVELOPER DEBUG VISIBILITY:
lastOpDebug.innerHTML =operator;
lcdDebug.innerHTML = lcd.innerHTML;
operand1Debug.innerText = operand1;
operand2Debug.innerHTML = operand2;
opNowDebug.innerText = operator;
resultDebug.innerHTML = finalResult;

subTot.innerHTML=subtotal; // Part of the app
return;
}

function eraseNotification (){
postANotification('clr00', notifColors.clrColor.bgColor, notifColors.clrColor.fontColor);
// notificationText.innerHTML = '';
// notificationAreaStyle.backgroundColor='transparent';
}

function defaultKeysColor (){
const allOpKeys=document.querySelectorAll('.key');
for (let key of allOpKeys) {
  key.style.color='var(--all-key-symbols-default-color)';
}
}

function greet (){
postANotification('inf00', notifColors.infColor.bgColor, notifColors.infColor.fontColor);
/*
notificationText.innerHTML=`           😁 Welcome to EASYCALC 😁
           Your arithmetics assistant.
               For help press ❔`;
*/
// notificationText.style.color='var(--noti-greeting-txt-color)';
// notificationAreaStyle.backgroundColor='var(--noti-greeting-bg-color)';
}

function resetCalculator (){
operand1=null;
operand2=null;
operator=null;
finalResult=null;
preservedEqualsResult=null;
keyPressedUnary=null;
keyPressedNumber=false;
keyPressedDot=false;
keyPressedExp=false;
keyPressedChgSign=false;
keyPressedBackspace=false;
keyPressedInv=false;
keyPressedSqrt=false;
keyPressedSquare=false;
keyPressedAdd=false;
keyPressedSubstract=false;
keyPressedMultiply=false;
keyPressedDivide=false;
keyPressedPercentage=false;
keyPressedEquals=false;
keyPressedMS=false;
keyPressedMR=false;
keyPressedMC=false;
keyPressedFormat=false;
lcd.innerHTML=null;
eraseNotification();
subtotal=null;
updDebug();
lastOpDispl.innerHTML = 'C';
keyFormat.removeEventListener('click', enterFormatModal);
keyFormatListenerFlag=false;
hideAppSettingsModal();
return;
} 

function xtenddedCalcReset (){
resetCalculator();
defaultKeysColor();
fetchPersistentUserConfiguration();
applyTheme();
applyLanguage();
toggleDevelopmentDataPanel();

}

// Initialize calc
window.onload = function(){
xtenddedCalcReset();
greet();
return;
};

// Key Presses - Event listeners for Memory and Format key presses:
keyMS.addEventListener('click', ()=>{
keyPressedMS=true;
keyMS.style.color='var(--key-ms)';
setTimeout(()=>{
if(numInMem===null || numInMem===''){
keyMS.style.color='var(--all-key-symbols-default-color)';
}
postANotification('inf01' ,notifColors.infColor.bgColor, notifColors.infColor.fontColor);
/*
notificationText.innerHTML=`Error, nothing was saved.\nBut saving nothing erases memory.`;
*/
//notificationAreaStyle.backgroundColor='var(--noti-board-bg)'; // '#3cc4ef';
//notificationText.style.color='var(--noti-board-txt)';
},0);
memoryHandler();
});
keyMR.addEventListener('click', ()=>{
keyPressedMR=true;
memoryHandler();
});
keyMC.addEventListener('click', () =>{
keyPressedMC=true;
keyMS.style.color='var(--all-key-symbols-default-color)';
memoryHandler();
});

// The keyFormat Listener is programmatically controlled to enable or disable the Format Modal
keyFormat.addEventListener('click', () =>{
  gateToModalScreen();
  applyColorToAllKeySymbols(keyFormat, 'var(--all-key-symbols-default-color)');
});
keyFormat.addEventListener('click', backupNumDisplayed);
keyFormat.addEventListener('click', stdScientificDigitCount);

// Key Presses - Event listeners for unary key presses:
clearKey.addEventListener('click', () =>{xtenddedCalcReset();
});
key0.addEventListener('click', ()=>{
  keyPressedUnary=true;
  keyPressedNumber=true;
  keyPressed=0;
  switchCalcModes();
}); 
key1.addEventListener('click', ()=>{
  keyPressedUnary=true;
  keyPressedNumber=true;
  keyPressed=1;
  switchCalcModes();
}); 
key2.addEventListener('click',()=>{
  keyPressedUnary=true;
  keyPressedNumber=true;
  keyPressed=2;
  switchCalcModes();
}); 
key3.addEventListener('click',()=>{
  keyPressedUnary=true;
  keyPressedNumber=true;
  keyPressed=3;
  switchCalcModes();
}); 
key4.addEventListener('click',()=>{
  keyPressedUnary=true;
  keyPressedNumber=true;
  keyPressed=4;
  switchCalcModes();
}); 
key5.addEventListener('click',()=>{
  keyPressedUnary=true;
  keyPressedNumber=true;
  keyPressed=5;
  switchCalcModes();
}); 
key6.addEventListener('click',()=>{
  keyPressedUnary=true;
  keyPressedNumber=true;
  keyPressed=6;
  switchCalcModes();
}); 
key7.addEventListener('click',()=>{
  keyPressedUnary=true;
  keyPressedNumber=true;
  keyPressed=7;
  switchCalcModes();
}); 
key8.addEventListener('click',()=>{
  keyPressedUnary=true;
  keyPressedNumber=true;
  keyPressed=8;
  switchCalcModes();
}); 
key9.addEventListener('click',()=>{
  keyPressedUnary=true;
  keyPressedNumber=true;
  keyPressed=9;
  switchCalcModes();
});
dotKey.addEventListener('click', ()=>{
  keyPressedUnary=true;
  keyPressedDot=true;
  keyPressed='.';
  switchCalcModes();
});
expKey.addEventListener('click', ()=>{
  keyPressedUnary=true;
  keyPressedExp=true;
  keyPressed='e-';
  switchCalcModes();
});

function applyColorToAllKeySymbols (opKeyTouched, defaultColorForAllKeySymbols){
/*The color of all symbols of all keys (elements with the class of ".key") will be colored to the color held by the "defaultColorForAllKeySymbols" variable. This color is the normal (default) color of all keys after app initialization.
*/
const allOpKeys=document.querySelectorAll('.key');
for (let key of allOpKeys) {
  key.style.color=defaultColorForAllKeySymbols;
}
/* However, the symbol of the key that was touched, will be set to the color of that particular key in its actuated state. Actuated state is only be visible for unary and binary operator keys. Numbers, dot, and, e do not change symbol's color when actuated.
*/
opKeyTouched.style.color='var(--color-for-actuated-op-key)';
}

changeSignKey.addEventListener('click', ()=>{
  keyPressedUnary=true;
  keyPressedChgSign=true;
  keyPressed = '&#177';
  
  applyColorToAllKeySymbols(changeSignKey, 'var(--all-key-symbols-default-color)');
  // invertKey.style.color='#20b2d8';
  
  switchCalcModes();
});
backspaceKey.addEventListener('click', ()=>{
  keyPressedUnary=true;
  keyPressedBackspace=true;
  keyPressed='&#x232b';
  
  applyColorToAllKeySymbols(backspaceKey, 'var(--all-key-symbols-default-color)');
  // invertKey.style.color='#20b2d8';
  
  switchCalcModes();
});
invertKey.addEventListener('click', ()=>{
  keyPressedUnary=true;
  keyPressedInv=true;
  keyPressed='1/x';
  
  applyColorToAllKeySymbols(invertKey, 'var(--all-key-symbols-default-color)');
  // invertKey.style.color='#20b2d8';
  
  switchCalcModes();
});
sqrtKey.addEventListener('click', ()=>{
  keyPressedUnary=true;
  keyPressedSqrt=true;
  keyPressed='&#x221a;';
  
  applyColorToAllKeySymbols(sqrtKey, 'var(--all-key-symbols-default-color)');
  // sqrtKey.style.color='#20b2d8';
  
  switchCalcModes();
});
squareKey.addEventListener('click', ()=>{
  keyPressedUnary=true;
  keyPressedSquare=true;
  keyPressed='x²';
  
  applyColorToAllKeySymbols(squareKey, 'var(--all-key-symbols-default-color)');
  // squareKey.style.color='#20b2d8';
  
  switchCalcModes();
});

// Key Presses - Event listeners for binary key presses:
sumKey.addEventListener('click', ()=>{
  keyPressedUnary=false;
  keyPressedAdd=true;
  keyPressed='+';
  previousOperand=lcd.innerHTML; // ~
  applyColorToAllKeySymbols(sumKey, 'var(--all-key-symbols-default-color)');
  switchCalcModes();
});
minusKey.addEventListener('click',  ()=>{
  keyPressedUnary=false;
  keyPressedSubstract=true;
  keyPressed='-';
  previousOperand=lcd.innerHTML; // ~
  applyColorToAllKeySymbols(minusKey, 'var(--all-key-symbols-default-color)');
  switchCalcModes();
});
multiplyKey.addEventListener('click',  ()=>{
  keyPressedUnary=false;
  keyPressedMultiply=true;
  keyPressed='&#215;';
  previousOperand=lcd.innerHTML; // ~
  applyColorToAllKeySymbols(multiplyKey, 'var(--all-key-symbols-default-color)');
  switchCalcModes();
});
divideKey.addEventListener('click',  ()=>{
  keyPressedUnary=false;
  keyPressedDivide=true;
  keyPressed='&#247;';
  previousOperand=lcd.innerHTML; // ~
  applyColorToAllKeySymbols(divideKey, 'var(--all-key-symbols-default-color)');
  switchCalcModes();
});
percentageKey.addEventListener('click', ()=>{
  keyPressedUnary=false;
  keyPressedPercentage=true;
  keyPressed='%';
  previousOperand=lcd.innerHTML; // ~
  applyColorToAllKeySymbols(percentageKey, 'var(--all-key-symbols-default-color)');
  switchCalcModes();
});
equalKey.addEventListener('click', ()=>{
  keyPressedUnary=false;
  keyPressedEquals=true;
  keyPressed='=';
  applyColorToAllKeySymbols(equalKey, 'var(--all-key-symbols-default-color)');
  equalKey.style.color='var(--key-equal-symb)';
  main();
});

// ################################
// MR with empty LCD. Treat memory content as a new single number entry.
function treatAsDigitKeyPress (num=numInMem){
// Preset the environment
keyPressedUnary=true;
keyPressedNumber=true;
keyPressed=numInMem;// Treat numInMem number as a regular number key press
// Channel service request
switchCalcModes();
// Reset flag
keyPressedMR=false;
return;
}
let memoryOnLCD=document.querySelector('#memoryOnLCD');

// ################################
// Memory behavior (MS, MC, MR)
function memoryHandler (){
hideAppSettingsModal();
// OK ********************************
if(keyPressedMS){ // MS: Save LCD to memory (override numInMem with LCD contents)
numInMem=lcd.innerHTML;
memoryOnLCD.innerHTML=numInMem;
keyPressedMS=false;
return;

// OK ********************************
}else if(keyPressedMC){ // MC: Clear memory
numInMem='';
memoryOnLCD.innerHTML=''; // Non-debug item. It is part of Calc.
keyPressedMC=false; // Reset flag

// MEMORY RECALL BEHAVIOR
}else if(keyPressedMR){
// OK ********************************
if(numInMem===null||numInMem===''){// Forbidden: Attempting retrieval from memory when numInMem is empty.
postANotification('inf02', notifColors.infColor.bgColor, notifColors.infColor.fontColor);
// Error: 'Nothing in memory'.
/*
notificationText.innerHTML=`
                   ⚠  Error
       There is nothing in memory.
       continue.`;
*/
// notificationAreaStyle.backgroundColor='var(--noti-board-bg)'; // '#3cc4ef';
notificationText.style.color='var(--noti-board-txt)';
keyPressedMR=false;
return;}

// OK ********************************
if(operand1==='' || operand1===null){ // MR with empty LCD. Treat memory content as a new single number entry.
treatAsDigitKeyPress();
return;

// OK ********************************
}else if(operand1!==null && operator===null) { // If just a number on display with no subsequent operator, supplant number with numInMem. Simple
operand1=null;
treatAsDigitKeyPress();
return;

// OK ********************************
}else if(operand1!==null && operator!==null && operand2===null) { // This is when user has already entered 1st operand, operator, and rather than entering a next number, user retrieves memory. In this case is like numInMem is a new digit key pressed. 
treatAsDigitKeyPress();
return;

// OK ********************************
}else if(operand1!==null && operator!==null && operand2!==null && finalResult===null) { // This is when user has already entered 1st operand, operator, and 2nd operand,and rather than entering a next operator, or an equal sign, user retrieves memory. This tells calc to supplant the 2nd operand (on LCD) with numInMem content.
operand2=null;
treatAsDigitKeyPress();
return;

// DEVELOPER DEBUG VISIBILITY:
//lastOpDebug.innerHTML =operator;
//lcdDebug.innerHTML = lcd.innerHTML;
//operand1Debug.innerText = operand1;
//operand2Debug.innerHTML = operand2;
//opNowDebug.innerText = operator;
//resultDebug.innerHTML = finalResult;

// ********************************
// Remaining case is when there is a final result on display. Next digit pressed would start a whole new calculation. So, it's easier to reset Calculator and treat numInMem as though it is a result of pressing a single digit key. This last rule also applies to Recycle state,since number one display is also a final result.
 }else{
// quals(); // to hammer it to work after a single equals. It does not work unless equals is pressed a second time. I don't know why.
xtenddedCalcReset();
treatAsDigitKeyPress();
return;
}
}
}
// ################################

//  **** FORMAT MODAL BEHAVIOR ****

// Count the decimal places of a number
const decimalCount = num => {
   // Convert to String
   const numStr = String(num);
   // String Contains Decimal
   if (numStr.includes('.')) {
      return numStr.split('.')[1].length;
   }
   // String Does Not Contain Decimal
   return 0;
};

// Preserve the number displayed on the LCD
let lcdBackup;
const originalDigits=document.querySelector('#original-format-decimals');
function backupNumDisplayed (){
//console.log('lcd.innerHTML', lcd.innerHTML);
if(lcd.innerHTML===''){
originalDigits.innerHTML=null;
}else if (lcd.innerHTML==='0'){
originalDigits.value=0;
}else{
// Adding zero before saving removes all trailing zeroes, and removes repeat leading zeroes
// lcdBackup=parseFloat(lcd.innerHTML)+0;
lcdBackup=lcd.innerHTML;
lcd.innerHTML=lcdBackup;
originalDigits.innerHTML=decimalCount(lcdBackup);}
return}

// Enter Format Modal. This is upon pressing the green "Go" button.
const formatModal=document.querySelector('#format-modal');
const keyBoard=document.querySelector('#keys');

let modalStartedFlag;
function enterFormatModal (){
formatModal.style.opacity='1';
formatModal.style.zIndex='1';
//formatModal.style.position='relative';
//formatModal.style.height='fit-content';
//formatModal.style.left='0';
//keyBoard.style.position='absolute';
//keyBoard.style.right='101vw';
keyBoard.style.opacity='0';
return;
}

// SHOW OR HIDE CHOICES AND PANELS:
// Firstly grab needed elements
const originalFormatSelectorRadioBtn=document.querySelector('li:first-child');
const roundOffRadioSelector=document.querySelector('#roundoff-choice');
const scientificRadioSelector=document.querySelector('#scientific-choice' );
const originalInfoPanel=document.querySelector('#original-panel');
const roundOffInfoPanel=document.querySelector('#round-panel');
const scientificInfoPanel=document.querySelector('#scientific-panel');
// All hide functions:
function hideOriginalRadioSelector (){
originalFormatSelectorRadioBtn.style.opacity='0';
}
function hideOriginalInfoPanel (){
originalInfoPanel.style.opacity='0';
}
function hideRoundOffInfoPanel (){
roundOffInfoPanel.style.opacity='0';
}
function hideScientificInfoPanel (){
scientificInfoPanel.style.opacity='0';
}
// All show functions
function showOriginalRadioSelector (){
originalFormatSelectorRadioBtn.style.opacity='1';
}
function showOriginalInfoPanel (){
originalInfoPanel.style.opacity='1';
hideRoundOffInfoPanel();
hideScientificInfoPanel();
}
originalFormatSelectorRadioBtn.addEventListener('click', showOriginalInfoPanel);
const originalFormatRadioBtn=document. querySelector('#original-format-choice');
originalFormatRadioBtn.addEventListener('click', applySelectedFormat);

function showRoudOffPanel (){
roundOffInfoPanel.style.opacity='1';
hideOriginalInfoPanel();
hideScientificInfoPanel();
}
roundOffRadioSelector.addEventListener('click', showRoudOffPanel);
function showScientificfPanel (){
scientificInfoPanel.style.opacity='1';
hideOriginalInfoPanel();
hideRoundOffInfoPanel();
}
scientificRadioSelector.addEventListener('click', showScientificfPanel);

// Reset panels and choices view to initial (default) state

function initModalState (){
hideOriginalRadioSelector();
hideOriginalInfoPanel();
hideRoundOffInfoPanel();
hideScientificInfoPanel();
originalFormatRadioBtn.checked=true;
roundOffRadioSelector.checked=false;
scientificRadioSelector.checked=false;
lcdBackup='';
originalDigits.value='';
roundOffDigits.value='';
ScientificDigitsDisplay.value='';
}

/*
// ADAPTATION OF XTRACT LIBRARY
// xtract Global outcome variables
let numPortion;
let fractCluster;
let expVal;
//fractionalPart
function is_dotPresent (){
if(lcdBackup.toString().includes('.')){
return true;}
return false;}

function is_ePresent (){
if(lcdBackup.toString().includes('e')){
return true;}
return false;}

function numericPart (){
let userEntryAbsVal;
if(lcdBackup<0 || lcdBackup.toString().slice(0,1)==='-' || lcdBackup.toString().slice(0,1)==='+'){
userEntryAbsVal=lcdBackup.toString().slice(1,lcdBackup.toString(). length);
}else{
userEntryAbsVal=lcdBackup.toString().slice(0,lcdBackup.toString(). length);
}
let wholeNumStr;
if(is_ePresent()){
wholeNumStr=userEntryAbsVal.toString();
const sliceStop=wholeNumStr.indexOf('e');
numPortion=wholeNumStr.slice(0, sliceStop);
return numPortion; // a string.
}
numPortion=userEntryAbsVal.toString();
return numPortion;
}

function fractionalPart (){
if(is_dotPresent()){  
let numbStr=numericPart();
const sliceStop=numbStr.indexOf('.');
fractCluster=numbStr.slice(sliceStop+1, numbStr.length);
return fractCluster;}
fractCluster=null;
return fractCluster;}

// exponentialValue

function exponentialValue (){
if(!is_ePresent()){
expVal=null;
return expVal;}
const wholeNumStr=lcdBackup.toString();
const sliceStop=wholeNumStr.indexOf('e');
const expStr=wholeNumStr.slice(sliceStop+1, wholeNumStr.length);
if(!isNaN(expStr[0])){
expVal=expStr;
return expVal;}
expVal=expStr.slice(0,expStr.length);
return expVal;} 
// END OF ADAPTATION OF XTRACT LIBRARY
*/

function roundOffReqValid (){
const OriginalFractionalPart=xtract.fractionalPart(lcdBackup);
const originalExponential=xtract.exponentialValue(lcdBackup);
const originalDecimalPlaces=OriginalFractionalPart.length-originalExponential;
if(originalDecimalPlaces-roundOffDigits.value<0){
return false;}
return true;}

// Round-off for round-off format
const roundOffDigits=document.querySelector('#decimals');
function roundOff(num){
if(!roundOffReqValid()){
// Report error and abort
postANotification('int00', notifColors.intColor.bgColor, notifColors.intColor.fontColor);
/*
notificationText.innerHTML=`Error. The number of decimal digits of your original number was not that large. \n Please try with a smaller number.`;
*/
// notificationText.style.color='var(--noti-fatal-error-txt)';
// notificationAreaStyle.backgroundColor='var(--noti-fatal-error-bg-color)';
return;}
const roundedOff=Math.round(num*10**roundOffDigits.value)/(10**roundOffDigits.value);
return roundedOff;
}

// Determine if a number contains a dot
function hasDot(num){
const dotIsPresent=num.toString().includes('.');
return dotIsPresent;
} 

// Determine the amount of digits in a number
let digitsCount=(num)=>{
num=num.toString();
if(hasDot(num) && num<0){// -0.1
const digitCount=num.length-2;
// console.log('digitCount: ', digitCount);
return digitCount;

}else if(hasDot(num) && num>=0){// 0.4
const digitCount=num.length-1;
// console.log('digitCount: ', digitCount);
return digitCount;

}else if(!hasDot(num) && num<0){// -1
const digitCount=num.length-1;
// console.log('digitCount: ', digitCount);
return digitCount;

}else if(!hasDot(num) && num>=0){// 1
const digitCount=num.length;
// console.log('digitCount: ', digitCount);
return digitCount;
}else{
// NOP
}
};

function leftmostZeroCounter(num){
if(num<0){
num=num*(-1);//Negative sign does not count as digit. Strip the neg sign.
}// continue...
num=num.toString();
// Chop off all leftmost zeroes and dot
let zeroesCount=0;
for (let digit of num) {
if(digit==='0'){
zeroesCount++;
}else if(digit==='0'||digit==='.'){
num=num.slice(0,1);
// console.log('num', num);
}else{
// console.log('zeroesCount', zeroesCount);
return zeroesCount;
}
}
}

function reverseString(str) {
 const reversedStr=str.split("").reverse().join("");
return reversedStr;
}

function rightmostZeroCounter(num){
// Stringify number
const strNum=num.toString();
// Reverse stringified number
let revStrNum=reverseString(strNum);
const rightZeroesCount=leftmostZeroCounter(revStrNum);
// console.log('rightZeroesCount: ', rightZeroesCount);
return rightZeroesCount;
}
/*
// Digits count not including leading edge zero, if present
function scientificDigitsCount (){ // 
const sigDigits=digitsCount(lcdBackup)-leftmostZeroCounter(lcdBackup)-rightmostZeroCounter(lcdBackup);
console.log({sigDigits});
return  sigDigits;
}
*/

// Display std scientific number of digits
const ScientificDigitsDisplay=document. querySelector('#significant');
function stdScientificDigitCount(){
ScientificDigitsDisplay.value=scientificDigitsCount();}

function supplantOrigOperand (changedNum){
if(operator===null){
operand1=changedNum.toString();
lcd.innerHTML=operand1;
}else{
operand2=changedNum.toString();
lcd.innerHTML=operand2;
}
updDebug();
lastOpDispl.innerHTML = '&#x2704;';
return;

}

// Change format of number displayed without altering its value.

// const scientificRadioSelector=document.querySelector('#scientific-choice');

function applySelectedFormat(){
eraseNotification();
if (originalFormatRadioBtn.checked) {
lcd.innerHTML=lcdBackup;
supplantOrigOperand(lcdBackup);
return;

}else if(roundOffRadioSelector.checked){
const roundedNum=roundOff(lcdBackup);
supplantOrigOperand(roundedNum);
return;

}else if(scientificRadioSelector.checked){
  
  const scientificNum=parseFloat(lcdBackup).toExponential(parseInt(ScientificDigitsDisplay.value-1));

supplantOrigOperand(scientificNum);
return ;

}else{
// NOP
// const exponent=integerCount-1;
// console.log('exponent: ', exponent);
}
}
const goBtn=document.querySelector('#apply-format');
goBtn.addEventListener('click', applySelectedFormat);
goBtn.addEventListener('click', showOriginalRadioSelector);
// Format mode display exit behavior. This is upon pressing the red "X" button.
function exitFormatModal (){
formatModal.style.opacity='0';
formatModal.style.zIndex='0';
//formatModal.style.position='absolute';
//formatModal.style.height='fit-content';
//formatModal.style.right='0';
//keyBoard.style.position='relative';
//keyBoard.style.right='0';
keyBoard.style.opacity='1';
eraseNotification();
return;
}
const quitBtn=document.querySelector('#quit-format');
quitBtn.addEventListener('click', exitFormatModal);
quitBtn.addEventListener('click', initModalState);

// This function performs tasks to enable correct behavior of other functions that need various of their tasks performed at this point of the program.
function unrelatedTasks(){
previousOpKey=operator; // Every numeric appended preserves the last operator (if any). Will be used for checkDivByZero() function.
keyFormat.addEventListener('click', enterFormatModal); // Enable format modal once something is on LCD
keyFormatListenerFlag=true;
chgNumAppearance();
return;
}

// To handle attempts to write multiple dots to an operand
function chkMultiDotErr (){ 
if(keyPressed!=='.'){ // No need to test
// NOP
return;
}else{ // Need to test
// Check if there is already a dot
if (lcd.innerHTML.indexOf('.')<0) {
// Display does not contain a dot. Test passed.
// NOP
return;
}else{ // 
// Test failed keyPress is a repeat dot
keyPressed='';
postANotification('inf03', notifColors.infColor.bgColor, notifColors.infColor.fontColor);
/*
notificationText.innerHTML=`Your duplicate dot was ignored. \nContinue.`;
*/
// notificationText.style.color='var(--noti-board-txt)';
// notificationAreaStyle.backgroundColor='var(--noti-board-bg)';
return;
}
}
}

// To handle attempts to write multiple 'e' to an operand
function chkMultiExpErr (){ 
if(keyPressed!=='e-'){ // No need to test
// NOP
return;
}else{ // Need to test
// Check if there is already a 'e'
if (lcd.innerHTML.indexOf('e')<0) {
// Display does not contain an 'e'. Test passed. An 'e-' will be appended.
postANotification('int01', notifColors.intColor.bgColor, notifColors.intColor.fontColor);
/*
notificationText.innerHTML=`For a positive exponent delete negative sign using backspace key.`;
*/
// notificationText.style.color='var(--noti-board-txt)';
// notificationAreaStyle.backgroundColor='var(--noti-board-bg)';
return;
}else{ // 
// Test failed keyPress is a repeat 'e'
keyPressed='';
postANotification('inf04', notifColors.infColor.bgColor, notifColors.infColor.fontColor);
/*
notificationText.innerHTML=`Your duplicate 'e' was ignored. Continue.`;
*/
// notificationText.style.color='var(--noti-board-txt)';
// notificationAreaStyle.backgroundColor='var(--noti-board-bg)';
return;
}
}
}

function chkForbidExp (){
//console.log({keyPressed});
if ((keyPressed==='e-' || keyPressed==='.') && preservedEqualsResult!==null) {
setTimeout(()=>{
postANotification('int02', notifColors.intColor.bgColor, notifColors.intColor.fontColor);
/*
 notificationText.innerHTML=`Now in Recycle Mode. Press your key again to modify the final result.`;
*/
// notificationAreaStyle.backgroundColor='var(--noti-board-bg)';
// notificationText.style.color='var(--noti-board-txt)'
}, 0);
}
preservedEqualsResult=null;
return;
}


// functions called by Main:
function appendDigit (){// Also appends dot
// This function performs tasks to enable correct behavior of other functions that need various of their tasks performed at this point of the program:
unrelatedTasks();
chkMultiDotErr();
chkMultiExpErr();
chkForbidExp ();
if(operator===null){ // This case is when appendage goes against 1st operand
if(keyPressed==='.' && operand1===null){ // More specifically, against 1st operand, with the added condition that dot is the very first character received(operand1 is empty)
keyPressed='0.'; // suplant the dot by a zero and dot, and process as a single digit. 
}

if(operand1===null){ // If null, concat keyPressed with empty string
  // Now the '0.' will be appended to the current content of operand1. But since the content is the null character, we load operand1 with an empty string and append the '0.' to it. Net result is we loaded the '0.' string into the operand1 variable. For a case of a single numeric digit received, the net effect is that the single digit is appended.
operand1='';
operand1=operand1.concat(keyPressed);

}else{ // now we handle the case when characters are directed to 1st operand, but operand is not empty. In this case, it is just a matter of appending the additional digit. Simple.
operand1=operand1.concat(keyPressed);
}
// Now mirror the operand1 content to the LCD for user to view.
lcd.innerHTML=operand1;
// And update the subtotal register and it's viewable display also.
subtotal=operand1;
subTot.innerHTML=operand1;

}else{
// Now the case when operator is not null. This means that previous processes completed loading of digits destined to the 1st operand and also loaded the desired operand to the operand register. Any subsequent digits and dot will be destined to the 2nd operand. Procedure is same as for the 1st operand. But this time performed for the operand2 variable:
if(keyPressed==='.' && operand2===null){ // Case of 2nd operand empty
keyPressed='0.'; // Got a dot.
}
if(operand2===null){// on virgin location concat keyPressed with empty string
operand2='';
operand2=operand2.concat(keyPressed);

}else{ // What to do if 2nd operand already had some content.
operand2=operand2.concat(keyPressed);

}
lcd.innerHTML=operand2; // Let user see the result of the appendage procedure.
}
// Reset all variables to get them ready for a possible subsequent use.
keyPressedNumber=false;
keyPressedDot=false;
keyPressedExp=false;
// Update details for developer visualization while building the App.
updDebug();
return; // Done! 
}

function changeSign (){
if(operator===null){
operand1=(operand1*(-1)).toString();
lcd.innerHTML=operand1;
}else{
operand2=(operand2*(-1)).toString();
lcd.innerHTML=operand2;
}
keyPressedChgSign=false;
updDebug();
lastOpDispl.innerHTML = '&#177';
return;
}

function backspace (){
if(operator===null){
operand1=operand1.slice(0, operand1.length-1);
lcd.innerHTML=operand1;
}else{
operand2=operand2.slice(0, operand2.length-1);
lcd.innerHTML=operand2;
}
keyPressedBackspace=false;
updDebug();
lastOpDispl.innerHTML = '&#x232b';
return;
}

function invert (){
if(operand1*1===0 ||operand1===null){
postANotification('int03', notifColors.intColor.bgColor, notifColors.intColor.fontColor);
/*
notificationText.innerHTML=`
                   ⚠  Error
       Try again with a non zero value.`;
*/
// notificationAreaStyle.backgroundColor='var(--noti-board-bg)'; // '#3cc4ef';
// notificationText.style.color='var(--noti-board-txt)';
operand1=null;
updDebug();
lcd.innerHTML=null;
return;
}
if(operator===null){
operand1=(1/operand1).toString();
lcd.innerHTML=operand1;
}else{
if(operand2==='0' ||operand2===null){
 postANotification('int04, notifColors.intColor.bgColor, notifColors.intColor.fontColor');
/* 
notificationText.innerHTML=` ⚠  Error.
Try again with a non zero value. Entry so far:
${operand1} ${operator}`;
*/
// notificationText.style.color='var(--noti-fatal-error-txt)';
// notificationAreaStyle.backgroundColor='var(--noti-board-bg)'; // '#3cc4ef';
// notificationText.style.color='var(--noti-board-txt)';
operand2=null;
updDebug();
lcd.innerHTML=null;
return;
} 
operand2=(1/operand2).toString();
lcd.innerHTML=operand2;
}
keyPressedInv=false;
updDebug();
lastOpDispl.innerHTML = 'x&#x207b;&#xb9;'; // @
return;
}

function sqrt (){
if(operator===null){
if(operand1<0){
postANotification('int05', notifColors.intColor.bgColor, notifColors.intColor.fontColor);
/*
notificationText.innerHTML =`                   ⚠  Error.
 Only positive numbers for square root operator.
 Modify your number, or clear to try again.`;
*/
 // notificationText.style.color='var(--noti-fatal-error-txt)';
// notificationAreaStyle.backgroundColor='var(--noti-fatal-error-bg-color)'; // '#9d0ba7';
keyPressedSqrt=false;
return;
}
operand1=Math.sqrt(operand1).toString();
lcd.innerHTML=operand1;
}else{
operand2=Math.sqrt(operand2).toString();
lcd.innerHTML=operand2;
}
keyPressedSqrt=false;
updDebug();
lastOpDispl.innerHTML = '&#x221a;';
return;
}

function square (){
if(operator===null){
operand1=(operand1*operand1).toString();
lcd.innerHTML=operand1;
}else{
operand2=(operand2*operand2).toString();
lcd.innerHTML=operand2;
}
keyPressedSquare=false;
updDebug();
lastOpDispl.innerHTML = 'x²';
return;
}

function equals (){
performCalc();
lcd.innerHTML=finalResult;
preservedEqualsResult=finalResult;
keyPressedEquals=false;
subtotal=finalResult;
updDebug();
lastOpDispl.innerHTML = '=';
chgNumAppearance('1', 'var(--num-result)');
return;
}

function recycle (){
chkForbidExp();
// To achieve recycle mode, the trick is to preserve the final result, then modify the environment to mimic conditions during a number key press, and supplant the keyPressed value with the preserved final result. And then call main() to handle the mocked keyPressed.
preservedFinalResult=finalResult;
resetCalculator();
keyPressedUnary=true;
keyPressedNumber=true;
keyPressed=preservedFinalResult;
main();
lastOpDispl.innerHTML='♽';
preservedFinalResult=null;
return;
}

function performCalc (){
if(operator==='+'){
finalResult= parseFloat(operand1) + parseFloat(operand2);
updDebug();
}else if(operator==='-'){
finalResult= parseFloat(operand1) - parseFloat(operand2);
updDebug();

}else if(operator==='&#215;'){// multiplication
finalResult= parseFloat(operand1) * parseFloat(operand2);
updDebug();

}else if(operator==='&#247;'){// division
if(operand2==='0'){
resetCalculator();
postANotification('fat00', notifColors.fatColor.bgColor, notifColors.fatColor.fontColor);
/*
 notificationText.innerHTML='             ⚠  Error.\n              Divide by zero is not allowed.\n              I had to cancel your calculation.';
*/
// notificationAreaStyle.backgroundColor='var(--noti-board-bg)';
 return;
}else{
finalResult= parseFloat(operand1) / parseFloat(operand2);
}
updDebug();

}else if(operator==='%'){
finalResult= parseFloat(operand1) * parseFloat(operand2)/100;
updDebug();

/*
}else if(operator==='%'){
finalResult= parseFloat(operand1) * parseFloat(operand2)/100;
updDebug();
*/
}else{// error: missing operator
// console.log('1031',{subtotal}); // @
treatAsDigitKeyPress(subtotal);
postANotification('fat01', notifColors.fatColor.bgColor, notifColors.fatColor.fontColor);
/*
 notificationText.innerHTML ='⚠  Error. Two numbers and an operator are required to perform a calculation. Clear and start all over again.';
*/
// notificationAreaStyle.backgroundColor='var(--noti-fatal-error-bg-color)';
// notificationText.style.color='var(--noti-fatal-error-txt)';
}
return;
}

// let abortSwitchCalcModes;
function checkDivByZero (){
if(previousOpKey==='&#247;' && operand2*1===0)
{ // Error: 'Attempt to divide by zero'
// abortSwitchCalcModes=true;
// console.log('flag set to: ', abortSwitchCalcModes);
resetCalculator();
postANotification('fat02', notifColors.fatColor.bgColor, notifColors.fatColor.fontColor);
/*
notificationText.innerHTML=`
                   ⚠  Error
       Calculation canceled. You attempted to divide by zero.
       Enter a number a for new calculation.`;
*/
// notificationAreaStyle.backgroundColor='var(--noti-board-bg)'; // '#3cc4ef';
// notificationText.style.color='var(--noti-board-txt)';
}else{
// NOP
return;
}
}

function gateToModalScreen (){
if (!keyFormatListenerFlag ||lcd.innerHTML===''){
postANotification('int06', notifColors.intColor.bgColor, notifColors.intColor.fontColor);
/*
notificationText.innerHTML=`
      You need a number on display to use this feature!`;
*/
// notificationAreaStyle.backgroundColor='var(--noti-board-bg)'; // '#3cc4ef';
 // notificationText.style.color='var(--noti-board-txt)';
}
}

function chkFirstKeypressIsNum(){
if(operand1===null && isNaN(keyPressed) && keyPressed!=='.'){
resetCalculator();
postANotification('int07', notifColors.intColor.bgColor, notifColors.intColor.fontColor);
/*
notificationText.innerHTML=`
      ⚠ Your first entry must be a number or a dot!`;
*/
// notificationAreaStyle.backgroundColor='var(--noti-board-bg)'; // '#3cc4ef';
// notificationText.style.color='var(--noti-board-txt)';
defaultKeysColor();
return;
}
} 

function chgNumAppearance (intensity, color='var(--all-key-symbols-default-color)'){
lcd.style.color=color;
lcd.style.opacity=intensity;
} 

function operandLoader (){
operator=keyPressed;
chgNumAppearance('1','var(--num-entered)');
updDebug();
}

function chkMultiOps (){
if(operator!==null && operand2===null){
// notify operator duplicity
postANotification('int08', notifColors.intColor.bgColor, notifColors.intColor.fontColor);
/*
notificationText.innerHTML=`ERROR! You had already entered an operator. Entries so far:\n${operand1} ${keyPressed}
To continue: Enter your next number, OR\nPress the operator you really wanted.`;
*/
// notificationAreaStyle.backgroundColor='var(--noti-board-bg)'; // '#3cc4ef';
// notificationText.style.color='var(--noti-board-txt)';
}
}

// Main
function main (){
chkFirstKeypressIsNum();
if(keyPressedUnary){// 0y, key press was unary?
console.log('if 0');
// 1 is the yes of 0
//1
if(keyPressedNumber){// 1y
//call sub appendDigit.
appendDigit();
}else{// 1n
// 2 is the else of 1
// 2
if(keyPressedDot){// 2y
console.log('if 2');
// call sub appendDot.
appendDigit();

}else{// 1bn
// 2b is the else of 1b
// 2b
if(keyPressedExp){// 2y
console.log('if 2');
// call sub appendExp
appendDigit();

}else{// 2n, 
// 3 is the else of 2
// 3
if(keyPressedChgSign){// 3y
console.log('if 3');
//call sub changeSign.
changeSign();
}else{// 3n, 
// 4 is the else of 3
// 4
if(keyPressedBackspace){// 4y
console.log('if 4');
// call sub backspace.
backspace();
}else{// 4n, 
// 5 is the else of 4
// 5
if(keyPressedInv){// 5y
console.log('if 5');
//call sub invert
invert();
}else{// 5n, 
// 6 is the else of 5
// 6
if(keyPressedSqrt){// 6y
console.log('if 6');
// call sub sqrt.
sqrt();
}else{// 6n
// 7 is the else of 6
// 7
if(keyPressedSquare){// 7y
console.log('if 7');
// call sub square.
square();
}else{// 7n, 
// return is the else of 7
// 7
return;
}
}
}
}
}
}
}
}
}else{//0n, key press was '=' ?
// 8 is the else of 0
// 8

checkDivByZero();
if(keyPressedEquals){// 8y
console.log('if 8');
if(operand1===null||operand2===null){
// Error: missing operand
// console.log('1185',{subtotal}); // @
let preservedSubtotal=subtotal;
resetCalculator();
treatAsDigitKeyPress(preservedSubtotal);
postANotification('fat03', notifColors.fatColor.bgColor, notifColors.fatColor.fontColor);
/* 
notificationText.innerHTML='⚠  Error. Two numbers and an operator are required to perform a calculation. Clear and start all over again.';
*/
// notificationAreaStyle.backgroundColor='var(--noti-fatal-error-bg-color)';
// notificationText.style.color='var(--noti-fatal-error-txt)';
return;
}
// 9 is the yes of 8
// 9
if(lastOpDispl.innerHTML!=='='){// 9y, no prior keyPressedEquals. Perform math.
console.log('if 9');
// 1st time equal is true.
// call sub performCalc.
equals();
}else{// 9n, user entered two successive keyPressedEquals
// Therefore, call sub recycle, to enter recycle mode.
recycle();
return;
}
}else{// 8n, 
// 10 is the else of 8
// 10
keyFormat.removeEventListener('click', enterFormatModal); // LCD blanks every time a binary operator is entered. Therefore no need to enter format modal.
keyFormatListenerFlag=false;
if(keyPressedAdd){// 10y
console.log('if 10: ','keyPressedAdd', keyPressedAdd);
chkMultiOps();
// call sub operandLoader.

operandLoader();
// updDebug();
// chgNumAppearance('green');
}else{// 10n
// 11
// 11 is the else of 10
if(keyPressedSubstract){// 11y
console.log('if 11');
chkMultiOps();
// call sub operandLoader.

operandLoader();
}else{// 11n
// 12 is the else of 11
// 12
if(keyPressedMultiply){// 12y
console.log('if 12');
chkMultiOps();
// call sub operandLoader.

operandLoader();
}else{// 12n
// 13 is the else of 12
// 13
if(keyPressedDivide){// 13y
console.log('if 13');
chkMultiOps();
// call sub operandLoader.

operandLoader();
}else{// 13n
// 14 is the else of 13
// 14
if(keyPressedPercentage){// 14y
console.log('if 14');
// 14 is the else of 13
chkMultiOps();
// call sub operandLoader.

operandLoader();
}else{// 14n
// NOP is the else of 14
return;
}
}
}
}
}
}
}
}

function assertOperation(keyPressed){
// Enable operator corresponding to the key that was pressed:
// For unary operators 
if(keyPressed ==='&#177'){
keyPressedChgSign=true;
return keyPressedChgSign;

}else if(keyPressed==='&#x232b'){
 keyPressedBackspace=true;
 return keyPressedBackspace;
 
}else if(keyPressed==='1/x'){
 keyPressedInv=true;
 return keyPressedInv;

}else if(keyPressed==='&#x221a;'){
keyPressedSqrt=true;
return keyPressedSqrt;

}else if(keyPressed==='x²'){
keyPressedSquare=true;
return keyPressedSquare;

// For binary operators 

}else if(keyPressed==='+'){
keyPressedAdd=true;
return keyPressedAdd;

}else if(keyPressed==='-'){
keyPressedSubstract=true;
return keyPressedSubstract;

}else if(keyPressed==='&#215;'){
keyPressedMultiply=true;
return keyPressedMultiply;

}else if(keyPressed==='&#247;'){
keyPressedDivide=true;
return keyPressedDivide;

}else if(keyPressed==='%'){
keyPressedPercentage=true;
return keyPressedPercentage;

}else{
// NOP
}
return;}

function switchCalcModes (){
hideAppSettingsModal();
if(notificationAreaStyle.backgroundColor==='var(--noti-fatal-error-bg-color)'){return} // Fatal error. Reject all key presses until user resets calculator.

 eraseNotification();
// Mode1: Entry of a unary or binary operator after final result (in other words, after pressing the equals key)
if(operand1!==null && operand2!==null && finalResult!==null && isNaN(keyPressed)){
// Preserve unary environment:
// example:
//  keyPressedUnary=true;
//  keyPressedInv=true;
//  keyPressed='1/x';

// Preserve binary environment:
// example:
// keyPressedUnary=false;
// keyPressedAdd=true;
// keyPressed='+';

const preservedKeyPressedUnary=keyPressedUnary;
const preservedKeyPressed=keyPressed;

// Enter recycle mode:
recycle();

// Restore environment:
keyPressedUnary=preservedKeyPressedUnary;
keyPressed=preservedKeyPressed;
assertOperation(keyPressed);
const assertedOperation=assertOperation(keyPressed);
// Feed main() with restored environment:
main();
subtotal=operand1;
subTot.innerHTML=operand1;
return;
}else if(operand1!==null && operand2!==null && finalResult===null &&!keyPressedUnary){
// Mode2: After receiving the sequence: operand1, an operator, and opetand2, calc receives a binary operator. This signals an intention to complete current calculation, and use its result as the first number of next calculation whose operator will be the latest operator entered by the user. 
// preserve current binary operator and its environment
// example:
// keyPressedUnary=false;
// ** keyPressedAdd=true;
// keyPressed='+';
const preservedKeyPressedUnary=keyPressedUnary;
const preservedKeyPressed=keyPressed;

// complete current calculation (like when pressing the equal sign)
// Prepare equal sign environment:
// Hereby the equals environment:
keyPressedUnary=false;
keyPressedEquals=true;
keyPressed='=';
  
// Now call main() to complete the calculation
main();
// Use result as 1st number of next calculation and load the preserved operator
// inject preserved operator and its environment, and process like there was a binary operator key Press.
// To achieve this, restore original environment, and call switchCalcModes()

// restoring original environment:
keyPressedUnary=preservedKeyPressedUnary;
keyPressed=preservedKeyPressed;
assertOperation(keyPressed);
const assertedOperation=assertOperation(keyPressed);
// calling switchCalcModes()
switchCalcModes();
subtotal=operand1;
subTot.innerHTML=operand1;
lcd.innerHTML=previousOperand; // Purpose of this line is to keep on display the number that was entered even after entering the subsequent operator. Originally the behavior was number disappearance from display. Now it stays but changes color to signal number accepted in calculator.
return;
// Mode3: Entry of a number after final result (in other words, after pressing the equals. This signals an intention to start a whole new calculation. 
}else if(operand1!==null && operand2!==null && finalResult!==null && !isNaN(keyPressed)){
// Procedure: preserve the number, whole calculator, restore the number, and let switchCalcModes() handle it.

// Preserve number environment:
// example:
// keyPressedUnary=true;
// keyPressedNumber=true;
// keyPressed=0;
const preservedkeyPressedUnary=keyPressedUnary;
const preservedkeyPressedNumber=keyPressedNumber;
const preservedKeyPressed=keyPressed;

// whole calculator
resetCalculator();

// Restore number and its environment
keyPressedUnary=preservedkeyPressedUnary;
keyPressedNumber=preservedkeyPressedNumber;
keyPressed=preservedKeyPressed;

// Process the number entry as usual
switchCalcModes();
subtotal=operand1;
subTot.innerHTML=operand1;
return;
}else{
main();
}
return;
}

/*
function fatalError (){
// Preserve error message
const preservedNotif=`
                   ⚠  Error
       Calculation canceled because "xyz".
       Enter number for new calculation.`;
const preservedColorBg='var(--noti-board-bg)'; // '#3cc4ef';
const preservedColor='var(--noti-fatal-error-txt)';
// Clear calculator
resetCalculator();
// Restore error message
notificationText.innerHTML=`Sorry for this inconvenience. I had to reset. I could not recover from an input error of yours. Error:\n${preservedNotif}`;
notificationAreaStyle.backgroundColor=preservedColorBg;
notificationText.style.color=preservedColor;
}
*/

// ### BEHAVIOR OF USER SETTINGS: ###
// Save user settings to persistent memory
let devPanelVaultedState;
let vaultedThemeChoice;
let vaultedLanguageChoice;
function vaultUserConfiguration (){
window.localStorage.setItem('devPanelVaultedState', JSON.stringify(devPanelVaultedState));
window.localStorage.setItem('vaultedThemeChoice',JSON.stringify(vaultedThemeChoice));
window.localStorage.setItem('vaultedLanguageChoice',JSON.stringify(vaultedLanguageChoice));
//console.log({vaultedLanguageChoice});
}

// Restore user settings from persistent memory
function fetchPersistentUserConfiguration (){
devPanelVaultedState=JSON.parse(window.localStorage.getItem('devPanelVaultedState'));
vaultedThemeChoice=JSON.parse(window.localStorage.getItem('vaultedThemeChoice'));
vaultedLanguageChoice=JSON.parse(window.localStorage.getItem('vaultedLanguageChoice'));
return;
}
 
function verticalSettingsMenu (){
// Default position is horizontal
appSettingsMenu.style.transform='rotate(0)';
appSettingsMenu.style.top='3rem';
appSettingsMenu.style.left='0.2rem';
}

let settingsModalOn=false;
const settingsModal=document.querySelector('#settings-modal-wrapper');
function showAppSettingsModal (){
settingsModal.style.top='0.2rem';
settingsModal.style.left='3rem';
settingsModalOn=true;
lcd.style.opacity='0';
lastOpDispl.style.opacity='0';
verticalSettingsMenu();
return;
}

function horizontalSettingsMenu (){
appSettingsMenu.style.transform='rotate(-90deg)';
appSettingsMenu.style.top='-1.2rem';
appSettingsMenu.style.left='2rem';
}

function hideAppSettingsModal (){
settingsModal.style.top='-22.6vw';
settingsModal.style.left='101%';
settingsModalOn=false;
lcd.style.opacity='1';
lastOpDispl.style.opacity='1';
horizontalSettingsMenu();
return;
}

function toggleAppSettingsModal(){
if(settingsModalOn){
hideAppSettingsModal();
}else{
showAppSettingsModal();
} 
return;
}
const appSettingsMenu=document.querySelector('#app-settings-menu-btn');
appSettingsMenu.addEventListener('click', toggleAppSettingsModal);

// ### BEHAVIOR OF DEVELOPER PANEL: ###
const debugDataSubpanel=document.querySelector('#debug-data-grill');
const wholeDataPanel=document.querySelector('#inner-data-wrapper');
// Save this user setting in persistent memory
function vaultDevPanelOnOffState (){
devPanelVaultedState=checkboxToshowOrHideDevPanel.checked;
vaultUserConfiguration();
}

function showWholeDataPanel (){
debugDataSubpanel.style.opacity='1';
wholeDataPanel.style.bottom=('0');
return;
}

function hideWholeDataPanel (){
debugDataSubpanel.style.opacity='0';
wholeDataPanel.style.bottom=('7.5rem');
return;
}

function toggleDevelopmentDataPanel (){
fetchPersistentUserConfiguration();
if (devPanelVaultedState) {
// show developer information grille
showWholeDataPanel();
}else{
// hide developer information grille 
hideWholeDataPanel();
}
checkboxToshowOrHideDevPanel.checked=devPanelVaultedState;
return;
}
const checkboxToshowOrHideDevPanel=document.querySelector('#show-details');
checkboxToshowOrHideDevPanel.addEventListener('click', () =>{
vaultDevPanelOnOffState();
toggleDevelopmentDataPanel();
});

// ## BEHAVIOR OF THEMES: ##
// Grab choices radio buttons
const allAppSettings=document.querySelector('#app-settings-modal');
const contrastThemeRadio=document.querySelector('#contrast-theme-choice');
const blueThemeRadio=document.querySelector('#blue-theme-choice');
const smoothThemeRadio=document.querySelector('#smooth-theme-choice');
// Grab theme root element
const root=document.querySelector(':root');

function vaultChosenTheme (){
let chosenTheme;
if(contrastThemeRadio.checked===true){
chosenTheme='contrast-theme';  
}
if(blueThemeRadio.checked===true){
chosenTheme='blue-theme';
}
if(smoothThemeRadio.checked===true){
chosenTheme='smooth-theme';
}
vaultedThemeChoice=chosenTheme;
vaultUserConfiguration();
return;
}

function tickActiveThemeRadioBtn (){
if(vaultedThemeChoice==='contrast-theme'){
contrastThemeRadio.checked=true;
}
if(vaultedThemeChoice==='blue-theme'){
blueThemeRadio.checked=true;
}
if(vaultedThemeChoice==='smooth-theme'){
smoothThemeRadio.checked=true;
}
}
function applyTheme (){
fetchPersistentUserConfiguration();
const currentClass=root.classList[0];
root.classList.remove(`${currentClass}`);
root.classList.add(`${vaultedThemeChoice}`);
tickActiveThemeRadioBtn();
return;
}

// ## BEHAVIOR OF LANGUAGE RADIO BUTTONS: ##
// Grab language radio buttons
const spanishLanguageRadio=document.querySelector('#spanish-language');
const englishLanguageRadio=document.querySelector('#english-language');

function vaultChosenLanguage (){
let chosenLanguage;
if(spanishLanguageRadio.checked===true){
chosenLanguage='spanish-language';  
}
if(englishLanguageRadio.checked===true){
chosenLanguage='english-language';
}
vaultedLanguageChoice=chosenLanguage;
vaultUserConfiguration();
return;
}

function tickActiveLanguageRadioBtn (){
if(vaultedLanguageChoice==='spanish-language'){
spanishLanguageRadio.checked=true;
}
if(vaultedLanguageChoice==='english-language'){
englishLanguageRadio.checked=true;
}
return;}

function applyLanguage (){
fetchPersistentUserConfiguration();
tickActiveLanguageRadioBtn();
return;
}
allAppSettings.addEventListener('click', () =>{
vaultChosenTheme();
vaultChosenLanguage();
applyTheme();
applyLanguage();
});

// EXTRACTION LIBRARY:
//####################################
   /* signifFigCounter v2.0.js */
//####################################

var xtract={

functionNameLocked: false,

myNameIs: function (funcNam){
if(this.functionNameLocked){
// Do nothing
return;
}
// Report name of last called function
/*
const functionName=document.querySelector('#function-name');
functionName.innerHTML=`${funcNam}( )`;
*/
// console.log(`${funcNam}( )`);
},  
  
algebraicSign: function (aNum){
if(aNum<0||aNum.slice(0,1)==='-'){
const impliedSign='-';
return impliedSign;}
if(aNum>0||aNum.slice(0,1)==='+'){
const impliedSign='+';
return impliedSign;}
const impliedSign='';
return impliedSign;}, 

hasASign: function (aNum){
this.myNameIs('hasASign');
const entryStr=aNum;
if(entryStr.slice(0,1)==='+' || entryStr.slice(0,1)==='-'){
// yes
const hasSign=true;
return hasSign;}
//no
const hasSign=false;
return hasSign;}, 

fetchTheSign: function (aNum){
if(this.hasASign(aNum)){
this.myNameIs('fetchTheSign');
// yes
const fetchedSign=aNum.slice(0,1);
return fetchedSign;}
//no
const fetchedSign='';
return fetchedSign;}, 

numericPart: function (aNum){
this.myNameIs('numericPart');
this.functionNameLocked=true;
let userEntryAbsVal;
if(aNum.slice(0,1)==='-' || aNum.slice(0,1)==='+'){
userEntryAbsVal=aNum.slice(1);
}else{
userEntryAbsVal=aNum.slice(0);
}
let wholeNumStr;
if(this.hasAnE(aNum)){
wholeNumStr=userEntryAbsVal;
const sliceStop=wholeNumStr.indexOf('e');
const numPortion=wholeNumStr.slice(0, sliceStop);
this.functionNameLocked=false;
return numPortion; // a string.
}
const numPortion=userEntryAbsVal;
this.functionNameLocked=false;
return numPortion;
}, 

integerPart: function (aNum){
const numbStr=this.numericPart(aNum);  
if(this.hasADot(aNum)){
this.myNameIs('integerPart');
const sliceStop=numbStr.indexOf('.');
const integerPortion=numbStr.slice(0, sliceStop);
return integerPortion;}
const integerPortion=numbStr;
return integerPortion;},

trailingZeroesCount: function (aNum){
const numStr=this.integerPart(aNum);
this.myNameIs('trailingZeroesCount');
let zeroesCount=0;
for (let digit of numStr) {
if(digit==='-' || digit==='+'){
// Don't count. Not a trailing zero
}else if(digit==='.' |digit!=='0'){
const trailing0sCnt=zeroesCount;
return trailing0sCnt;
}else if(digit==='0'){
zeroesCount++;
}
} 
const trailing0sCnt=zeroesCount;
return trailing0sCnt;
},

zeroTrimmedCore: function (aNum){
this.myNameIs('zeroTrimmedCore');
this.functionNameLocked=true;
// Zero valueds with or without dot somewhere:
if(1*aNum===0 && this.hasADot()){
const non0Cluster='.';
this.functionNameLocked=false;
return non0Cluster;}
if(1*aNum===0 && !this.hasADot(aNum)){
const non0Cluster='';
this.functionNameLocked=false;
return non0Cluster;}
let numbStr=this.numericPart(aNum);
let absNumbStr;
//numbers that have the form ".x"
if(numbStr.slice(0,1)==='.'){
numbStr=(1*numbStr).toString(); // trim leading zeroes
const non0Cluster=numbStr.slice(0); // trim trailing 0 introduced by 1* operation
this.functionNameLocked=false;
return non0Cluster;}
if(numbStr.slice(-1)==='.'){ // x. case
numbStr=(1*numbStr).toString(); // trim trailing zeroes
const non0Cluster=numbStr.concat('.'); // append '.' trimmed by 1* operation
this.functionNameLocked=false;
return non0Cluster;}
// For all other cases not covered above:
const non0Cluster=(1*numbStr).toString();
this.functionNameLocked=false;
return non0Cluster;},

significantFigures: function (aNum){
this.myNameIs('significantFigures');
this.functionNameLocked=true;
const alphamericCoreStr=this.numericPart(aNum); 
// Any number of only zeroes with a dot somewhere:
if(1*alphamericCoreStr===0 && alphamericCoreStr.includes('.')){ 
const signifFigs='0'+this.fractionalPart(aNum); // Leftmost 0 is implied. Therefore, correct the original user entry adding a Leftmost 0.
this.functionNameLocked=false;
return signifFigs;}
// Any number of only zeroes with no dot anywhere:
if(1*alphamericCoreStr===0 && !alphamericCoreStr.includes('.')){
const signifFigs='0';
this.functionNameLocked=false;
return signifFigs;}
// Non-zero valued numeric part that starts with a dot:
if(alphamericCoreStr.slice(0,1)==='.'){
const signifFigs='0'+this.fractionalPart(aNum);
this.functionNameLocked=false;
return signifFigs;}
this.functionNameLocked=true;
let non0ClusterStr=this.zeroTrimmedCore(aNum);
this.functionNameLocked=false;
// Any other except previous "returns", that contain a dot somewhere:
if(non0ClusterStr.includes('.')){
const indexOfDot=non0ClusterStr.indexOf('.');
const jointString=non0ClusterStr.slice(0,indexOfDot) + non0ClusterStr.slice(1+indexOfDot);
const signifFigs=jointString;
this.functionNameLocked=false;
return signifFigs;}
// Any numeric part that doesn't contain a dot:
// +011e-2
const signifFigs=this.zeroTrimmedCore(aNum);
this.functionNameLocked=false;
return signifFigs;},

sigFiguresCount: function (aNum){
this.myNameIs('sigFiguresCount');
this.functionNameLocked=true;
const sigDigCnt=this.significantFigures(aNum).length;
this.functionNameLocked=false;
return sigDigCnt;},

reverseNumCluster: function (aNum){ 
this.myNameIs('reverseNumCluster');
this.functionNameLocked=true;
const numStr=this.numericPart(aNum);
let reversedNumCluster='';
for (var i = 0; i < numStr.length; i++) {
  reversedNumCluster=numStr[i].concat(reversedNumCluster);
}
this.functionNameLocked=false;
return reversedNumCluster;},

leadingZeroesCount: function (aNum){
this.myNameIs('leadingZeroesCount');
this.functionNameLocked=true;
if(!this.numericPart(aNum).includes('.')){
const leading0s=0;
this.functionNameLocked=false;
return leading0s;}
/*
if(aNum==='0'){
const leading0s=0;
this.functionNameLocked=false;
return leading0s;}
*/
this.functionNameLocked=true;
const reversedNumCluster=this.reverseNumCluster(aNum);
let zeroesCount=0;
for (let digit of reversedNumCluster) {
if(digit==='-' || digit==='+'){
// Don't count. Not a trailing zero
}else if(digit==='.' |digit!=='0'){
const leading0s=zeroesCount;
this.functionNameLocked=false;
return leading0s;
}else if(digit==='0'){
zeroesCount++;
}
} 
const leading0s=zeroesCount;
this.reverseNumCluster=false;
return leading0s;
},

fractionalPart: function (aNum){
this.myNameIs('fractionalPart');
this.functionNameLocked=true;
if(this.hasADot(aNum)){
let numbStr=this.numericPart(aNum);
const sliceStop=numbStr.indexOf('.');
const fractCluster=numbStr.slice(sliceStop+1);
this.functionNameLocked=false;
return fractCluster;}
const fractCluster='';
this.functionNameLocked=false;
return fractCluster;},

hasADot: function (aNum){
this.myNameIs('hasADot');
if(aNum.includes('.')){
// yes
const hasDot=true;
return hasDot;}
//no
const hasDot=false;
return hasDot;},

fetchTheDot: function (aNum){
this.myNameIs('fetchTheDot');
this.functionNameLocked=true;
if(this.hasADot(aNum)){
// yes
const fetchedDot='.';
this.functionNameLocked=false;
return fetchedDot;}
//no
const fetchedDot='';
this.functionNameLocked=false;
return fetchedDot;},

hasAnE: function (aNum){
this.myNameIs('hasAnE');
this.functionNameLocked=true;
if(aNum.includes('e')){
// yes
const hasExp=true;
this.functionNameLocked=false;
return hasExp;}
//no
const hasExp=false;
this.functionNameLocked=false;
return hasExp;}, 

fetchTheE: function (aNum){
this.myNameIs('fetchTheE');
this.functionNameLocked=true;
if(this.hasAnE(aNum)){
// yes
const fetchedE='e';
this.functionNameLocked=false;
return fetchedE;}
//no
const fetchedE='';
this.functionNameLocked=false;
return fetchedE;},

exponentialSign: function (aNum){
this.myNameIs('exponentialSign');
this.functionNameLocked=true;
const wholeNumStr=aNum;
if(!wholeNumStr.includes('e')){
const expSign='';
this.functionNameLocked=false;
return expSign;}
if(wholeNumStr.includes('e+')){
const expSign='+';
this.functionNameLocked=false;
return expSign}
if(wholeNumStr.includes('e-')){
const expSign='-';
this.functionNameLocked=false;
return expSign;}
const expSign='+';
this.functionNameLocked=false;
return expSign;},

exponentialValue: function (aNum){
this.myNameIs('exponentialValue');
this.functionNameLocked=true;
if(!this.hasAnE(aNum)){
const expVal='';
this.functionNameLocked=false;
return expVal;}
const wholeNumStr=aNum;
const sliceStop=wholeNumStr.indexOf('e');
const expStr=wholeNumStr.slice(sliceStop+1);
if(!isNaN(expStr[0])){
const expVal=expStr;
this.functionNameLocked=false;
return expVal;}
const expVal=expStr.slice(1);
this.functionNameLocked=false;
return expVal;},

exponentialWhole: function (aNum){
this.myNameIs('exponentialWhole');
this.functionNameLocked=true;
if(!this.hasAnE(aNum)){
const expWhole='';
this.functionNameLocked=false;
return expWhole;}
const wholeNumStr=aNum;
const sliceStop=wholeNumStr.indexOf('e');
const expStr=wholeNumStr.slice(sliceStop+1);
if(!isNaN(expStr[0])){
const expWhole=expStr;
this.functionNameLocked=false;
return expWhole;}
const expWhole=expStr.slice(0);
this.functionNameLocked=false;
return expWhole;}
};

/*
Note:
Input data must be a string.
Example how to use:
const data='-012.3000e-5';
let outcome;
outcome=xtract.numericPart(data);
console.log(outcome); // '012.3000'
*/

//#################################
//     DETERMINATION OF RESULT
//#################################
// Composer function:
function scientificDigitsCount (){
// Test the applicability of this function. It's only valid for exponential numbers
if(!xtract.hasAnE(lcdBackup)) { 
  // Not an exponential number call the fixed number handler
const fxdNumDigFigCnt=fixedNumSigFigCnt();
return fxdNumDigFigCnt;}  
// Test the applicability of this function. It's only valid for exponential numbers, with integer exponential values.
if(!Number.isInteger(1*xtract.exponentialValue(lcdBackup))){ // error: This Calculator  version can only handle integer exponentials.
// console.log('error: This Calculator  version can only handle integer exponentials.'); 
postANotification('fat04', notifColors.fatColor.bgColor, notifColors.fatColor.fontColor); // §
return;} 
// Case 1: exponentialValue=0
if(xtract.exponentialValue(lcdBackup)==='0'){
// Test Case: +0012.3400e0
// Rule:
const originalSigFigsCnt=xtract.sigFiguresCount(lcdBackup) + xtract.leadingZeroesCount(lcdBackup);
return originalSigFigsCnt;}

// Case 2: exponentialSign is negative
if(xtract.exponentialSign(lcdBackup)==='-'){
const outcomeA=negSubCaseA();
const outcomeB=negSubCaseB();
if(outcomeA){
return outcomeA;}
if(outcomeB){
return outcomeB;}
return '';}

// Case 3: exponentialSign is positive
if(xtract.exponentialSign(lcdBackup)==='+'){
const outcomeC=posSubCaseA();
const outcomeD=posSubCaseB();
if(outcomeC){
return outcomeC;}
if(outcomeD){
return outcomeD;}
return '';}
}

// Case 2: exponentialSign is negative
function negSubCaseA (){
// Subcase a:
// exponentialValue() <= integerPart().length - trailingZeroesCount()
if(xtract.exponentialValue(lcdBackup)<=xtract.integerPart(lcdBackup).length - xtract.trailingZeroesCount(lcdBackup)) {
// Test Case: +0012.3400e-1
// Rule:
const originalSigFigsCnt=xtract.sigFiguresCount(lcdBackup) + xtract.leadingZeroesCount(lcdBackup);
return originalSigFigsCnt;}
return '';}

// Case 2: exponentialSign is negative
function negSubCaseB (){
// Subcase b:
// exponentialValue() > integerPart().length - trailingZeroesCount()
if(xtract.exponentialValue(lcdBackup)>xtract.integerPart(lcdBackup).length - xtract.trailingZeroesCount(lcdBackup)) {
// Test Case: +0012.3400e-3
// Rule:
const originalSigFigsCnt=1 * xtract.sigFiguresCount(lcdBackup) + 1 * xtract.leadingZeroesCount(lcdBackup) + 1 * xtract.exponentialValue(lcdBackup) - 1 * (xtract.integerPart(lcdBackup).length - 1 * xtract.trailingZeroesCount(lcdBackup));
return originalSigFigsCnt;}
return ''}

// Case 3: exponentialSign is positive
function posSubCaseA (){
// Subcase a:
// exponentialValue() <= fractionalPart().length
if(xtract.exponentialValue(lcdBackup)<=xtract.fractionalPart(lcdBackup).length) {
// Test Case: +0012.3400e+1
// Rule:
const originalSigFigsCnt=xtract.sigFiguresCount(lcdBackup) + xtract.leadingZeroesCount(lcdBackup);
return originalSigFigsCnt;}
return '';}

// Case 3: exponentialSign is positive
function posSubCaseB (){
// Subcase b:
// exponentialValue() > fractionalPart().length
if(xtract.exponentialValue(lcdBackup)>xtract.fractionalPart(lcdBackup).length) {
// Test Case: +0012.3400e+5
// Rule:
const originalSigFigsCnt=xtract.sigFiguresCount(lcdBackup) + xtract.leadingZeroesCount(lcdBackup) + (xtract.exponentialValue(lcdBackup) - xtract.fractionalPart(lcdBackup).length);
return originalSigFigsCnt;}
return '';}
 
// case 4: exponential absent
function fixedNumSigFigCnt (){
// Test Case: .00, 0.00, 0., 00.
// Any number of only zeroes with a dot somewhere:
// Rule:
let alphamericCoreStr=xtract.numericPart(lcdBackup);
if(1*alphamericCoreStr===0 && alphamericCoreStr.includes('.')){
const fixedSigFigsCnt=xtract.sigFiguresCount(lcdBackup);
return fixedSigFigsCnt;}
// Test Case: .x00
// Rule:
if(xtract.numericPart(lcdBackup).slice(0,1)==='.'){
const fixedSigFigsCnt=xtract.sigFiguresCount(lcdBackup);
return fixedSigFigsCnt;}
// Test Case: +0012.3400
// Rule:
const fixedSigFigsCnt=xtract.sigFiguresCount(lcdBackup) + xtract.leadingZeroesCount(lcdBackup);
return fixedSigFigsCnt;}


// Test
function test(){
// Post a notification
function postANotification (msgCode, bgColr, fontColr){
if(englishLanguageRadio.checked){
notificationText.innerHTML=engMsgs[ `${msgCode}`];
}else if(spanishLanguageRadio.checked){
notificationText.innerHTML=spaMsgs[ `${msgCode}`];
}else{
//NOP
}
console.log ({bgColr});
notificationAreaStyle.backgroundColor=bgColr;
console.log ({fontColr});
notificationText.style.color=fontColr;
return;}
 

postANotification('clr00', notifColors.clrColor.bgColor, notifColors.clrColor.fontColor);
}
const testBtn=document.querySelector ('#test');
testBtn.addEventListener('click', test);

