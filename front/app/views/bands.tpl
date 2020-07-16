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
<div id="bands">
	<div ng-repeat="band in bands.bands | orderBy: 'name'" class="user-list" ng-if="band._id !== bands.band.id">
		<a ng-href="/profile/{{band.slug}}">
			<img src="http://bandmeter.com/uploads/{{band.image}}" ng-if="band.image" alt="{{band.name}}">
			<img src="/uploads/defaultuser.gif" ng-if="!band.image" alt="{{band.name}}">
			<div class="user-data">
				<p class="nickname">{{band.name}}<span ng-if="band.country">| {{band.country}}</span></p>
			</div>
		</a>
	</div>
</div>
<widgetright></widgetright>