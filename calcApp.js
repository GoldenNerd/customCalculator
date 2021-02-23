"use strict";

// global variables
let keyPressed;
let operand1=null;
let operand2=null;
let operator=null;
let finalResult=null;
let preservedParameter1=null;
let currentOpKey=null;
let memorized=null;
let subtotal=null;

// Flags used by operators event listeners
let keyPressedUnary=null;
let keyPressedNumber=false;
let keyPressedDot=false;
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
const currentOpKeyDebug = document.querySelector('#last-op-debug');
const lcdDebug = document.querySelector('#lcd-debug');
const inpBufferDebug = document.querySelector('#inpBufferDebug');
const mainAccDebug = document.querySelector('#mainAccDebug');
const sumAccDebug = document.querySelector('#sumAccDebug');
const minusAccDebug = document.querySelector('#minusAccDebug');
const multAccDebug = document.querySelector('#multAccDebug');
const divAccDebug = document.querySelector('#divAccDebug');
const percentAccDebug = document.querySelector('#prcntAccDebug');
const dotAccDebug = document.querySelector('#dotAccDebug');
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
const notif = document.querySelector ('#notification');
const alertColor=document.querySelector ('#notification-area').style;

// Reset auxiliary functions:
function updDebug () {
inpBufferDebug.innerText = operand1;
sumAccDebug.innerHTML = operand2;
multAccDebug.innerText = operator;
percentAccDebug.innerHTML = finalResult;
lastOpDispl.innerHTML = operator;
currentOpKeyDebug.innerHTML =operator;
lcdDebug.innerHTML = lcd.innerHTML;
subTot.innerHTML=subtotal;// @@@@
return;
}

function clear (){
operand1=null;
operand2=null;
operator=null;
finalResult=null;
keyPressedUnary=null;
keyPressedNumber=false;
keyPressedDot=false;
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
lcd.innerHTML = null;
notif.innerHTML = '';
alertColor.backgroundColor='transparent';
// memorized=null;
subtotal=null;
updDebug();
lastOpDispl.innerHTML = 'C';
return;
} 

// Initialize calc
window.onload = function(){
clear();
notif.innerHTML=`           😁 Welcome to EASYCALC 😁
           Your arithmetics assistant.
               For help press ❔`;
alertColor.backgroundColor='darkgreen';
return;
};

// Key Presses - Event listeners for Memory and Format key presses:
keyMS.addEventListener('click', () =>{keyPressedMS=true;memory();});

keyMR.addEventListener('click', () =>{keyPressedMR=true;memory();});

keyMC.addEventListener('click', () =>{
  keyPressedMC=true;
  memory();});
  
keyFormat.addEventListener('click', launchFormatMode);

// Key Presses - Event listeners for unary key presses:
clearKey.addEventListener('click', () =>{clear();});
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
changeSignKey.addEventListener('click', ()=>{
  keyPressedUnary=true;
  keyPressedChgSign=true;
  keyPressed = '&#177';
  switchCalcModes();
});
backspaceKey.addEventListener('click', ()=>{
  keyPressedUnary=true;
  keyPressedBackspace=true;
  keyPressed='&#x232b';
  switchCalcModes();
});

invertKey.addEventListener('click', ()=>{
  keyPressedUnary=true;
  keyPressedInv=true;
  keyPressed='1/x';
  switchCalcModes();
});
sqrtKey.addEventListener('click', ()=>{
  keyPressedUnary=true;
  keyPressedSqrt=true;
  keyPressed='&#x221a;';
  switchCalcModes();
});
squareKey.addEventListener('click', ()=>{
  keyPressedUnary=true;
  keyPressedSquare=true;
  keyPressed='x²';
  switchCalcModes();
});

// Key Presses - Event listeners for binary key presses:
sumKey.addEventListener('click', ()=>{
  keyPressedUnary=false;
  keyPressedAdd=true;
  keyPressed='+';
  switchCalcModes();
});
minusKey.addEventListener('click',  ()=>{
  keyPressedUnary=false;
  keyPressedSubstract=true;
  keyPressed='-';
  switchCalcModes();
});
multiplyKey.addEventListener('click',  ()=>{
  keyPressedUnary=false;
  keyPressedMultiply=true;
  keyPressed='&#215;';
  switchCalcModes();
});
divideKey.addEventListener('click',  ()=>{
  keyPressedUnary=false;
  keyPressedDivide=true;
  keyPressed='&#247;';
  switchCalcModes();
});
percentageKey.addEventListener('click', ()=>{
  keyPressedUnary=false;
  keyPressedPercentage=true;
  keyPressed='%';
  switchCalcModes();
});
equalKey.addEventListener('click', ()=>{
  keyPressedUnary=false;
  keyPressedEquals=true;
  keyPressed='=';
  main();
});

function memRecall (){
// Preset the environment @@@
keyPressedUnary=true;
keyPressedNumber=true;
keyPressed=memorized;// Treat memorized number as a regular number key press
// Channel service request
switchCalcModes();
// Reset flag
keyPressedMR=false;
return;
}

// Misc functions
let lcdToViewMemory=document.querySelector('#lcd-to-view-memory');

function memory (){
// Save LCD to memory
if(keyPressedMS){
memorized=lcd.innerHTML;
lcdToViewMemory.innerHTML=memorized;
keyPressedMS=false;
return;

}else if(keyPressedMR){// Retrieve from memory
if(lcd.innerHTML===''){
memRecall();
return;
}else if(lcd.innerHTML===operand1) {
operand1=null;
memRecall();
}else if(lcd.innerHTML===operand2) {
operand2=null;
memRecall();
}else{
clear();
keyPressedMR=true;
memory();
return;
}
// Clear memory
}else if(keyPressedMC){
memorized='';
lcdToViewMemory.innerHTML='';
// Reset flag
keyPressedMC=false;
}else{
// NOP
}
return;
}

//  **** FORMAT MODE BEHAVIOR ****

// Format mode display behavior. This is upon pressing the red "X" button.
function exitFormatMode (){
formatModal.style.position='absolute';
formatModal.style.height='fit-content';
formatModal.style.left='-101vw';
keyBoard.style.position='relative';
keyBoard.style.right='0';
return;
}
const quitBtn=document.querySelector('#quit-format');
quitBtn.addEventListener('click', exitFormatMode);
//@@@@

const decimalCount = num => {
   // Convert to String
   const numStr = String(num);
   // String Contains Decimal
   if (numStr.includes('.')) {
      return numStr.split('.')[1].length+1;
   }
   // String Does Not Contain Decimal
   return 0;
};

let lcdBackup;
function launchFormatMode (){
// Change appearance of number displayed without changing the finalResult source number. 
formatModal.style.position='relative';
formatModal.style.height='fit-content';
formatModal.style.left='0';
keyBoard.style.position='absolute';
keyBoard.style.right='101vw';
// At launch time, preserve LCD value to be used by applyFormat()
// Adding zero before saving removes all trailing zeroes, and removes repeat leading zeroes
if(lcd.innerHTML===null){
defaultDigits.innerHTML=null;
}else if (lcd.innerHTML==='0'){
defaultDigits.value=0;
}else{
lcdBackup=parseFloat(lcd.innerHTML)+0;
lcd.innerHTML=lcdBackup;
defaultDigits.innerHTML=decimalCount(lcdBackup)-1;}
return;
}
const keyBoard=document.querySelector('#keys');
const formatModal=document.querySelector('#format-modal');

const defaultChoice=document.querySelector('#none-choice');
const roudOffChoice=document.querySelector('#round-choice');
const exponentialChoice=document.querySelector('#exponent-choice');
//const scientificChoice=document.querySelector('#scientific-choice');

const defaultDigits=document.querySelector('#none-decimals');
const roundOffDigits=document.querySelector('#decimals');
const exponentialDigits=document.querySelector('#exponent-digits');
// const scientificDigits=document.querySelector('#scientific-choice');

// Round-off for round-off format choice
function roundOff(num){
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
console.log('digitCount: ', digitCount);
return digitCount;

}else if(hasDot(num) && num>=0){// 0.4
const digitCount=num.length-1;
console.log('digitCount: ', digitCount);
return digitCount;

}else if(!hasDot(num) && num<0){// -1
const digitCount=num.length-1;
console.log('digitCount: ', digitCount);
return digitCount;

}else if(!hasDot(num) && num>=0){// 1
const digitCount=num.length;
console.log('digitCount: ', digitCount);
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
for (let character of num) {
if(character==='0'){
zeroesCount++;
}else if(character==='0'||character==='.'){
num=num.slice(0,1);
console.log('num', num);
}else{
console.log('zeroesCount', zeroesCount);
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
console.log('rightZeroesCount: ', rightZeroesCount);
return rightZeroesCount;
}

// Digits count not including leading edge zero, if present
function significantDigitsCount(){
const sigDigits=digitsCount(lcdBackup)-leftmostZeroCounter(lcdBackup)-rightmostZeroCounter(lcdBackup);
console.log('sigDigits: ', sigDigits);
return sigDigits;
}

function applyFormat(){
if (defaultChoice.checked) {
lcd.innerHTML=lcdBackup;
return;

}else if(roudOffChoice.checked){
lcd.innerHTML=roundOff(lcdBackup);
return;

}else if(exponentialChoice.checked){
  lcd.innerHTML=parseFloat(lcdBackup).toExponential(parseFloat(significantDigitsCount()-1));
return ;

}else{
const exponent=integerCount-1;
console.log('exponent: ', exponent);
}
}


const goBtn=document.querySelector('#apply-format');
goBtn.addEventListener('click', applyFormat);


// functions called by Main
function appendDigit (){// Also appends dot
if(operator===null){
if(keyPressed==='.' && operand1===null){
keyPressed='0.';
}
if(operand1===null){// If null, concat keyPressed with empty string
operand1='';
operand1=operand1.concat(keyPressed);
}else{
operand1=operand1.concat(keyPressed);
}
lcd.innerHTML=operand1;
subtotal=operand1;// @@@@
subTot.innerHTML=operand1;
}else{
if(keyPressed==='.' && operand2===null){
keyPressed='0.';
}
if(operand2===null){// on virgin location concat keyPressed with empty string
operand2='';
operand2=operand2.concat(keyPressed);
}else{
operand2=operand2.concat(keyPressed);
}
lcd.innerHTML=operand2;
}
keyPressedNumber=false;
keyPressedDot=false;
updDebug();
return;
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
if(operand1==='0' ||operand1===null){
notif.innerHTML=`
                   ☹️ Sorry
       Try again with a non zero value.`;
alertColor.backgroundColor='darkgreen';
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
notif.innerHTML=` ☹️ Sorry.
Try again with a non zero value. Entry so far:
${operand1} ${operator}`;
alertColor.backgroundColor='darkgreen';
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
lastOpDispl.innerHTML = 'x&#x207b;&#xb9;';
return;
}

function sqrt (){
if(operator===null){
if(operand1<0){
notif.innerHTML =`                   ☹️ Sorry.
 Only positive numbers for square root operator.
              Clear and try again.`;
alertColor.backgroundColor='darkred';
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
keyPressedEquals=false;
subtotal=finalResult;
updDebug();
lastOpDispl.innerHTML = '=';
subtotal=finalResult;
return;
}

function recycle (){
preservedParameter1=finalResult;
clear();
keyPressedUnary=true;
keyPressedNumber=true;
keyPressed=preservedParameter1;
main();
lastOpDispl.innerHTML='♽';
preservedParameter1=null;
return;
}

function operandLoader (){
operator=keyPressed;
updDebug();
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
if(operand2==='0' || operand2===null||operand2===undefined){
alertColor.backgroundColor='darkred';
 notif.innerHTML=' ☹️ Sorry. Divide by zero is not allowed. Clear and try again.';
return;}
finalResult= parseFloat(operand1) / parseFloat(operand2);
updDebug();
}else if(operator==='%'){
finalResult= parseFloat(operand1) * parseFloat(operand2)/100;
updDebug();
}else if(operator==='%'){
finalResult= parseFloat(operand1) * parseFloat(operand2)/100;
updDebug();
}else{// error: missing operator
alertColor.backgroundColor='darkred';
 notif.innerHTML ='☹️ Sorry. Two numbers and an operator are required to perform a calculation. Clear and start all over again.';
}
return;
}

// Main
function main (){
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
}else{//0n, key press was '=' ?
// 8 is the else of 0
// 8
if(keyPressedEquals){// 8y
console.log('if 8');
if(operand1===null||operand2===null){
// Error: missing operand
alertColor.backgroundColor='darkred';
 notif.innerHTML='☹️ Sorry. Two numbers and an operator are required to perform a calculation. Clear and start all over again.';
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
if(keyPressedAdd){// 10y
console.log('if 10: ','keyPressedAdd', keyPressedAdd);

if(operator!==null && operand2===null){
// notify operator duplicity
notif.innerHTML=`Your last operator was on error.
Your entries so far:  ${operand1} ${keyPressed}
To continue, enter next number, or enter correct operator.`;
alertColor.backgroundColor='darkgreen';
}

// call sub operandLoader.
operandLoader();
updDebug();
lcd.innerHTML=null;
}else{// 10n
// 11
// 11 is the else of 10
if(keyPressedSubstract){// 11y
console.log('if 11');
// call sub operandLoader.
operandLoader();
updDebug();
lcd.innerHTML=null;
}else{// 11n
// 12 is the else of 11
// 12
if(keyPressedMultiply){// 12y
console.log('if 12');
// call sub operandLoader.
operandLoader();
updDebug();
lcd.innerHTML=null;
}else{// 12n
// 13 is the else of 12
// 13
if(keyPressedDivide){// 13y
console.log('if 13');
// call sub operandLoader.
operandLoader();
updDebug();
lcd.innerHTML=null;
}else{// 13n
// 14 is the else of 13
// 14
if(keyPressedPercentage){// 14y
console.log('if 14');
// 14 is the else of 13
// call sub operandLoader.
operandLoader();
updDebug();
lcd.innerHTML=null;
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
if(operand1===null && isNaN(keyPressed) && keyPressed!=='.'){
alertColor.backgroundColor='darkgreen';
 notif.innerHTML=`
      🙂 Your first entry must be a number!`;
 return;}
  if(alertColor.backgroundColor==='darkred'){return}
 alertColor.backgroundColor='transparent';
 notif.innerHTML='';
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
subtotal=operand1;// @@@@
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
subtotal=operand1;//@@@
subTot.innerHTML=operand1;
return;
// Mode3: Entry of a number after final result (in other words, after pressing the equals. This signals an intention to start a whole new calculation. 
}else if(operand1!==null && operand2!==null && finalResult!==null && !isNaN(keyPressed)){
// Procedure: preserve the number, clear whole calculator, restore the number, and let switchCalcModes() handle it.

// Preserve number environment:
// example:
// keyPressedUnary=true;
// keyPressedNumber=true;
// keyPressed=0;
const preservedkeyPressedUnary=keyPressedUnary;
const preservedkeyPressedNumber=keyPressedNumber;
const preservedKeyPressed=keyPressed;

// clear whole calculator
clear();

// Restore number and its environment
keyPressedUnary=preservedkeyPressedUnary;
keyPressedNumber=preservedkeyPressedNumber;
keyPressed=preservedKeyPressed;

// Process the number entry as usual
switchCalcModes();
subtotal=operand1;// @@@@
subTot.innerHTML=operand1;
return;
}else{
main();
}
return;
}

// Test
function test(){

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
console.log('rightZeroesCount: ', rightZeroesCount);
return rightZeroesCount;
}

let num=33200000.0000;
rightmostZeroCounter(num);
}
const testBtn=document.querySelector ('#test');
testBtn.addEventListener('click', test);
