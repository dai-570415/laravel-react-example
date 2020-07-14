<?php

use Illuminate\Http\Request;

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'api'], function(){
    Route::get('get', 'TodoController@getTodos');
    Route::post('add', 'TodoController@addTodo');
    Route::post('del', 'TodoController@deleteTodo');
});