'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.get('api/v1/', () => {
  return { greeting: 'API SPC Unilver - Systelec S.A' };
});

// Users
Route.get('api/v1/users', 'UserController.index');
Route.get('api/v1/users/:id', 'UserController.show');
Route.post('api/v1/users', 'UserController.store').validator('User/StoreUser');
Route.put('api/v1/users/:id', 'UserController.update').validator('User/UpdateUser');
Route.delete('api/v1/users/:id', 'UserController.destroy');

// Tendencias
Route.get('api/v1/tendencias', 'TendenciaController.index');
Route.get('api/v1/tendencias/:id', 'TendenciaController.show');
Route.post('api/v1/tendencias', 'TendenciaController.store').validator('Tendencia/StoreTendencia');
Route.put('api/v1/tendencias/:id', 'TendenciaController.update').validator(
  'Tendencia/UpdateTendencia'
);
Route.delete('api/v1/tendencias/:id', 'TendenciaController.destroy');
Route.get('api/v1/tendencias/:id/historicos', 'TendenciaController.indexHistoricos');

// Tags
Route.get('api/v1/tags', 'TagController.index');
Route.get('api/v1/tags/:id', 'TagController.show');
Route.post('api/v1/tags', 'TagController.store').validator('Tag/StoreTag');
Route.put('api/v1/tags/:id', 'TagController.update').validator('Tag/UpdateTag');
Route.delete('api/v1/tags/:id', 'TagController.destroy');
Route.get('api/v1/tags/:id/historicos', 'TagController.indexHistoricos');

// Limites
Route.get('api/v1/limites', 'LimiteController.index');
Route.get('api/v1/limites/:id', 'LimiteController.show');
Route.post('api/v1/limites', 'LimiteController.store').validator('Limite/StoreLimite');
Route.put('api/v1/limites/:id', 'LimiteController.update').validator('Limite/UpdateLimite');
Route.delete('api/v1/limites/:id', 'LimiteController.destroy');
Route.get('api/v1/limites/:id/historicos', 'LimiteController.indexHistoricos');

// Historicos
Route.get('api/v1/historicos', 'HistoricoController.index');

// Destinatario
Route.get('api/v1/destinatarios', 'DestinatarioController.index');
Route.get('api/v1/destinatarios/:id', 'DestinatarioController.show');
Route.post('api/v1/destinatarios', 'DestinatarioController.store').validator(
  'Destinatario/StoreDestinatario'
);
Route.put('api/v1/destinatarios/:id', 'DestinatarioController.update').validator(
  'Destinatario/UpdateDestinatario'
);
Route.delete('api/v1/destinatarios/:id', 'DestinatarioController.destroy');

// Alarmas
Route.get('api/v1/alarmas', 'AlarmaController.index');
Route.put('api/v1/alarmas/:id/reconocer', 'AlarmaController.reconocer');

// Productos
Route.get('api/v1/productos', 'ProductoController.index');
Route.get('api/v1/productos/:id', 'ProductoController.show');
Route.post('api/v1/productos', 'ProductoController.store').validator('Producto/StoreProducto');
Route.put('api/v1/productos/:id', 'ProductoController.update').validator('Producto/UpdateProducto');
Route.delete('api/v1/productos/:id', 'ProductoController.destroy');

// Taques
Route.get('api/v1/tanques', 'TanqueController.index');
Route.get('api/v1/tanques/:id', 'TanqueController.show');
Route.post('api/v1/tanques', 'TanqueController.store').validator('Tanque/StoreTanque');
Route.put('api/v1/tanques/:id', 'TanqueController.update').validator('Tanque/UpdateTanque');
Route.delete('api/v1/tanques/:id', 'TanqueController.destroy');
