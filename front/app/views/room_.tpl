<!-- Cabecera de la web -->
<header>
    <div id="menu"><i class="fa fa-bars" aria-hidden="true" ng-click="app.showMenu()"></i></div>
    <div class="logo-header"><a ng-href="/home"><img height="35px" src="/img/logo.png"></a></div>
    <profileweb></profileweb>
    <div id="logout"><i class="fa fa-sign-out" aria-hidden="true" ng-click="app.logout()"></i></div>
    <div id="lang">
        <i class="fa fa-globe" aria-hidden="true" ng-click="app.showLang()"></i> <span>{{app.language}}</span>
        <ul id="langmen">
            <li ng-click="app.changeLang('es')">Español</li>
            <li ng-click="app.changeLang('en')">English</li>
        </ul>
    </div>
    <div id="search">
        <label><input class="searchinput" type="text" ng-model="search" placeholder="{{app.translation.common.search}}"><i class="fa fa-search" aria-hidden="true" ng-click="app.search(search)"></i></label>
    </div>
    <span class="migas">{{$root.titulo}}</span>
</header>
<menuweb></menuweb>
<div id="fullpage"  class="boxCommon row" style="background:#fff">
    <video id="box0" class="transit" muted="muted" volume="0" ></video>
    <video id="box1" class="transit boxCommon thumbCommon" style="visibility:hidden"></video>
    <video id="box2" class="transit boxCommon thumbCommon" style="visibility:hidden"></video>
    <video id="box3" class="transit boxCommon thumbCommon" style="visibility:hidden"></video>
    <video id="box4" class="transit boxCommon thumbCommon" style="visibility:hidden"></video>
    <div id="textentryBox" onsubmit="room.sendText()" style="display:none" >
        <input type="text" id="textentryField"  class="transit boxcommon" /><br>
        <button id="textentrySubmit" style="float:right;margin-right:1em" ng-click="room.sendText()">Send</button>
        <button id="textentryCancel" style="float:left;margin-left:1em" ng-click="room.cancelText()">Cancel</button>
    </div>
    <image id="killButton" class="transit boxCommon" ng-click="room.killActiveBox()" src="/images/button_close.png" style="display:none;z-index:3" alt="close button">
    <image id="muteButton" class="transit boxCommon" ng-click ="room.muteActiveBox()" src="/images/button_mute.png" style="display:none;z-index:3" alt="mute button">
    <image id="textEntryButton" class="transit boxCommon" ng-click ="room.showTextEntry()" src="/images/textEntry.png" style="z-index:3;display:none" alt="text button">
</div>
<widgetright></widgetright>