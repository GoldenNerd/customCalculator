<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="calcStyle.css" type="text/css" media="all" />
  <title>Simple Calculator</title>
</head>
<body>

  <div id="whole-app-container">
    <!--
    <input type="button" id="help" value="HELP"/>
     -->
    <!-- MODAL FOR USER SETTINGS: -->

    <input type="button" name="debug" id="app-settings-menu-btn" value="&#x22ee;" />
    <div id='settings-modal-wrapper'>
      <ul id="app-settings-modal">
        <h3>Settings:</h3>
        <hr />
        <li><label>
          <input type="radio" name="theme" class="setting" id="dark-theme-choice" /><span class="user-settings-radio-btn-names"> Dark Theme</span>
        </label></li>

        <li><label>
          <input type="radio" name="theme" class="setting" id="soothing-theme-choice" /><span class="user-settings-radio-btn-names"> Soothing Theme</span>
        </label></li>

        <li><label>
          <input type="radio" name="theme" class="setting" id="light-theme-choice" /><span class="user-settings-radio-btn-names"> Light Theme</span>
        </label></li>
        <hr />
        <li><label>
          <input type="radio" name="language" class="setting" id="english-language" checked /><span class="user-settings-radio-btn-names"> English</span>
        </label></li>

        <li><label>
          <input type="radio" name="language" class="setting" id="spanish-language" /><span class="user-settings-radio-btn-names"> Spanish</span>
        </label></li>

        <li><label>
          <input type="checkbox" name="developer" class="setting" id="show-details" checked /><span class="user-settings-radio-btn-names"> More</span>
        </label></li>

      </ul>
    </div>

    <!-- LCD SUBASSEMBLY -->
    <span id="lastOpDispl">C</span>
    <div id="lcd-dev-container">
      <span id="lcd" value="">1234</span>
    </div>

    <!-- MODAL TO RE-FORMAT NUMBERS: -->
    <div id=format-modal>
      <h2 id="choose-format-hether">Change number format to:</h2>

      <div id="format">
        <ul class="choices">
          <li> <label><input type="radio" name="choice" id="original-format-choice" class="choice" value="" unchecked /> back to original format</label></li>
          <li> <label><input type="radio" name="choice" id="roundoff-choice" class="choice" value="" /> fixed rounded-off format</label></li>
          <li> <label><input type="radio" class="choice" name="choice" id="scientific-choice" value="" /> scientific notation</label></li>
          <!--   <li> <label><input type="radio" class="choice" name="choice" id="scientific-choice" value="" /> scientific notation</label></li>
              -->
        </ul>

        <h2 id="new-format-hether">Parameters for new Format:</h2>

        <div id="original-panel">
          <span class="datum" id="original-format-decimals"> Num.</span> decimal places
        </div>
        <div id="round-panel">
          <label><input
            type="number"
            name="num"
            class="datum"
            id="decimals"
            placeholder="Num."
            value=""
            min="0"
            max="13"
            step="1"
            /> round-off decimals</label>
        </div>
        <div id="scientific-panel">
          <label><input
            type="number"
            name="num"
            class="datum"
            id="significant"
            placeholder="Num."
            value=""
            min="0"
            max="13"
            step="1"
            /> significant figures</label>
        </div>


        <!--<div id="exponent-panel">
         <label><input
                  type="number"
                  name="num"
                  class="datum"
                  id="exponential-digits"
                  placeholder="Num."
                  value="3"
                  min="0"
                  max="13"
                  step="1"
                /> decimal places</label>
        </div>
         -->
      </div>

      <div id="format-buttons">
        <input type="button" class="modal-key" id="apply-format" value="Go">
        <input type="button" class="modal-key" id="quit-format" value="&#x25c0;">
        <!-- &#x2704;   &#x2718; -->
      </div>

    </div>
    <!-- KEYBOARD: -->
    <div id="keys">
      <input type="button" class="key" id="percentage" value="%">
      <input type="button" class="key" id="square" value="x²">
      <input type="button" class="key" id="sqrt" value="&#x221a;">
      <input type="button" class="key" id="divide" value="&#247;">
      <input type="button" class="key" id="key9" value="9">
      <input type="button" class="key" id="key8" value="8">
      <input type="button" class="key" id="key7" value="7">
      <input type="button" class="key" id="multiply" value="&#215;">
      <input type="button" class="key" id="key6" value="6">
      <input type="button" class="key" id="key5" value="5">
      <input type="button" class="key" id="key4" value="4">
      <input type="button" class="key" id="minus" value="&#8722;">
      <input type="button" class="key" id="key3" value="3">
      <input type="button" class="key" id="key2" value="2">
      <input type="button" class="key" id="key1" value="1">
      <input type="button" class="key" id="sum" value="+">
      <input type="button" class="key" id="key0" value="0">
      <input type="button" class="key" id="dotKey" value="&middot;">
      <input type="button" class="key" id="change-sign" value="&#177;">
      <input type="button" class="key" id="equal" value="=">

      <!-- <button class="key"><a href="help.html" id="help">&#x3f;</a></button> -->
      <input type="button" class="key" id="expKey" value="e">

      <input type="button" class="key" id="invert" value="1/x">
      <!-- x&#x207b;&#xb9; -->
      <input type="button" class="key" id="backspace" value="&#x232b;">
      <input type="button" class="key" id="clear" value="C">
      <input type="button" class="mem-key" id="ms" value="MS">
      <input type="button" class="mem-key" id="mr" value="MR">
      <input type="button" class="mem-key" id="mc" value="MC">
      <input type="button" class="key" id="scissors1" value="&#x2704;">
    </div>

    <!-- DEV INNER DATA PANEL: -->
    <div id="inner-data-wrapper">
      <div id="debug-data-grill">

        <div class="debug-pair">
          <p class="debug-element">
            lastOp:
            <span id="last-op-debug"></span>
          </p>
          <p class="debug-element">
            LCD:
            <span id="lcd-debug"></span>
          </p>
        </div>
        <div class="debug-pair">
          <p class="debug-element">
            operand1:
            <span id="operand1Debug"></span>
          </p>
          <p class="debug-element">
            operand2:
            <span id="operand2Debug"></span>
          </p>
        </div>
        <!--  -->
        <div class="debug-pair">
          <p class="debug-element">
            opNow: <span id="opNowDebug"></span>
          </p>
          <p class="debug-element">
            RESULT: <span id="resultDebug"></span>
          </p>
        </div>
      </div>

      <!--  -->

      <div class="calc-pair">
        <p class="calc-element">
          subTot: <span id="sub-tot"></span>
        </p>
        <p class="calc-element">
          Mem: <span id="memoryOnLCD"></span>
        </p>
      </div>
    </div>

    <!-- NOTIFICATION BILLBOARD: -->
    <div id="bulletin-board">
      <span id="bullet-text"></span>
      <!--
      <input type="button" id="help" value="&#x3f;">
      -->
      <input type="button" id="help" value="HELP" />
    </div>

  </div>

  <!--
  <input type="button" name="debug2" id="test2" value="1/x" />
  <input type="button" name="debug2" id="test3" value="x²" />
  <input type="button" name="test" id="test" value="&#x267d; x2026 &#x22ee; TEST" />
  -->

  <script type="text/javascript" charset="utf-8" src="calcApp.js"></script>
</body>
</html>
