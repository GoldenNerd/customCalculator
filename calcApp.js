//"use strict";

// global variables
let keyPressed;
let colorsOfNumsOnLcdIsDefault = true;
let operand1 = null;
let operand2 = null;
let operator = null;
let finalResult = null;
let preservedFinalResult = null;
let preservedEqualsResult = null;
let currentOpKey = null;
let numInMem = null;
let subtotal = null;
let previousOpKey = null;
let keyFormatListenerFlag;
let previousOperand;
let calcFatalLock;
let preventRecycleBullet;

// Flags used by operators event listeners
let keyPressedUnary = null;
let keyPressedNumber = false;
let keyPressedDot = false;
let keyPressedExp = false;
let keyPressedChgSign = false;
let keyPressedBackspace = false;
let keyPressedInv = false;
let keyPressedSqrt = false;
let keyPressedSquare = false;
let keyPressedAdd = false;
let keyPressedSubstract = false;
let keyPressedMultiply = false;
let keyPressedDivide = false;
let keyPressedPercentage = false;
let keyPressedEquals = false;
let keyPressedMS = false;
let keyPressedMR = false;
let keyPressedMC = false;
let keyPressedFormat = false;
let elementOfPressedOperator = null;

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
const subTot = document.querySelector('#sub-tot');

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
const lcd = document.querySelector('#lcd');
// Bullets area
const bulletText = document.querySelector('#bullet-text');
const bulletinBoard = document.querySelector ('#bulletin-board');

// English language messages:
const engBullets = {
  /* there are 3 message categories:
  inf - Informational; informs the user that Calc performed an action to correct a minor mistake by the user, and no further action is required by the user.
  int - Interventional; Calc detected user entries that are abnormal, but it can recover from the entry error if the user does a simple correction.
  fat - Fatal: Calc detected anomaly in the user entries and is unable to recover from the errors. Consequently it had to terminate the current calculation and reset to start a new whole calculation. It could also request user to reset Calculator and start all over again.
  clr - Clear the bullet area.
  tst - Test message for debugging purposes
  */
  inf00: `😁 Welcome to EASYCALC 😁\nYour arithmetics assistant.`,
  inf01: `Oops! Nothing was saved.\nBut beware!\nSaving nothing to memory erases the memory content. Continue.`,
  inf02: `Oops! Nothing was retrieved.\nMemory was empty. Continue.`,
  inf03: `That last dot was redundant.\nI ignored it. Continue.`,
  inf04: `That last "e" was redundant.\nI ignored it. Continue.`,
  inf05: `Nothing was done! CALC does not invert zero. Continue.`,
  inf06: `Unary operator rejected! CALC expects a number after a binary operator. Continue.`,
  int09: `Now in Recycle Mode. Permission to edit result is enabled. Continue.`,
  inf08: `Sorry.\nCALC does not process either negative or positive zero.\nContinue.`,
  inf09: `I ignored your wrong attempt to use 'e' as the starting digit of a new calculation. Continue.`,
  int00: `Try with a smaller number\nThe amount of decimal digits of your original number was not that large.`,
  int01: `CALC tip:\nFor a positive exponent delete the negative sign using the backspace key.`,
  int02: `Now in Recycle Mode. Press your key again to modify the final result.`,
  int03: `Oops! Couldn't do it.\nTry again with a non zero value.`,
  int04: `Oops! Try again with a non zero value.\nEntries so far ${operand1} ${operator}`,
  int05: `Sorry! Change number sign, or clear to start afresh. This version of CALC can't determine square roots of negative numbers.`,
  int06: `Not possible!\nEither no number on display,\nor can't format at this stage.`,
  int07: `Not possible! All new calculations must start with a number or a dot!`,

  int08: `Your previous key press was also an operator. \nEither enter your next number now, OR Press now the desired operator to continue\nEntries so far:`,
  /*
  int08: `Your previous key press was also an operator. Either enter your next number now, OR Press now the desired operator to continue.`,
    */
  inf10: `I ignored that last dot! \nThis CALC version can not handle decimal exponential. Continue.`,
  fat00: `Sorry! I can't divide by zero.\n I had to cancel and clear.`,
  fat01: `Wrong! Two numbers and an operator are needed to determine a final result. You must clear before proceeding.`,
  fat02: `Error. This version of CALC does not divide by zero.\nYou must clear to proceed.`,
  fat03: `Sorry! Two numbers and an operator are required for a calculation. You must clear before proceeding. But your subtotal will be in Memory.`,
  fat04: `I'm sorry!\nThis CALC version can not handle the exponential value you entered.`,
  fat05: `Apologies.\n Division by zero is not allowed. You must press the clear key to resume CALC.`,
  clr00: ``,
  tst00: `Notice!\nThis is a mocked error message\nIt is for test purposes only.`
};

// Spanish language messages:
const spaBullets = {
  /* there are 3 message categories:
  inf - Informational; informs the user that Calc performed an action to correct a minor mistake by the user, and no further action is required by the user.
  int - Interventional; Calc detected user entries that are abnormal, but it can recover from the entry error if the user does a simple correction.
  fat - Fatal: Calc detected anomaly in the user entries and is unable to recover from the errors. Consequently it had to terminate the current calculation and reset to start a new whole calculation. It could also request user to reset Calculator and start all over again.
  clr - Clear the bullet area.
  tst - Test message for debugging purposes
  */
  inf00: `😁 Bienvenido a EASYCALC 😁\nSu asistente aritmético.`,
  inf01: `¡Vaya! Nada se guardó a memoria.\nPero tenga en cuenta que guardar nada a la memoria borra su contenido. Continue.`,
  inf02: `¡Vaya! Nada se extrajo de memoria. Estaba vacía. Continue.`,
  inf03: `Su número ya contenía un punto.\nPor tanto ignoré este último punto.\nContinue.`,
  inf04: `Su número ya contenía una "e".\nPor tanto ignoré esta última "e".\nContinue.`,
  inf05: `No se hizo nada. CALC no invierte cero. Continue.`,
  inf06: `Operador unitario rechazado. CALC requiere un number después de un operador binario. Continue.`,
  int09: `Modo de reciclaje. Se permite modificar el resultado en pantalla. Continue.`,
  inf08: `Disculpe.\nCALC no procesa ceros negativos ni positivos.\nContinue.`,
  inf09: `I ignored your wrong attempt to use 'e' as the starting digit of a new calculation. Continue.`,
  int00: `Use un número menor. La cantidad de lugares decimales de su número original no era tan grande. \n Intente otra vez con un número más pequeño.`,
  int01: `Para un exponencial positivo, borre el signo negativo con la tecla de borrar.`,
  int02: `Calc entró al Modo de Reciclaje.  Presione su tecla nuevamente para modificar el resultado en pantalla.`,
  int03: `¡Vaya! No es posible.\nTrate nuevamente con un valor que no sea cero.`,
  int04: `Trate nuevamente con un valor que no sea cero.\nDatos hasta ahora: ${operand1} ${operator}`,
  int05: `No es posible. Cambie el signo a positivo, o presione "C" para iniciar un nuevo cálculo. Esta versión de CALC no procesa raíz cuadrada de números negativos.`,
  int06: `No es posible.\n¡Se requiere un número en pantalla para utilizar esta función!`,
  int07: `Error.\n¡Todo nuevo cálculo debe comenzar con un dígito o un punto!`,
  /*
    int08: `Error. Usted ya había entrado un operador. Lo que ha entrado hasta ahora es:\n${operand1} ${keyPressed}\n
    Para continuar: Entre su próximo número, O Presione el operador deseado ahora.`,
    */
  int08: `Usted ya había entrado un operador. Para continuar: Entre su próximo número, O Presione el operador deseado ahora.\nDatos hasta ahora:`,
  inf10: `Ignoré ese último punto. \nEsta versión de CALC version no puede procesar exponenciales decimales. Continue.`,
  fat00: `Lo lamento. No es posible dividir por cero.\nTuve que cancelar su cálculo. Comience un nuevo cálculo`,
  fat01: 'Error. Se requieren dos números y un operador para obtener un resultado final. Debe oprimir la tecla "C", y comenzar de nuevo.',
  fat02: `Error. Usted intentó dividir por cero.\nTendrá que oprimir la tecla "C".`,
  fat03: 'Error. Se requieren dos números y un operador para realizar un cálculo. Tendrá que oprimir la tecla "C", pero su subtotal estará en Memoria.',
  fat04: `No es posible.\nEsta version de CALC solo puede manejar exponenciales enteros.`,
  fat05: `Error.\nTendrá que oprimir la tecla "C" para continuar.\nCALC no puede dividir por cero.`,
  clr00: ``,
  tst00: `¡Atención!\nEste es la simulación de un mensaje de error.\nTan solo con propósitos de prueba.`
};

// Bullet colors
const bulletStyles = {
  inf: {
    bg: 'var(--bulletin_board-inf_bg)',
    txt: 'var(--bulletin_board-inf_txt)'
  },
  int: {
    bg: 'var(--bulletin_board-int_bg)',
    txt: 'var(--bulletin_board-int_txt)'
  },
  fat: {
    bg: 'var(--bulletin_board-fat_bg)',
    txt: 'var(--bulletin_board-fat_txt)'
  },
  clr: {
    bg: 'var(--bulletin_board-clr_bg)',
    txt: 'var(--bulletin_board-clr_txt:)'
  },
  tst: {
    bg: 'var(bulletin_board-tst_bg)',
    txt: 'var(--bulletin_board-tst_txt)'
  },
  greet: {
    bg: 'var(--bulletin_board-greet_bg)',
    txt: 'var(--bulletin_board-greet_txt)'
  }
};

// Func that posts a bullet:
function postABullet (bulletCode, bulletinBoardColor, bulletColor) {
  // Select language for bullet
  let bulletLang;
  if (englishLanguageRadio.checked) {
    bulletLang = 'engBullets';
  } else if (spanishLanguageRadio.checked) {
    bulletLang = 'spaBullets';
  } else {
    // NOP same pattern as above for future languages
  }
  bulletText.style.color = bulletColor;
  const bulletWording = eval("`${".concat(bulletLang) + ".".concat(bulletCode) + "}`");
  const bulletVariables = ` ${operand1} ` + operator;
  if (bulletCode !== 'int08') {
    bulletText.textContent = bulletWording;
  } else {
    bulletText.textContent = bulletWording + bulletVariables;
  }
  if (bulletCode.includes('fat')) {
    calcFatalLock = true;
  }
  bulletinBoard.style.backgroundColor=bulletinBoardColor;
}

// Axiliary function of reset:
function updDebug () {
  lastOpDispl.innerHTML = operator; // magenta colored last op on LCD upper left hand corner
  // DEVELOPER DEBUG VISIBILITY:
  lastOpDebug.innerHTML = operator;
  lcdDebug.innerHTML = lcd.innerHTML;
  operand1Debug.innerText = operand1;
  operand2Debug.innerHTML = operand2;
  opNowDebug.innerText = operator;
  resultDebug.innerHTML = finalResult;

  subTot.innerHTML = subtotal; // Part of the app
  return;
}

function eraseBillBoard () {
  postABullet('clr00', bulletStyles.clr.bg, bulletStyles.clr.txt);
  // bulletText.innerHTML = '';
  // bulletinBoard.style.backgroundColor='transparent';
}

function defaultKeysColor () {
  const allOpKeys = document.querySelectorAll('.key');
  for (let key of allOpKeys) {
    key.style.color = 'var(--key-symb-all-normal)';
  }
}
const helpBtn = document.querySelector('#help');

function showHelpBtn () {
  setTimeout(function() {
    appSettingsMenu.style.zIndex = '1';
    helpBtn.style.zIndex = '3';
    helpBtn.style.opacity = '1';
    appSettingsMenu.style.opacity = '0';
    helpBtn.style.transition = 'all ease-in 1s';
    setTimeout(function() {
      helpBtn.style.transition = 'all 4s ease-out';
      helpBtn.style.opacity = '0';
      appSettingsMenu.style.opacity = '1';
      setTimeout(function() {
        helpBtn.style.transition = 'all ease-in 1s';
        helpBtn.style.zIndex = '1';
        appSettingsMenu.style.zIndex = '3';
      }, 4010);
    }, 4000);
  }, 0);
}

function greet () {
  postABullet('inf00', bulletStyles.greet.bg, bulletStyles.greet.txt);
  /*
  bulletText.innerHTML=`           😁 Welcome to EASYCALC 😁
             Your arithmetics assistant.
                 For help press ❔`;
  */
  // bulletText.style.color='var(--noti-greeting_txt)';
  // bulletinBoard.style.backgroundColor='var(--bulletin_board-greet_bg)';
}

function resetCalculator () {
  colorsOfNumsOnLcdIsDefault = true;
  operand1 = null;
  operand2 = null;
  operator = null;
  finalResult = null;
  preservedEqualsResult = null;
  keyPressedUnary = null;
  keyPressedNumber = false;
  keyPressedDot = false;
  keyPressedExp = false;
  keyPressedChgSign = false;
  keyPressedBackspace = false;
  keyPressedInv = false;
  keyPressedSqrt = false;
  keyPressedSquare = false;
  keyPressedAdd = false;
  keyPressedSubstract = false;
  keyPressedMultiply = false;
  keyPressedDivide = false;
  keyPressedPercentage = false;
  keyPressedEquals = false;
  keyPressedMS = false;
  keyPressedMR = false;
  keyPressedMC = false;
  keyPressedFormat = false;
  lcd.innerHTML = null;
  eraseBillBoard();
  subtotal = null;
  calcFatalLock = false;
  updDebug();
  lastOpDispl.innerHTML = 'C';
  keyFormat.removeEventListener('click', enterFormatModal);
  keyFormatListenerFlag = false;
  hideAppConfigModal();
  return;
}

function xtenddedCalcReset () {
  resetCalculator();
  defaultKeysColor();
  fetchPersistentUserConfiguration();
  applyTheme();
  applyLanguage();
  toggleDevelopmentDataPanel();
  blinkColorOfKeySymbol(clearKey, 'var(--key-symb-op-active)');
}

// Initialize calc
window.onload = function() {
  xtenddedCalcReset();
  greet();
  return;
};

// Key Presses - Event listeners for Memory and Format key presses:
keyMS.addEventListener('click', ()=> {
  keyPressedMS = true;
  keyMS.style.color = 'var(--key-symb-ms)';
  memoryHandler();
  setTimeout(()=> {
    // Chk Mem content after saving.
    if (numInMem === null || numInMem === '') {
      postABullet('inf01', bulletStyles.inf.bg, bulletStyles.inf.txt);
      /*
  bulletText.innerHTML=`Error, nothing was saved.\nBut saving nothing erases memory.`;
    bulletinBoard.style.backgroundColor='var(--bulletin_board-inf_bg)';
    bulletText.style.color='var(--noti-board-txt)';
  */
      blinkColorOfKeySymbol(keyMS);
    }
  },
    0);
});
keyMR.addEventListener('click', ()=> {
  keyPressedMR = true;
  memoryHandler();
});
keyMC.addEventListener('click', () => {
  keyPressedMC = true;
  //keyMS.style.color = 'var(--lcd-num-typed)';
  memoryHandler();
});

// The keyFormat Listener is programmatically controlled to enable or disable the Format Modal
keyFormat.addEventListener('click', () => {
  if (modalScreenTempDisabled()) {
    // Do not show format modal
    blinkColorOfKeySymbol(keyFormat)
    return;
  }
  blinkColorOfKeySymbol(keyFormat, 'var(--key-symb-op-active)')

  //applyColorToAllKeySymbols(keyFormat,'var(--lcd-num-typed)');
});
keyFormat.addEventListener('click', backupNumDisplayed);
keyFormat.addEventListener('click', stdScientificDigitCount);

// Key Presses - Event listeners for unary key presses:
clearKey.addEventListener('click', () => {
  xtenddedCalcReset();
});
key0.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedNumber = true;
  keyPressed = 0;
  switchCalcModes();
});
key1.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedNumber = true;
  keyPressed = 1;
  switchCalcModes();
});
key2.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedNumber = true;
  keyPressed = 2;
  switchCalcModes();
});
key3.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedNumber = true;
  keyPressed = 3;
  switchCalcModes();
});
key4.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedNumber = true;
  keyPressed = 4;
  switchCalcModes();
});
key5.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedNumber = true;
  keyPressed = 5;
  switchCalcModes();
});
key6.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedNumber = true;
  keyPressed = 6;
  switchCalcModes();
});
key7.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedNumber = true;
  keyPressed = 7;
  switchCalcModes();
});
key8.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedNumber = true;
  keyPressed = 8;
  switchCalcModes();
});
key9.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedNumber = true;
  keyPressed = 9;
  switchCalcModes();
});
dotKey.addEventListener('click', ()=> {
  keyPressedUnary = true;

  const colorOfNumOnLCD = lcd.style.color;
  if (colorOfNumOnLCD === 'var(--lcd-num-result)') {
    keyPressedNumber = true;
    keyPressed = '0.';
  } else {
    keyPressedDot = true;
    keyPressed = '.';
  }
  switchCalcModes();
});
expKey.addEventListener('click', ()=> {
  keyPressedUnary = true;

  const colorOfNumOnLCD = lcd.style.color;
  if (colorOfNumOnLCD === 'var(--lcd-num-result)') {
    resetCalculator();
    chgColorOfNumOnLCD();
    postABullet('inf09', bulletStyles.inf.bg, bulletStyles.inf.txt);
    /* I ignored your wrong attempt to use 'e' as the starting digit of a new calculation. Continue.
    */
    blinkColorOfKeySymbol(expKey);
  } else {
    keyPressedExp = true;
    keyPressed = 'e-';
    elementOfPressedOperator = expKey;
    switchCalcModes();
  }
});

function applyColorToAllKeySymbols (opKeyTouched, defaultColorForAllKeySymbols) {
  /*The color of all symbols of all keys (elements with the class of ".key") will be colored to the color held by the "defaultColorForAllKeySymbols" variable. This color is the normal (default) color of all keys after app initialization.
  */
  const allOpKeys = document.querySelectorAll('.key');
  for (let key of allOpKeys) {
    key.style.color = defaultColorForAllKeySymbols;
  }
  /* However, the symbol of the key that was touched, will be set to the color of that particular key in its actuated state. Actuated state is only be visible for unary and binary operator keys. Numbers, dot, and, e do not change symbol's color when actuated.
  */
  opKeyTouched.style.color = 'var(--key-symb-op-active)';
}

function blinkColorOfKeySymbol (keyToBlink, blinkColor = 'var(--key-symb-op-denyed)') {
  keyToBlink.style.color = blinkColor;
  setTimeout(()=>keyToBlink.style.color = 'var(--lcd-num-typed)', 450);
}

changeSignKey.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedChgSign = true;
  keyPressed = '&#177';
  elementOfPressedOperator = changeSignKey;
  applyColorToAllKeySymbols(changeSignKey, 'var(--lcd-num-typed)');
  // invertKey.style.color='#20b2d8';

  switchCalcModes();
});
backspaceKey.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedBackspace = true;
  keyPressed = '&#x232b';
  elementOfPressedOperator = backspaceKey;
  applyColorToAllKeySymbols(backspaceKey, 'var(--lcd-num-typed)');
  // invertKey.style.color='#20b2d8';

  switchCalcModes();
});
invertKey.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedInv = true;
  keyPressed = '1/x';
  elementOfPressedOperator = invertKey;
  applyColorToAllKeySymbols(invertKey, 'var(--lcd-num-typed)');
  // invertKey.style.color='#20b2d8';

  switchCalcModes();
});
sqrtKey.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedSqrt = true;
  keyPressed = '&#x221a;';
  elementOfPressedOperator = sqrtKey;
  applyColorToAllKeySymbols(sqrtKey, 'var(--lcd-num-typed)');
  // sqrtKey.style.color='#20b2d8';

  switchCalcModes();
});
squareKey.addEventListener('click', ()=> {
  keyPressedUnary = true;
  keyPressedSquare = true;
  keyPressed = 'x²';
  elementOfPressedOperator = squareKey;
  applyColorToAllKeySymbols(squareKey, 'var(--lcd-num-typed)');
  // squareKey.style.color='#20b2d8';

  switchCalcModes();
});

// Key Presses - Event listeners for binary key presses:
sumKey.addEventListener('click', ()=> {
  keyPressedUnary = false;
  keyPressedAdd = true;
  keyPressed = '+';
  elementOfPressedOperator = sumKey;
  previousOperand = lcd.innerHTML; // ~
  applyColorToAllKeySymbols(sumKey, 'var(--lcd-num-typed)');
  switchCalcModes();
});
minusKey.addEventListener('click', ()=> {
  keyPressedUnary = false;
  keyPressedSubstract = true;
  keyPressed = '-';
  elementOfPressedOperator = minusKey;
  previousOperand = lcd.innerHTML; // ~
  applyColorToAllKeySymbols(minusKey, 'var(--lcd-num-typed)');
  switchCalcModes();
});
multiplyKey.addEventListener('click', ()=> {
  keyPressedUnary = false;
  keyPressedMultiply = true;
  keyPressed = '×';
  elementOfPressedOperator = multiplyKey;
  previousOperand = lcd.innerHTML; // ~
  applyColorToAllKeySymbols(multiplyKey, 'var(--lcd-num-typed)');
  switchCalcModes();
});
divideKey.addEventListener('click', ()=> {
  keyPressedUnary = false;
  keyPressedDivide = true;
  keyPressed = '÷';
  elementOfPressedOperator = divideKey;
  previousOperand = lcd.innerHTML; // ~
  applyColorToAllKeySymbols(divideKey, 'var(--lcd-num-typed)');
  switchCalcModes();
});
percentageKey.addEventListener('click', ()=> {
  keyPressedUnary = false;
  keyPressedPercentage = true;
  keyPressed = '%';
  elementOfPressedOperator = percentageKey;
  previousOperand = lcd.innerHTML; // ~
  applyColorToAllKeySymbols(percentageKey, 'var(--lcd-num-typed)');
  switchCalcModes();
});
equalKey.addEventListener('click', ()=> {
  keyPressedUnary = false;
  keyPressedEquals = true;
  keyPressed = '=';
  elementOfPressedOperator = equalKey;
  applyColorToAllKeySymbols(equalKey, 'var(--lcd-num-typed)');
  equalKey.style.color = 'var(--key-symb-equal)';
  main();
});

// ################################
// MR with empty LCD. Treat memory content as a new single number entry.
function treatAsDigitKeyPress (num = numInMem) {
  // Preset the environment
  keyPressedUnary = true;
  keyPressedNumber = true;
  keyPressed = numInMem; // Treat numInMem number as a regular number key press
  // Channel service request
  switchCalcModes();
  // Reset flag
  keyPressedMR = false;
  return;
}
let memoryOnLCD = document.querySelector('#memoryOnLCD');

// ################################
// Memory behavior (MS, MC, MR)
function memoryHandler () {
  hideAppConfigModal();
  // OK ********************************
  if (keyPressedMS) {
    // MS: Save LCD to memory (override numInMem with LCD contents)
    numInMem = lcd.innerHTML;
    memoryOnLCD.innerHTML = numInMem;
    keyPressedMS = false;
    return;
    //********************************
  } else if (keyPressedMC) {
    // MC: Clear memory
    numInMem = '';
    memoryOnLCD.innerHTML = ''; // Non-debug item. It is part of Calc.
    keyPressedMC = false; // Reset flag
    blinkColorOfKeySymbol(keyMC, 'var(--key-symb-op-active)');
    eraseBillBoard();
    keyMS.style.color = 'var(--lcd-num-typed)';
    // MEMORY RECALL BEHAVIOR
  } else if (keyPressedMR) {
    //********************************
    if (numInMem === null || numInMem === '') {
      // Forbidden: Attempting retrieval from memory when numInMem is empty.
      postABullet('inf02', bulletStyles.inf.bg, bulletStyles.inf.txt);
      // Error: 'Nothing in memory'.
      /*
  bulletText.innerHTML=`
                     ⚠  Error
         There is nothing in memory.
         continue.`;
      bulletinBoard.style.backgroundColor='var(--bulletin_board-inf_bg)'; // '#3cc4ef';
      bulletText.style.color='var(--noti-board-txt)';
  */
      blinkColorOfKeySymbol(keyMR);
      keyPressedMR = false;
      return;
    }
    //********************************
    blinkColorOfKeySymbol(keyMR, 'var(--key-symb-op-active)');
    if (operand1 === '' || operand1 === null) {
      // MR with empty LCD. Treat memory content as a new single number entry.
      treatAsDigitKeyPress();
      return;

      // ********************************
    } else if (operand1 !== null && operator === null) {
      // If just a number on display with no subsequent operator, supplant number with numInMem. Simple
      operand1 = null;
      treatAsDigitKeyPress();
      return;
      // ********************************
    } else if (operand1 !== null && operator !== null && operand2 === null) {
      // This is when user has already entered 1st operand, operator, and rather than entering a next number, user retrieves memory. In this case is like numInMem is a new digit key pressed.
      treatAsDigitKeyPress();
      return;
      // ********************************
    } else if (operand1 !== null && operator !== null && operand2 !== null && finalResult === null) {
      // This is when user has already entered 1st operand, operator, and 2nd operand,and rather than entering a next operator, or an equal sign, user retrieves memory. This tells calc to supplant the 2nd operand (on LCD) with numInMem content.
      operand2 = null;
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
    } else {
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
const originalDigits = document.querySelector('#original-format-decimals');
function backupNumDisplayed () {
  //console.log('lcd.innerHTML', lcd.innerHTML);
  if (lcd.innerHTML === '') {
    originalDigits.innerHTML = null;
  } else if (lcd.innerHTML === '0') {
    originalDigits.value = 0;
  } else {
    // Adding zero before saving removes all trailing zeroes, and removes repeat leading zeroes
    // lcdBackup=parseFloat(lcd.innerHTML)+0;
    lcdBackup = lcd.innerHTML;
    lcd.innerHTML = lcdBackup;
    originalDigits.innerHTML = decimalCount(lcdBackup);
  }
  return
}

// Enter Format Modal. This is upon pressing the green "Go" button.
const formatModal = document.querySelector('#format-modal');
const keyBoard = document.querySelector('#keys');

let modalStartedFlag;
function enterFormatModal () {
  hideAppConfigModal();
  // Test the applicability of this function. It's only valid for exponential numbers, with integer exponential values.
  if (!Number.isInteger(1*xtract.exponentialValue(lcdBackup))) {
    postABullet('fat04', bulletStyles.fat.bg, bulletStyles.fat.txt);
    // error: This Calculator  version can only handle integer exponentials.
    // console.log('error: This Calculator  version can only handle integer exponentials.');

    return;}
  formatModal.style.opacity = '1';
  formatModal.style.zIndex = '1';
  //formatModal.style.position='relative';
  //formatModal.style.height='fit-content';
  //formatModal.style.left='0';
  //keyBoard.style.position='absolute';
  //keyBoard.style.right='101vw';
  keyBoard.style.opacity = '0';
  return;
}

// SHOW OR HIDE CHOICES AND PANELS:
// Firstly grab needed elements
const originalFormatSelectorRadioBtn = document.querySelector('li:first-child');
const roundOffRadioSelector = document.querySelector('#roundoff-choice');
const scientificRadioSelector = document.querySelector('#scientific-choice');
const originalInfoPanel = document.querySelector('#original-panel');
const roundOffInfoPanel = document.querySelector('#round-panel');
const scientificInfoPanel = document.querySelector('#scientific-panel');
// All hide functions:
function hideOriginalRadioSelector () {
  originalFormatSelectorRadioBtn.style.opacity = '0';
}
function hideOriginalInfoPanel () {
  originalInfoPanel.style.opacity = '0';
}
function hideRoundOffInfoPanel () {
  roundOffInfoPanel.style.opacity = '0';
}
function hideScientificInfoPanel () {
  scientificInfoPanel.style.opacity = '0';
}
// All show functions
function showOriginalRadioSelector () {
  originalFormatSelectorRadioBtn.style.opacity = '1';
}
function showOriginalInfoPanel () {
  originalInfoPanel.style.opacity = '1';
  hideRoundOffInfoPanel();
  hideScientificInfoPanel();
}
originalFormatSelectorRadioBtn.addEventListener('click', showOriginalInfoPanel);
const originalFormatRadioBtn = document. querySelector('#original-format-choice');
originalFormatRadioBtn.addEventListener('click', applySelectedFormat);

function showRoudOffPanel () {
  roundOffInfoPanel.style.opacity = '1';
  hideOriginalInfoPanel();
  hideScientificInfoPanel();
}
roundOffRadioSelector.addEventListener('click', showRoudOffPanel);
function showScientificfPanel () {
  scientificInfoPanel.style.opacity = '1';
  hideOriginalInfoPanel();
  hideRoundOffInfoPanel();
}
scientificRadioSelector.addEventListener('click', showScientificfPanel);

// Reset panels and choices view to initial (default) state

function initModalState () {
  hideOriginalRadioSelector();
  hideOriginalInfoPanel();
  hideRoundOffInfoPanel();
  hideScientificInfoPanel();
  originalFormatRadioBtn.checked = true;
  roundOffRadioSelector.checked = false;
  scientificRadioSelector.checked = false;
  lcdBackup = '';
  originalDigits.value = '';
  roundOffDigits.value = '';
  ScientificDigitsDisplay.value = '';
}

function roundOffReqValid () {
  const OriginalFractionalPart = xtract.fractionalPart(lcdBackup);
  const originalExponential = xtract.exponentialValue(lcdBackup);
  const originalDecimalPlaces = OriginalFractionalPart.length-originalExponential;
  if (originalDecimalPlaces-roundOffDigits.value < 0) {
    return false;
  }
  return true;
}

// Round-off for round-off format
const roundOffDigits = document.querySelector('#decimals');
function roundOff(num) {
  if (!roundOffReqValid()) {
    // Report error and abort
    postABullet('int00', bulletStyles.int.bg, bulletStyles.int.txt);
    /*
  bulletText.innerHTML=`Error. The number of decimal digits of your original number was not that large. \n Please try with a smaller number.`;
  */
    // bulletText.style.color='var(--bulletin_board-fatal_err-txt)';
    // bulletinBoard.style.backgroundColor='var(--bulletin_board-fatal_err-bg)';
    return;
  }
  const roundedOff = Math.round(num*10**roundOffDigits.value)/(10**roundOffDigits.value);
  return roundedOff;
}

// Determine if a number contains a dot
function hasDot(num) {
  const dotIsPresent = num.toString().includes('.');
  return dotIsPresent;
}

// Determine the amount of digits in a number
let digitsCount = (num)=> {
  num = num.toString();
  if (hasDot(num) && num < 0) {
    // -0.1
    const digitCount = num.length-2;
    // console.log('digitCount: ', digitCount);
    return digitCount;

  } else if (hasDot(num) && num >= 0) {
    // 0.4
    const digitCount = num.length-1;
    // console.log('digitCount: ', digitCount);
    return digitCount;

  } else if (!hasDot(num) && num < 0) {
    // -1
    const digitCount = num.length-1;
    // console.log('digitCount: ', digitCount);
    return digitCount;

  } else if (!hasDot(num) && num >= 0) {
    // 1
    const digitCount = num.length;
    // console.log('digitCount: ', digitCount);
    return digitCount;
  } else {
    // NOP
  }
};

function leftmostZeroCounter(num) {
  if (num < 0) {
    num = num*(-1); //Negative sign does not count as digit. Strip the neg sign.
  }// continue...
  num = num.toString();
  // Chop off all leftmost zeroes and dot
  let zeroesCount = 0;
  for (let digit of num) {
    if (digit === '0') {
      zeroesCount++;
    } else if (digit === '0' || digit === '.') {
      num = num.slice(0, 1);
      // console.log('num', num);
    } else {
      // console.log('zeroesCount', zeroesCount);
      return zeroesCount;
    }
  }
}

function reverseString(str) {
  const reversedStr = str.split("").reverse().join("");
  return reversedStr;
}

function rightmostZeroCounter(num) {
  // Stringify number
  const strNum = num.toString();
  // Reverse stringified number
  let revStrNum = reverseString(strNum);
  const rightZeroesCount = leftmostZeroCounter(revStrNum);
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
const ScientificDigitsDisplay = document. querySelector('#significant');
function stdScientificDigitCount() {
  ScientificDigitsDisplay.value = scientificDigitsCount();
}

function supplantOrigOperand (changedNum) {
  if (operator === null) {
    operand1 = changedNum.toString();
    lcd.innerHTML = operand1;
  } else {
    operand2 = changedNum.toString();
    lcd.innerHTML = operand2;
  }
  updDebug();
  lastOpDispl.innerHTML = '&#x2704;';
  return;

}

// Change format of number displayed without altering its value.

// const scientificRadioSelector=document.querySelector('#scientific-choice');

function applySelectedFormat() {
  hideAppConfigModal();
  eraseBillBoard();
  applyColorToAllKeySymbols(keyFormat, 'var(--lcd-num-typed)');
  if (originalFormatRadioBtn.checked) {
    lcd.innerHTML = lcdBackup;
    supplantOrigOperand(lcdBackup);
    return;

  } else if (roundOffRadioSelector.checked) {
    const roundedNum = roundOff(lcdBackup);
    supplantOrigOperand(roundedNum);
    return;

  } else if (scientificRadioSelector.checked) {

    const scientificNum = parseFloat(lcdBackup).toExponential(parseInt(ScientificDigitsDisplay.value-1));
    supplantOrigOperand(scientificNum);
    applyColorToAllKeySymbols(keyFormat, 'var(--lcd-num-typed)');
    return;

  } else {
    // NOP
    // const exponent=integerCount-1;
    // console.log('exponent: ', exponent);
  }
}
const goBtn = document.querySelector('#apply-format');
goBtn.addEventListener('click', applySelectedFormat);
goBtn.addEventListener('click', showOriginalRadioSelector);
// Format mode display exit behavior. This is upon pressing the red "X" button.
function exitFormatModal () {
  hideAppConfigModal();
  formatModal.style.opacity = '0';
  formatModal.style.zIndex = '0';
  //formatModal.style.position='absolute';
  //formatModal.style.height='fit-content';
  //formatModal.style.right='0';
  //keyBoard.style.position='relative';
  //keyBoard.style.right='0';
  keyBoard.style.opacity = '1';
  eraseBillBoard();
  return;
}
const quitBtn = document.querySelector('#quit-format');
quitBtn.addEventListener('click', exitFormatModal);
quitBtn.addEventListener('click', initModalState);

// This function performs tasks to enable correct behavior of other functions that need various of their tasks performed at this point of the program.
function miscTasks () {
  previousOpKey = operator; // Every numeric appended preserves the last operator (if any). Will be used for checkDivByZero() function.
  keyFormat.addEventListener('click', enterFormatModal); // Enable format modal once something is on LCD
  keyFormatListenerFlag = true;
  chgColorOfNumOnLCD(); // Reset to initial color
  return;
}

// To handle attempts to write multiple dots to an operand
function rejectRepeatDot () {
  const numOnLCD = lcd.innerHTML;
  let rejectDot;
  if (keyPressed !== '.') {
    // Not a dot. No need to test
    rejectDot = false;
    return rejectDot;
  }
  if (keyPressed === '.' && numOnLCD.indexOf('e') >= 0 && colorsOfNumsOnLcdIsDefault) {
    // Attempt to input a decimal exponentialValue
    rejectDot = true;
    postABullet('inf10', bulletStyles.inf.bg, bulletStyles.inf.txt);
    /*
  inf10: `I ignored that last dot! \nThis CALC version can not handle decimal exponential. Continue.
      */
    // Reset variable to get it ready for subsequent use
    blinkColorOfKeySymbol(dotKey);
    keyPressedDot = false;
    return rejectDot;
  }
  if (keyPressed === '.' && numOnLCD.indexOf('.') >= 0 && colorsOfNumsOnLcdIsDefault) {
    // keyPressed is a dot. Test for dot repetition:
    rejectDot = true;
    postABullet('inf03', bulletStyles.inf.bg, bulletStyles.inf.txt);
    /*
  bulletText.innerHTML=`Your duplicate dot was ignored. \nContinue.`;
       bulletText.style.color='var(--noti-board-txt)';
       bulletinBoard.style.backgroundColor='var(--bulletin_board-inf_bg)';
      */
    // Reset variable to get it ready for subsequent use
    blinkColorOfKeySymbol(dotKey);
    keyPressedDot = false;
    return rejectDot;
  }
  if (keyPressed === '.' && numOnLCD.indexOf('.') >= 0 && !colorsOfNumsOnLcdIsDefault) {
    // A dot that belongs to a next number entry; number that is expected after last operator entry.
    rejectDot = false;
    return rejectDot;
  }


  // For all other non dot keyPressed.
  rejectDot = false; // Allow normal execution of appendDigit()
  return rejectDot;
}

// To handle attempts to write multiple 'e' to an operand
function multipleExpsErr () {
  const numOnLCD = lcd.innerHTML;
  let ignoreE;
  if (keyPressed !== 'e-') {
    // Not an e. No need to test
    ignoreE = false;
    return ignoreE;
  }
  if (keyPressed === 'e-' && numOnLCD.indexOf('e') >= 0 && colorsOfNumsOnLcdIsDefault) {
    // keyPressed is an e. Test for e repetition:
    ignoreE = true;
    postABullet('inf04', bulletStyles.inf.bg, bulletStyles.inf.txt);
    /*
  bulletText.innerHTML=`Your duplicate 'e' was ignored. Continue.`;
    bulletText.style.color='var(--noti-board-txt)';
    bulletinBoard.style.backgroundColor='var(--bulletin_board-inf_bg)';
    */
    // Reset variable to get it ready for subsequent use
    blinkColorOfKeySymbol(expKey);
    keyPressedExp = false;
    return ignoreE;
  }


  // This is necessary for a dot keyPressed, but not for 'e-'. Because 'e-' id never a first character on any number.
  if (keyPressed === 'e-' && numOnLCD.indexOf('e') >= 0 && !colorsOfNumsOnLcdIsDefault) {
    // An e that belongs to a next number entry; number that is expected after last operator entry.
    ignoreE = false;
    //
    return ignoreE;
  }


  // For all other cases of 'e' keyPressed.
  ignoreE = false; // Allow normal execution of appendDigit()
  postABullet('int01', bulletStyles.int.bg, bulletStyles.int.txt);
  /*
  int01: `CALC tip:\nFor a positive exponent delete the negative sign using the backspace key.`,
  */
  return ignoreE;
}

// functions called by Main:
function appendDigit () {
  // Also appends dot
  // Also appends e-
  // The following functions perform tasks to enable correct behavior of other functions that need various of their tasks performed at this point of the program:
  miscTasks();

  if (operator === null) {
    // This case is when appendage goes against 1st operand
    if (keyPressed === '.' && operand1 === null) {
      // More specifically, against 1st operand, with the added condition that dot is the very first character received(operand1 is empty)
      keyPressed = '0.'; // suplant the dot by a zero and dot, and process as a single digit.
    }

    if (operand1 === null) {
      // If null, concat keyPressed with empty string
      // Now the '0.' will be appended to the current content of operand1. But since the content is the null character, we load operand1 with an empty string and append the '0.' to it. Net result is we loaded the '0.' string into the operand1 variable. For a case of a single numeric digit received, the net effect is that the single digit is appended.
      operand1 = '';
      operand1 = operand1.concat(keyPressed);

    } else {
      // now we handle the case when characters are directed to 1st operand, but operand is not empty. In this case, it is just a matter of appending the additional digit. Simple.
      operand1 = operand1.concat(keyPressed);
    }
    // Now mirror the operand1 content to the LCD for user to view.
    lcd.innerHTML = operand1;
    // And update the subtotal register and it's viewable display also.
    subtotal = operand1;
    subTot.innerHTML = operand1;

  } else {
    // Now the case when operator is not null. This means that previous processes completed loading of digits destined to the 1st operand and also loaded the desired operand to the operand register. Any subsequent digits and dot will be destined to the 2nd operand. Procedure is same as for the 1st operand. But this time performed for the operand2 variable:
    if (keyPressed === '.' && operand2 === null) {
      // Case of 2nd operand empty
      keyPressed = '0.'; // Got a dot.
    }
    if (operand2 === null) {
      // on virgin location concat keyPressed with empty string
      operand2 = '';
      operand2 = operand2.concat(keyPressed);

    } else {
      // What to do if 2nd operand already had some content.
      operand2 = operand2.concat(keyPressed);

    }
    lcd.innerHTML = operand2; // Let user see the result of the appendage procedure.
  }
  // Reset all variables to get them ready for a possible subsequent use
  keyPressedNumber = false;
  keyPressedDot = false;
  keyPressedExp = false;
  // Update details for developer visualization while building the App.
  updDebug();
  return; // Done!
}

function changeSign () {
  // Change sign is for operand1:
  if (operator === null) {
    // Do nothing. operand2 is zero.
    if (1*operand1 === 0) {
      postABullet('inf08', bulletStyles.inf.bg, bulletStyles.inf.txt)
      blinkColorOfKeySymbol(elementOfPressedOperator);
      keyPressedChgSign = false;
      updDebug();
      lastOpDispl.innerHTML = '&#177';
      return;
    }
    // operand1 is a fixed format number;
    if (!xtract.hasAnE(operand1)) {
      operand1 = (operand1*(-1)).toString();
      lcd.innerHTML = operand1;
      keyPressedChgSign = false;
      updDebug();
      lastOpDispl.innerHTML = '&#177';
      return;
    }
    // operand1 is an exponential number:
    if (xtract.hasAnE(operand1)) {
      console.log('initial operand1: ', {
        operand1
      });
      let bodyOfOperand1 = xtract.algebraicSign(operand1).concat(xtract.numericPart(operand1));
      const expOfOperand1 = xtract.exponentialWhole(operand1);
      bodyOfOperand1 = (-1*bodyOfOperand1).toString();
      operand1 = bodyOfOperand1.concat('e').concat(expOfOperand1);
      console.log('final operand1: ', {
        operand1
      });
      lcd.innerHTML = operand1;
      keyPressedChgSign = false;
      updDebug();
      lastOpDispl.innerHTML = '&#177';
      return;
    }
  } else {
    /* Change sign is for operand2: */
    // Do nothing. operand1 is zero.
    if (1*operand2 === 0) {
      postABullet('inf08', bulletStyles.inf.bg, bulletStyles.inf.txt)
      blinkColorOfKeySymbol(elementOfPressedOperator);
      keyPressedChgSign = false;
      updDebug();
      lastOpDispl.innerHTML = '&#177';
      return;
    }
    // operand2 is a fixed format number;
    if (!xtract.hasAnE(operand2)) {
      operand2 = (operand2*(-1)).toString();
      lcd.innerHTML = operand2;
      keyPressedChgSign = false;
      updDebug();
      lastOpDispl.innerHTML = '&#177';
      return;
    }
    // operand2 is an exponential number:
    if (xtract.hasAnE(operand2)) {
      console.log('initial operand2: ', {
        operand2
      });
      let bodyOfOperand2 = xtract.algebraicSign(operand2).concat(xtract.numericPart(operand2));
      const expOfOperand2 = xtract.exponentialWhole(operand2);
      bodyOfOperand2 = (-1*bodyOfOperand2).toString();
      operand2 = bodyOfOperand2.concat('e').concat(expOfOperand2);
      console.log('final operand2: ', {
        operand2
      });
      lcd.innerHTML = operand2;
      keyPressedChgSign = false;
      updDebug();
      lastOpDispl.innerHTML = '&#177';
      return;
    }
  }
}

function backspace () {
  if (operator === null) {
    operand1 = operand1.slice(0, operand1.length-1);
    lcd.innerHTML = operand1;
  } else {
    operand2 = operand2.slice(0, operand2.length-1);
    lcd.innerHTML = operand2;
  }
  keyPressedBackspace = false;
  updDebug();
  lastOpDispl.innerHTML = '&#x232b';
  return;
}

function invert () {
  if (operand1 === null && operator === null && operand2 === null) {
    // case1: Nothing done! All new calculations must start with a number or a dot!' Not needed; covered by 'Your first entry must be a number or a dot.'
    keyPressedInv = false;
  } else {

    if (operand1*1 === 0 && operator === null && operand2 === null) {
      // Nothing was done! CALC does not invert zero. Continue.
      postABullet('inf05', bulletStyles.inf.bg, bulletStyles.inf.txt);
      /* bulletText.innerHTML=` ⚠  Error
         Try again with a non zero value.`;
       bulletinBoard.style.backgroundColor='var(--bulletin_board-inf_bg)';
       bulletText.style.color='var(--noti-board-txt)';
       */
      blinkColorOfKeySymbol(invertKey);
    } else if (!isNaN(operand1) && operator === null && operand2 === null) {
      // operand1 valid. Invert.
      operand1 = (1/operand1).toString();
      lcd.innerHTML = operand1;
    } else if (!isNaN(operand1) && operator && operand2 === null) {
      postABullet('inf06', bulletStyles.inf.bg, bulletStyles.inf.txt);
    } else if (!isNaN(operand1) && operator && 1*operand2 === 0) {
      postABullet('inf05', bulletStyles.inf.bg, bulletStyles.inf.txt);
      blinkColorOfKeySymbol(invertKey);

    } else if (operand1*1 === 0 && operator && operand2 === null) {
      postABullet('int04', bulletStyles.int.bg, bulletStyles.int.txt);
    } else if (operand1*1 === 0 && operator && 1*operand2 === 0) {
      postABullet('int04', bulletStyles.int.bg, bulletStyles.int.txt);
    } else if (!isNaN(operand1) && operator && !isNaN(operand2)) {
      // operand2 valid. Invert.
      operand2 = (1/operand2).toString();
      lcd.innerHTML = operand2;

    } else {
      // NOP
    }
  }
  keyPressedInv = false;
  updDebug();
  lastOpDispl.innerHTML = '1/x';
  return;
}

function sqrt () {
  if (operator === null) {
    if (operand1 < 0) {
      postABullet('int05', bulletStyles.int.bg, bulletStyles.int.txt);
      /*
  bulletText.innerHTML =`                   ⚠  Error.
   Only positive numbers for square root operator.
   Modify your number, or clear to try again.`;
      bulletText.style.color='var(--bulletin_board-fatal_err-txt)';
       bulletinBoard.style.backgroundColor='var(--bulletin_board-fatal_err-bg)'; // '#9d0ba7';
         */
      blinkColorOfKeySymbol(sqrtKey);
      keyPressedSqrt = false;
      return;
    }
    operand1 = Math.sqrt(operand1).toString();
    lcd.innerHTML = operand1;
  } else {
    if (operand2 < 0) {
      postABullet('int05', bulletStyles.int.bg, bulletStyles.int.txt);
      /*
  bulletText.innerHTML =`                   ⚠  Error.
   Only positive numbers for square root operator.
   Modify your number, or clear to try again.`;
       bulletText.style.color='var(--bulletin_board-fatal_err-txt)';
       bulletinBoard.style.backgroundColor='var(--bulletin_board-fatal_err-bg)'; // '#9d0ba7';
      */
      blinkColorOfKeySymbol(sqrtKey);
      keyPressedSqrt = false;
      return;
    }
    operand2 = Math.sqrt(operand2).toString();
    lcd.innerHTML = operand2;
  }
  keyPressedSqrt = false;
  updDebug();
  lastOpDispl.innerHTML = '&#x221a;';
  return;
}

function square () {
  if (operator === null) {
    operand1 = (operand1*operand1).toString();
    lcd.innerHTML = operand1;
  } else {
    operand2 = (operand2*operand2).toString();
    lcd.innerHTML = operand2;
  }
  keyPressedSquare = false;
  updDebug();
  lastOpDispl.innerHTML = 'x²';
  return;
}

function equals () {
  performCalc();
  lcd.innerHTML = finalResult;
  preservedEqualsResult = finalResult;
  keyPressedEquals = false;
  subtotal = finalResult;
  updDebug();
  lastOpDispl.innerHTML = '=';
  chgColorOfNumOnLCD('1', 'var(--lcd-num-result)');
  return;
}

function recycle () {
  if (lastOpDispl === '1/x') {
    //NOP
    return;
  }
  // To achieve recycle mode, the trick is to preserve the final result, then modify the environment to mimic conditions during a number key press, and supplant the keyPressed value with the preserved final result. And then call main() to handle the mocked keyPressed.
  preservedFinalResult = finalResult;
  resetCalculator();
  keyPressedUnary = true;
  keyPressedNumber = true;
  keyPressed = preservedFinalResult;
  main();
  lastOpDispl.innerHTML = '♻️'// '♽';
  if (preventRecycleBullet) {
    // Don't post bullet
    preventRecycleBullet = false;
  } else {
    // Post bullet
    postABullet('int09', bulletStyles.int.bg, bulletStyles.int.txt);
  }
  preservedFinalResult = null;
  return;
}

function performCalc () {
  if (operator === '+') {
    finalResult = parseFloat(operand1) + parseFloat(operand2);
    updDebug();
  } else if (operator === '-') {
    finalResult = parseFloat(operand1) - parseFloat(operand2);
    updDebug();

  } else if (operator === '×') {
    // multiplication
    finalResult = parseFloat(operand1) * parseFloat(operand2);
    updDebug();

  } else if (operator === '÷') {
    // division
    if (operand2 === '0') {
      resetCalculator();
      postABullet('fat00', bulletStyles.fat.bg, bulletStyles.fat.txt);
      /*
   bulletText.innerHTML='             ⚠  Error.\n              Divide by zero is not allowed.\n              I had to cancel your calculation.';
  */
      // bulletinBoard.style.backgroundColor='var(--bulletin_board-fat_bg)';
      return;
    } else {
      finalResult = parseFloat(operand1) / parseFloat(operand2);
    }
    updDebug();

  } else if (operator === '%') {
    finalResult = parseFloat(operand1) * parseFloat(operand2)/100;
    updDebug();

    /*
  }else if(operator==='%'){
  finalResult= parseFloat(operand1) * parseFloat(operand2)/100;
  updDebug();
  */
  } else {
    // error: missing operator
    finalResult = '';
    updDebug();
    treatAsDigitKeyPress(subtotal);
    postABullet('fat01', bulletStyles.fat.bg, bulletStyles.fat.txt);
    /*
   bulletText.innerHTML ='⚠  Error. Two numbers and an operator are required to perform a calculation. Clear and start all over again.';
  */
    // bulletinBoard.style.backgroundColor='var(--bulletin_board-fatal_err-bg)';
    // bulletText.style.color='var(--bulletin_board-fat_txt)';
  }
  return;
}

// let abortSwitchCalcModes;
function checkDivByZero () {
  if (previousOpKey === '÷' && operand2*1 === 0) {
    // Error: 'Attempt to divide by zero'
    // abortSwitchCalcModes=true;
    // console.log('flag set to: ', abortSwitchCalcModes);
    resetCalculator();
    postABullet('fat02', bulletStyles.fat.bg, bulletStyles.fat.txt);
    /*
  bulletText.innerHTML=`
                     ⚠  Error
         Calculation canceled. You attempted to divide by zero.
         Enter a number a for new calculation.`;
  */
    // bulletinBoard.style.backgroundColor='var(--bulletin_board-fat_bg)'; // '#3cc4ef';
    // bulletText.style.color='var(--noti-board-txt)';
    blinkColorOfKeySymbol(elementOfPressedOperator);
  } else {
    // NOP
    return;
  }
}

function modalScreenTempDisabled () {
  if (!keyFormatListenerFlag || lcd.innerHTML === '') {
    postABullet('int06', bulletStyles.int.bg, bulletStyles.int.txt);
    /*
  bulletText.innerHTML=`
        You need a number on display to use this feature!`;
  */
    // bulletinBoard.style.backgroundColor='var(--bulletin_board-int_bg)'; // '#3cc4ef';
    // bulletText.style.color='var(--noti-board-txt)';
    return true;
  }
}

function chkFirstKeypressIsNum() {
  if (operand1 === null && isNaN(keyPressed) && keyPressed !== '.') {
    resetCalculator();
    postABullet('int07', bulletStyles.int.bg, bulletStyles.int.txt);
    /*
  bulletText.innerHTML=`
        ⚠ Your first entry must be a number or a dot!`;
       bulletinBoard.style.backgroundColor='var(--bulletin_board-int_bg)'; // '#3cc4ef';
       bulletText.style.color='var(--noti-board-txt)';
       */
    defaultKeysColor();
    blinkColorOfKeySymbol(elementOfPressedOperator);
    elementOfPressedOperator = null;
    return;
  }
}

function chgColorOfNumOnLCD (intensity, color = 'var(--lcd-num-typed)') {
  lcd.style.color = color;
  lcd.style.opacity = intensity;
  if (color === 'var(--lcd-num-typed)') {
    colorsOfNumsOnLcdIsDefault = true;
  } else {
    colorsOfNumsOnLcdIsDefault = false;
  }

}

function operandLoader () {
  operator = keyPressed;
  chgColorOfNumOnLCD('1', 'var(--lcd-num-registered)');
  updDebug();
}

function chkMultiOps () {
  if (operator !== null && operand2 === null) {
    // notify operator duplicity
    postABullet('int08', bulletStyles.int.bg, bulletStyles.int.txt);
    /* bulletText.textContent=`Your previous key press was also an operator. Entries so far:\n${operand1} ${operator}\nEither enter your next number, OR\nPress now the desired operator to continue.`;
       bulletinBoard.style.backgroundColor=bulletStyles.int.bg; // '#3cc4ef';
       bulletText.style.color=bulletStyles.inf.txt; */
    blinkColorOfKeySymbol(elementOfPressedOperator);
  }
}

// Main
function main () {
  chkFirstKeypressIsNum(); //
  if (keyPressedUnary) {
    // 0y, key press was unary?
    console.log('if 0');
    // 1 is the yes of 0
    //1
    if (keyPressedNumber) {
      // 1y
      //call sub appendDigit.
      appendDigit();
    } else {
      // 1n
      // 2 is the else of 1
      // 2
      if (keyPressedDot) {
        // 2y
        // call sub appendDot (appendDigit() also appends dots.)

        // But don't append redundant dot.
        console.log('if 2');
        if (rejectRepeatDot()) {
          return;
        }

        appendDigit();

      } else {
        // 1bn
        // 2b is the else of 1b
        // 2b
        if (keyPressedExp) {
          // 2y
          console.log('if 2');
          // call sub appendExp (appendDigit() also appends e-.)

          // But don't append redundant e-.
          if (multipleExpsErr()) {
            // Don't append redundant 'e-'.
            return;
          }

          appendDigit();

        } else {
          // 2n,
          // 3 is the else of 2
          // 3
          if (keyPressedChgSign) {
            // 3y
            console.log('if 3');
            //call sub changeSign.
            changeSign();
          } else {
            // 3n,
            // 4 is the else of 3
            // 4
            if (keyPressedBackspace) {
              // 4y
              console.log('if 4');
              // call sub backspace.
              backspace ();
            } else {
              // 4n,
              // 5 is the else of 4
              // 5
              if (keyPressedInv) {
                // 5y
                console.log('if 5');
                //call sub invert
                invert();
              } else {
                // 5n,
                // 6 is the else of 5
                // 6
                if (keyPressedSqrt) {
                  // 6y
                  console.log('if 6');
                  // call sub sqrt.
                  sqrt();
                } else {
                  // 6n
                  // 7 is the else of 6
                  // 7
                  if (keyPressedSquare) {
                    // 7y
                    console.log('if 7');
                    // call sub square.
                    square();
                  } else {
                    // 7n,
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
  } else {
    //0n, key press was '=' ?
    // 8 is the else of 0
    // 8

    checkDivByZero();
    if (keyPressedEquals) {
      // 8y
      console.log('if 8');
      if (operand1 === null || operand2 === null) {
        // Error: missing operand
        let preservedSubtotal = subtotal;
        resetCalculator();
        lcd.innerHTML = preservedSubtotal;
        keyPressedMS = true;
        keyMS.style.color = 'var(--key-symb-ms)';
        memoryHandler();
        postABullet('fat03', bulletStyles.fat.bg, bulletStyles.fat.txt);
        /*
  bulletText.innerHTML='⚠  Error. Two numbers and an operator are required to perform a calculation. Clear and start all over again.';
  */
        // bulletinBoard.style.backgroundColor='var(--bulletin_board-fatal_err-bg)';
        // bulletText.style.color='var(--bulletin_board-fat_txt)';
        blinkColorOfKeySymbol(equalKey);
        return;
      }
      // 9 is the yes of 8
      // 9
      if (lastOpDispl.innerHTML !== '=') {
        // 9y, no prior keyPressedEquals. Perform math.
        console.log('if 9');
        // 1st time equal is true.
        // call sub performCalc.
        equals();
      } else {
        // 9n, user entered two successive keyPressedEquals
        // Therefore, call sub recycle, to enter recycle mode.
        recycle();
        return;
      }
    } else {
      // 8n,
      // 10 is the else of 8
      // 10
      keyFormat.removeEventListener('click', enterFormatModal); // LCD blanks every time a binary operator is entered. Therefore no need to enter format modal.
      keyFormatListenerFlag = false;
      if (keyPressedAdd) {
        // 10y
        console.log('if 10: ', 'keyPressedAdd', keyPressedAdd);
        chkMultiOps();
        // call sub operandLoader.

        operandLoader();
        // updDebug();
        // chgColorOfNumOnLCD('green');
      } else {
        // 10n
        // 11
        // 11 is the else of 10
        if (keyPressedSubstract) {
          // 11y
          console.log('if 11');
          chkMultiOps();
          // call sub operandLoader.

          operandLoader();
        } else {
          // 11n
          // 12 is the else of 11
          // 12
          if (keyPressedMultiply) {
            // 12y
            console.log('if 12');
            chkMultiOps();
            // call sub operandLoader.

            operandLoader();
          } else {
            // 12n
            // 13 is the else of 12
            // 13
            if (keyPressedDivide) {
              // 13y
              console.log('if 13');
              chkMultiOps();
              // call sub operandLoader.

              operandLoader();
            } else {
              // 13n
              // 14 is the else of 13
              // 14
              if (keyPressedPercentage) {
                // 14y
                console.log('if 14');
                // 14 is the else of 13
                chkMultiOps();
                // call sub operandLoader.

                operandLoader();
              } else {
                // 14n
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

function assertOperation(keyPressed) {
  // Enable operator corresponding to the key that was pressed:
  // For unary operators
  if (keyPressed === '&#177') {
    keyPressedChgSign = true;
    return keyPressedChgSign;

  } else if (keyPressed === '&#x232b') {
    keyPressedBackspace = true;
    return keyPressedBackspace;

  } else if (keyPressed === '1/x') {
    keyPressedInv = true;
    return keyPressedInv;

  } else if (keyPressed === '&#x221a;') {
    keyPressedSqrt = true;
    return keyPressedSqrt;

  } else if (keyPressed === 'x²') {
    keyPressedSquare = true;
    return keyPressedSquare;

    // For binary operators

  } else if (keyPressed === '+') {
    keyPressedAdd = true;
    return keyPressedAdd;

  } else if (keyPressed === '-') {
    keyPressedSubstract = true;
    return keyPressedSubstract;

  } else if (keyPressed === '×') {
    keyPressedMultiply = true;
    return keyPressedMultiply;

  } else if (keyPressed === '÷') {
    keyPressedDivide = true;
    return keyPressedDivide;

  } else if (keyPressed === '%') {
    keyPressedPercentage = true;
    return keyPressedPercentage;

  } else {
    // NOP
  }
  return;
}

function switchCalcModes () {
  if (calcFatalLock) {
    postABullet('fat05', bulletStyles.fat.bg, bulletStyles.fat.txt);
    blinkColorOfKeySymbol(elementOfPressedOperator);
    return
  } // Fatal error. Reject all key presses until user resets calculator.
  hideAppConfigModal();
  eraseBillBoard();
  // Mode1: Entry of a unary or binary operator after final result (in other words, after pressing the equals key)

  if (operand1 !== null && operand2 !== null && finalResult !== null && isNaN(keyPressed)) {
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

    const preservedKeyPressedUnary = keyPressedUnary;
    const preservedKeyPressed = keyPressed;

    // Enter recycle mode:

    recycle();

    // Restore environment:
    keyPressedUnary = preservedKeyPressedUnary;
    keyPressed = preservedKeyPressed;
    assertOperation(keyPressed);
    const assertedOperation = assertOperation(keyPressed);
    // Feed main() with restored environment:
    main();
    subtotal = operand1;
    subTot.innerHTML = operand1;
    return;
  } else if (operand1 !== null && operand2 !== null && finalResult === null &&!keyPressedUnary) {
    // Mode2: After receiving the sequence: operand1, an operator, and opetand2, calc receives a binary operator. This signals an intention to complete current calculation, and use its result as the first number of next calculation whose operator will be the latest operator entered by the user.
    // preserve current binary operator and its environment
    // example:
    // keyPressedUnary=false;
    // ** keyPressedAdd=true;
    // keyPressed='+';
    const preservedKeyPressedUnary = keyPressedUnary;
    const preservedKeyPressed = keyPressed;

    // complete current calculation (like when pressing the equal sign)
    // Prepare equal sign environment:
    // Hereby the equals environment:
    keyPressedUnary = false;
    keyPressedEquals = true;
    keyPressed = '=';
    preventRecycleBullet = true;

    // Now call main() to complete the calculation
    main();
    // Use result as 1st number of next calculation and load the preserved operator
    // inject preserved operator and its environment, and process like there was a binary operator key Press.
    // To achieve this, restore original environment, and call switchCalcModes()

    // restoring original environment:
    keyPressedUnary = preservedKeyPressedUnary;
    keyPressed = preservedKeyPressed;
    assertOperation(keyPressed);
    const assertedOperation = assertOperation(keyPressed);
    // calling switchCalcModes()
    switchCalcModes();
    subtotal = operand1;
    subTot.innerHTML = operand1;
    lcd.innerHTML = previousOperand;
    // Purpose of this line is to keep on display the number that was entered even after entering the subsequent operator. Originally the behavior was number disappearance from display. Now it stays but changes color to signal number accepted in calculator.
    return;
    // Mode3: Entry of a number after final result (in other words, after pressing the equals. This signals an intention to start a whole new calculation.
  } else if (operand1 !== null && operand2 !== null && finalResult !== null && !isNaN(keyPressed)) {
    // Procedure: preserve the number, whole calculator, restore the number, and let switchCalcModes() handle it.

    // Preserve number environment:
    // example:
    // keyPressedUnary=true;
    // keyPressedNumber=true;
    // keyPressed=0;
    const preservedkeyPressedUnary = keyPressedUnary;
    const preservedkeyPressedNumber = keyPressedNumber;
    const preservedKeyPressed = keyPressed;

    // whole calculator
    resetCalculator();

    // Restore number and its environment
    keyPressedUnary = preservedkeyPressedUnary;
    keyPressedNumber = preservedkeyPressedNumber;
    keyPressed = preservedKeyPressed;

    // Process the number entry as usual
    switchCalcModes();
    subtotal = operand1;
    subTot.innerHTML = operand1;
    return;

  } else {
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
  const preservedColorBg='var(--bulletin_board-fat_bg)'; // '#3cc4ef';
  const preservedColor='var(--bulletin_board-fat_txt)';
  // Clear calculator
  resetCalculator();
  // Restore error message
  bulletText.innerHTML=`Sorry for this inconvenience. I had to reset. I could not recover from an input error of yours. Error:\n${preservedNotif}`;
  bulletinBoard.style.backgroundColor=preservedColorBg;
  bulletText.style.color=preservedColor;
  }
  */

// ### BEHAVIOR OF USER SETTINGS: ###
// Save user settings to persistent memory
let devPanelVaultedState;
let vaultedThemeChoice;
let vaultedLanguageChoice;
function vaultUserConfiguration () {
  window.localStorage.setItem('devPanelVaultedState', JSON.stringify(devPanelVaultedState));
  window.localStorage.setItem('vaultedThemeChoice', JSON.stringify(vaultedThemeChoice));
  window.localStorage.setItem('vaultedLanguageChoice', JSON.stringify(vaultedLanguageChoice));
  //console.log({vaultedLanguageChoice});
}

// Restore user settings from persistent memory
function fetchPersistentUserConfiguration () {
  devPanelVaultedState = JSON.parse(window.localStorage.getItem('devPanelVaultedState'));
  vaultedThemeChoice = JSON.parse(window.localStorage.getItem('vaultedThemeChoice'));
  vaultedLanguageChoice = JSON.parse(window.localStorage.getItem('vaultedLanguageChoice'));
  return;
}

function switchAppConfigBtnToVertical () {
  // Default position is horizontal
  appSettingsMenu.style.transform = 'rotate(0)';
  appSettingsMenu.style.top = '3rem';
  appSettingsMenu.style.left = '0.2rem';
}

let appConfigModalOn = false;
const appConfigModal = document.querySelector('#app_config_modal-frame');
function showAppConfigModal () {
  appConfigModal.style.top = '0';
  appConfigModal.style.left = '7%';
  appConfigModalOn = true;
  lcd.style.opacity = '0';
  lastOpDispl.style.opacity = '0';
  switchAppConfigBtnToVertical();
  return;
}

function horizontalSettingsMenu () {
  appSettingsMenu.style.transform = 'rotate(-90deg)';
  appSettingsMenu.style.top = '-1.2rem';
  appSettingsMenu.style.left = '2rem';
}

function hideAppConfigModal () {
  appConfigModal.style.top = '-8.2rem';
  appConfigModal.style.left = '101%';
  appConfigModalOn = false;
  lcd.style.opacity = '1'; 
  lastOpDispl.style.opacity = '1';
  horizontalSettingsMenu();
  return;
}

function toggleAppConfigModal() {
  if (appConfigModalOn) {
    hideAppConfigModal();
  } else {
    showAppConfigModal();
  }
  return;
}
const appSettingsMenu = document.querySelector('#app-settings-menu-btn');
appSettingsMenu.addEventListener('click', toggleAppConfigModal);

// ### BEHAVIOR OF DEVELOPER PANEL: ###
const debugDataSubpanel = document.querySelector('#modal-partial_registers-wrapper');
const wholeDataPanel = document.querySelector('#modal-all_registers-wrapper');
// Save this user setting in persistent memory
function vaultDevPanelOnOffState () {
  devPanelVaultedState = checkboxToshowOrHideDevPanel.checked;
  vaultUserConfiguration();
}

function showWholeDataPanel () {
  debugDataSubpanel.style.opacity = '1';
  wholeDataPanel.style.bottom = ('-10rem');
  return;
}

function hideWholeDataPanel () {
  debugDataSubpanel.style.opacity = '0';
  wholeDataPanel.style.bottom = ('-2.5rem');
  return;
}

function toggleDevelopmentDataPanel () {
  fetchPersistentUserConfiguration();
  if (devPanelVaultedState) {
    // show developer information grille
    showWholeDataPanel();
  } else {
    // hide developer information grille
    hideWholeDataPanel();
  }
  checkboxToshowOrHideDevPanel.checked = devPanelVaultedState;
  return;
}
const checkboxToshowOrHideDevPanel = document.querySelector('#show-details');
checkboxToshowOrHideDevPanel.addEventListener('click', () => {
  vaultDevPanelOnOffState();
  toggleDevelopmentDataPanel();
});

// ## BEHAVIOR OF THEMES: ##
// Grab choices radio buttons
const allAppSettings = document.querySelector('#app-settings-modal');
const contrastThemeRadio = document.querySelector('#dark-theme-choice');
const blueThemeRadio = document.querySelector('#soothing-theme-choice');
const lightThemeRadio = document.querySelector('#light-theme-choice');
// Grab theme root element
const root = document.querySelector(':root');

function vaultChosenTheme () {
  let chosenTheme;
  if (contrastThemeRadio.checked === true) {
    chosenTheme = 'dark-theme';
  }
  if (blueThemeRadio.checked === true) {
    chosenTheme = 'soothing-theme';
  }
  if (lightThemeRadio.checked === true) {
    chosenTheme = 'light-theme';
  }
  vaultedThemeChoice = chosenTheme;
  vaultUserConfiguration();
  return;
}

function tickActiveThemeRadioBtn () {
  if (vaultedThemeChoice === 'dark-theme') {
    contrastThemeRadio.checked = true;
  }
  if (vaultedThemeChoice === 'soothing-theme') {
    blueThemeRadio.checked = true;
  }
  if (vaultedThemeChoice === 'light-theme') {
    lightThemeRadio.checked = true;
  }
}
function applyTheme () {
  fetchPersistentUserConfiguration();
  const currentClass = root.classList[0];
  root.classList.remove(`${currentClass}`);
  root.classList.add(`${vaultedThemeChoice}`);
  tickActiveThemeRadioBtn();
  return;
}

// ## BEHAVIOR OF LANGUAGE RADIO BUTTONS: ##
// Grab language radio buttons
const spanishLanguageRadio = document.querySelector('#spanish-language');
const englishLanguageRadio = document.querySelector('#english-language');

function vaultChosenLanguage () {
  let chosenLanguage;
  if (spanishLanguageRadio.checked === true) {
    chosenLanguage = 'spanish-language';
  }
  if (englishLanguageRadio.checked === true) {
    chosenLanguage = 'english-language';
  }
  vaultedLanguageChoice = chosenLanguage;
  vaultUserConfiguration();
  return;
}

function tickActiveLanguageRadioBtn () {
  if (vaultedLanguageChoice === 'spanish-language') {
    spanishLanguageRadio.checked = true;
  }
  if (vaultedLanguageChoice === 'english-language') {
    englishLanguageRadio.checked = true;
  }
  return;
}

function applyLanguage () {
  fetchPersistentUserConfiguration();
  tickActiveLanguageRadioBtn();
  return;
}
allAppSettings.addEventListener('click', () => {
  vaultChosenTheme();
  vaultChosenLanguage();
  applyTheme();
  applyLanguage();
});

// EXTRACTION LIBRARY:
//####################################
/* signifFigCounter v2.0.js */
//####################################

var xtract = {

  functionNameLocked: false,

  myNameIs: function (funcNam) {
    if (this.functionNameLocked) {
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

  algebraicSign: function (aNum) {
    if (aNum < 0 || aNum.slice(0, 1) === '-') {
      const impliedSign = '-';
      return impliedSign;
    }
    if (aNum > 0 || aNum.slice(0, 1) === '+') {
      const impliedSign = '+';
      return impliedSign;
    }
    const impliedSign = '';
    return impliedSign;
  },

  hasASign: function (aNum) {
    this.myNameIs('hasASign');
    const entryStr = aNum;
    if (entryStr.slice(0, 1) === '+' || entryStr.slice(0, 1) === '-') {
      // yes
      const hasSign = true;
      return hasSign;
    }
    //no
    const hasSign = false;
    return hasSign;
  },

  fetchTheSign: function (aNum) {
    if (this.hasASign(aNum)) {
      this.myNameIs('fetchTheSign');
      // yes
      const fetchedSign = aNum.slice(0, 1);
      return fetchedSign;
    }
    //no
    const fetchedSign = '';
    return fetchedSign;
  },

  numericPart: function (aNum) {
    this.myNameIs('numericPart');
    this.functionNameLocked = true;
    let userEntryAbsVal;
    if (aNum.slice(0, 1) === '-' || aNum.slice(0, 1) === '+') {
      userEntryAbsVal = aNum.slice(1);
    } else {
      userEntryAbsVal = aNum.slice(0);
    }
    let wholeNumStr;
    if (this.hasAnE(aNum)) {
      wholeNumStr = userEntryAbsVal;
      const sliceStop = wholeNumStr.indexOf('e');
      const numPortion = wholeNumStr.slice(0, sliceStop);
      this.functionNameLocked = false;
      return numPortion; // a string.
    }
    const numPortion = userEntryAbsVal;
    this.functionNameLocked = false;
    return numPortion;
  },

  integerPart: function (aNum) {
    const numbStr = this.numericPart(aNum);
    if (this.hasADot(aNum)) {
      this.myNameIs('integerPart');
      const sliceStop = numbStr.indexOf('.');
      const integerPortion = numbStr.slice(0, sliceStop);
      return integerPortion;
    }
    const integerPortion = numbStr;
    return integerPortion;
  },

  trailingZeroesCount: function (aNum) {
    const numStr = this.integerPart(aNum);
    this.myNameIs('trailingZeroesCount');
    let zeroesCount = 0;
    for (let digit of numStr) {
      if (digit === '-' || digit === '+') {
        // Don't count. Not a trailing zero
      } else if (digit === '.' |digit !== '0') {
        const trailing0sCnt = zeroesCount;
        return trailing0sCnt;
      } else if (digit === '0') {
        zeroesCount++;
      }
    }
    const trailing0sCnt = zeroesCount;
    return trailing0sCnt;
  },

  zeroTrimmedCore: function (aNum) {
    this.myNameIs('zeroTrimmedCore');
    this.functionNameLocked = true;
    // Zero valueds with or without dot somewhere:
    if (1*aNum === 0 && this.hasADot()) {
      const non0Cluster = '.';
      this.functionNameLocked = false;
      return non0Cluster;
    }
    if (1*aNum === 0 && !this.hasADot(aNum)) {
      const non0Cluster = '';
      this.functionNameLocked = false;
      return non0Cluster;
    }
    let numbStr = this.numericPart(aNum);
    let absNumbStr;
    //numbers that have the form ".x"
    if (numbStr.slice(0, 1) === '.') {
      numbStr = (1*numbStr).toString(); // trim leading zeroes
      const non0Cluster = numbStr.slice(0); // trim trailing 0 introduced by 1* operation
      this.functionNameLocked = false;
      return non0Cluster;
    }
    if (numbStr.slice(-1) === '.') {
      // x. case
      numbStr = (1*numbStr).toString(); // trim trailing zeroes
      const non0Cluster = numbStr.concat('.'); // append '.' trimmed by 1* operation
      this.functionNameLocked = false;
      return non0Cluster;
    }
    // For all other cases not covered above:
    const non0Cluster = (1*numbStr).toString();
    this.functionNameLocked = false;
    return non0Cluster;
  },

  significantFigures: function (aNum) {
    this.myNameIs('significantFigures');
    this.functionNameLocked = true;
    const alphamericCoreStr = this.numericPart(aNum);
    // Any number of only zeroes with a dot somewhere:
    if (1*alphamericCoreStr === 0 && alphamericCoreStr.includes('.')) {
      const signifFigs = '0'+this.fractionalPart(aNum); // Leftmost 0 is implied. Therefore, correct the original user entry adding a Leftmost 0.
      this.functionNameLocked = false;
      return signifFigs;
    }
    // Any number of only zeroes with no dot anywhere:
    if (1*alphamericCoreStr === 0 && !alphamericCoreStr.includes('.')) {
      const signifFigs = '0';
      this.functionNameLocked = false;
      return signifFigs;
    }
    // Non-zero valued numeric part that starts with a dot:
    if (alphamericCoreStr.slice(0, 1) === '.') {
      const signifFigs = '0'+this.fractionalPart(aNum);
      this.functionNameLocked = false;
      return signifFigs;
    }
    this.functionNameLocked = true;
    let non0ClusterStr = this.zeroTrimmedCore(aNum);
    this.functionNameLocked = false;
    // Any other except previous "returns", that contain a dot somewhere:
    if (non0ClusterStr.includes('.')) {
      const indexOfDot = non0ClusterStr.indexOf('.');
      const jointString = non0ClusterStr.slice(0, indexOfDot) + non0ClusterStr.slice(1+indexOfDot);
      const signifFigs = jointString;
      this.functionNameLocked = false;
      return signifFigs;
    }
    // Any numeric part that doesn't contain a dot:
    // +011e-2
    const signifFigs = this.zeroTrimmedCore(aNum);
    this.functionNameLocked = false;
    return signifFigs;
  },

  sigFiguresCount: function (aNum) {
    this.myNameIs('sigFiguresCount');
    this.functionNameLocked = true;
    const sigDigCnt = this.significantFigures(aNum).length;
    this.functionNameLocked = false;
    return sigDigCnt;
  },

  reverseNumCluster: function (aNum) {
    this.myNameIs('reverseNumCluster');
    this.functionNameLocked = true;
    const numStr = this.numericPart(aNum);
    let reversedNumCluster = '';
    for (var i = 0; i < numStr.length; i++) {
      reversedNumCluster = numStr[i].concat(reversedNumCluster);
    }
    this.functionNameLocked = false;
    return reversedNumCluster;
  },

  leadingZeroesCount: function (aNum) {
    this.myNameIs('leadingZeroesCount');
    this.functionNameLocked = true;
    if (!this.numericPart(aNum).includes('.')) {
      const leading0s = 0;
      this.functionNameLocked = false;
      return leading0s;
    }
    /*
  if(aNum==='0'){
  const leading0s=0;
  this.functionNameLocked=false;
  return leading0s;}
  */
    this.functionNameLocked = true;
    const reversedNumCluster = this.reverseNumCluster(aNum);
    let zeroesCount = 0;
    for (let digit of reversedNumCluster) {
      if (digit === '-' || digit === '+') {
        // Don't count. Not a trailing zero
      } else if (digit === '.' |digit !== '0') {
        const leading0s = zeroesCount;
        this.functionNameLocked = false;
        return leading0s;
      } else if (digit === '0') {
        zeroesCount++;
      }
    }
    const leading0s = zeroesCount;
    this.reverseNumCluster = false;
    return leading0s;
  },

  fractionalPart: function (aNum) {
    this.myNameIs('fractionalPart');
    this.functionNameLocked = true;
    if (this.hasADot(aNum)) {
      let numbStr = this.numericPart(aNum);
      const sliceStop = numbStr.indexOf('.');
      const fractCluster = numbStr.slice(sliceStop+1);
      this.functionNameLocked = false;
      return fractCluster;
    }
    const fractCluster = '';
    this.functionNameLocked = false;
    return fractCluster;
  },

  hasADot: function (aNum) {
    this.myNameIs('hasADot');
    if (aNum.includes('.')) {
      // yes
      const hasDot = true;
      return hasDot;
    }
    //no
    const hasDot = false;
    return hasDot;
  },

  fetchTheDot: function (aNum) {
    this.myNameIs('fetchTheDot');
    this.functionNameLocked = true;
    if (this.hasADot(aNum)) {
      // yes
      const fetchedDot = '.';
      this.functionNameLocked = false;
      return fetchedDot;
    }
    //no
    const fetchedDot = '';
    this.functionNameLocked = false;
    return fetchedDot;
  },

  hasAnE: function (aNum) {
    this.myNameIs('hasAnE');
    this.functionNameLocked = true;
    if (aNum.includes('e')) {
      // yes
      const hasExp = true;
      this.functionNameLocked = false;
      return hasExp;
    }
    //no
    const hasExp = false;
    this.functionNameLocked = false;
    return hasExp;
  },

  fetchTheE: function (aNum) {
    this.myNameIs('fetchTheE');
    this.functionNameLocked = true;
    if (this.hasAnE(aNum)) {
      // yes
      const fetchedE = 'e';
      this.functionNameLocked = false;
      return fetchedE;
    }
    //no
    const fetchedE = '';
    this.functionNameLocked = false;
    return fetchedE;
  },

  exponentialSign: function (aNum) {
    this.myNameIs('exponentialSign');
    this.functionNameLocked = true;
    const wholeNumStr = aNum;
    if (!wholeNumStr.includes('e')) {
      const expSign = '';
      this.functionNameLocked = false;
      return expSign;
    }
    if (wholeNumStr.includes('e+')) {
      const expSign = '+';
      this.functionNameLocked = false;
      return expSign;
    }
    if (wholeNumStr.includes('e-')) {
      const expSign = '-';
      this.functionNameLocked = false;
      return expSign;
    }
    const expSign = '+';
    this.functionNameLocked = false;
    return expSign;
  },

  exponentialValue: function (aNum) {
    this.myNameIs('exponentialValue');
    this.functionNameLocked = true;
    if (!this.hasAnE(aNum)) {
      const expVal = '';
      this.functionNameLocked = false;
      return expVal;
    }
    const wholeNumStr = aNum;
    const sliceStop = wholeNumStr.indexOf('e');
    const expStr = wholeNumStr.slice(sliceStop+1);
    if (!isNaN(expStr[0])) {
      const expVal = expStr;
      this.functionNameLocked = false;
      return expVal;
    }
    const expVal = expStr.slice(1);
    this.functionNameLocked = false;
    return expVal;
  },

  exponentialWhole: function (aNum) {
    this.myNameIs('exponentialWhole');
    this.functionNameLocked = true;
    if (!this.hasAnE(aNum)) {
      const expWhole = '';
      this.functionNameLocked = false;
      return expWhole;
    }
    const wholeNumStr = aNum;
    const sliceStop = wholeNumStr.indexOf('e');
    const expStr = wholeNumStr.slice(sliceStop+1);
    if (!isNaN(expStr[0])) {
      const expWhole = expStr;
      this.functionNameLocked = false;
      return expWhole;
    }
    const expWhole = expStr.slice(0);
    this.functionNameLocked = false;
    return expWhole;
  }
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
function scientificDigitsCount () {
  // Test the applicability of this function. It's only valid for exponential numbers
  if (!xtract.hasAnE(lcdBackup)) {
    // Not an exponential number call the fixed number handler
    const fxdNumDigFigCnt = fixedNumSigFigCnt();
    return fxdNumDigFigCnt;
  }
  // Case 1: exponentialValue=0
  if (xtract.exponentialValue(lcdBackup) === '0') {
    // Test Case: +0012.3400e0
    // Rule:
    const originalSigFigsCnt = xtract.sigFiguresCount(lcdBackup) + xtract.leadingZeroesCount(lcdBackup);
    return originalSigFigsCnt;
  }

  // Case 2: exponentialSign is negative
  if (xtract.exponentialSign(lcdBackup) === '-') {
    const outcomeA = negSubCaseA();
    const outcomeB = negSubCaseB();
    if (outcomeA) {
      return outcomeA;
    }
    if (outcomeB) {
      return outcomeB;
    }
    return '';
  }

  // Case 3: exponentialSign is positive
  if (xtract.exponentialSign(lcdBackup) === '+') {
    const outcomeC = posSubCaseA();
    const outcomeD = posSubCaseB();
    if (outcomeC) {
      return outcomeC;
    }
    if (outcomeD) {
      return outcomeD;
    }
    return '';
  }
}

// Case 2: exponentialSign is negative
function negSubCaseA () {
  // Subcase a:
  // exponentialValue() <= integerPart().length - trailingZeroesCount()
  if (xtract.exponentialValue(lcdBackup) <= xtract.integerPart(lcdBackup).length - xtract.trailingZeroesCount(lcdBackup)) {
    // Test Case: +0012.3400e-1
    // Rule:
    const originalSigFigsCnt = xtract.sigFiguresCount(lcdBackup) + xtract.leadingZeroesCount(lcdBackup);
    return originalSigFigsCnt;
  }
  return '';
}

// Case 2: exponentialSign is negative
function negSubCaseB () {
  // Subcase b:
  // exponentialValue() > integerPart().length - trailingZeroesCount()
  if (xtract.exponentialValue(lcdBackup) > xtract.integerPart(lcdBackup).length - xtract.trailingZeroesCount(lcdBackup)) {
    // Test Case: +0012.3400e-3
    // Rule:
    const originalSigFigsCnt = 1 * xtract.sigFiguresCount(lcdBackup) + 1 * xtract.leadingZeroesCount(lcdBackup) + 1 * xtract.exponentialValue(lcdBackup) - 1 * (xtract.integerPart(lcdBackup).length - 1 * xtract.trailingZeroesCount(lcdBackup));
    return originalSigFigsCnt;
  }
  return ''
}

// Case 3: exponentialSign is positive
function posSubCaseA () {
  // Subcase a:
  // exponentialValue() <= fractionalPart().length
  if (xtract.exponentialValue(lcdBackup) <= xtract.fractionalPart(lcdBackup).length) {
    // Test Case: +0012.3400e+1
    // Rule:
    const originalSigFigsCnt = xtract.sigFiguresCount(lcdBackup) + xtract.leadingZeroesCount(lcdBackup);
    return originalSigFigsCnt;
  }
  return '';
}

// Case 3: exponentialSign is positive
function posSubCaseB () {
  // Subcase b:
  // exponentialValue() > fractionalPart().length
  if (xtract.exponentialValue(lcdBackup) > xtract.fractionalPart(lcdBackup).length) {
    // Test Case: +0012.3400e+5
    // Rule:
    const originalSigFigsCnt = xtract.sigFiguresCount(lcdBackup) + xtract.leadingZeroesCount(lcdBackup) + (xtract.exponentialValue(lcdBackup) - xtract.fractionalPart(lcdBackup).length);
    return originalSigFigsCnt;
  }
  return '';
}

// case 4: exponential absent
function fixedNumSigFigCnt () {
  // Test Case: .00, 0.00, 0., 00.
  // Any number of only zeroes with a dot somewhere:
  // Rule:
  let alphamericCoreStr = xtract.numericPart(lcdBackup);
  if (1*alphamericCoreStr === 0 && alphamericCoreStr.includes('.')) {
    const fixedSigFigsCnt = xtract.sigFiguresCount(lcdBackup);
    return fixedSigFigsCnt;
  }
  // Test Case: .x00
  // Rule:
  if (xtract.numericPart(lcdBackup).slice(0, 1) === '.') {
    const fixedSigFigsCnt = xtract.sigFiguresCount(lcdBackup);
    return fixedSigFigsCnt;
  }
  // Test Case: +0012.3400
  // Rule:
  const fixedSigFigsCnt = xtract.sigFiguresCount(lcdBackup) + xtract.leadingZeroesCount(lcdBackup);
  return fixedSigFigsCnt;
}

// Test
function test() {}
const testBtn = document.querySelector ('#help');
testBtn.addEventListener('click', test);
