'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')

Route.on('/').render('welcome')

// auth - login - register routes
Route.post('login', 'AuthController.login')
Route.post('register', 'AuthController.register')
Route.get('login', 'AuthController.showLogin')

// profile routes
Route
    .get('profile', 'ProfileController.index')
    .middleware('auth')

// site routes
Route
    .get('sites', 'SiteController.index')
    .middleware('auth')
    .as('sites')

Route
    .get('sites/create', 'SiteController.create')
    .middleware('auth')
    .as('showCreateSite')

Route
    .post('sites/store', 'SiteController.store')
    .middleware('auth')
    .as('storeSite')

// dashboard
Route
    .on('dashboard')
    .render('dashboard')
    .middleware('auth')
