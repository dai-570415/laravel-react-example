# [Hooks対応] Laravel + React でシンプルな投稿機能をつくる

# 環境
- Laravel 5.8
- React(Hooks対応)
- VirtualBox Vagrant Homestead
- Macの場合、XCode必須
- [Laravel環境構築 チートシート](https://qiita.com/dai_designing/items/6fe5f678bf5a05e27c05)
※まず、ここまでLaravelプロジェクトが立ち上がります

## 参考記事チートシート
### Vue → Reactに変更
デフォルトではVueになっているためReactに変更する必要があります。

```bash
$ php artisan preset react
$ npm install && npm run dev
```

### テーブル・モデル関係

```bash
$ php artisan make:migration create_todos_table
```

```php:database/migrations/xxxxx_create_todos_table.php
// database/migrations/xxxxx_create_todos_table.php
// ...省略
public function up()
{
    Schema::create('todos', function (Blueprint $table) {
        $table->bigIncrements('id');
        $table->string('title');
        $table->timestamps();
    });
}
// ...省略
```

```bash
$ php artisan migrate
$ php artisan make:model Todo
$ php artisan make:controller TodoController
```
モデルは今回いじりません。

### コントローラーの編集

```php:app/HTTP/Controllers/TodoController.php
// app/HTTP/Controllers/TodoController.php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Todo;

class TodoController extends Controller
{
    // Read
    public function getTodos()
    {
        $todos = Todo::all();
        return $todos;
    }
    // Create
    public function addTodo(Request $request)
    {
        $todo = new Todo;
        $todo->title = $request->title;
        $todo->save();

        $todos = Todo::all();
        return $todos;
    }
    // Delete
    public function deleteTodo(Request $request)
    {
        $todo = Todo::find($request->id);
        $todo->delete();

        $todos = Todo::all();
        return $todos;
    }
}
```

### 全体のルーティング

```php:routes/web.php
// routes/web.php
<?php
Route::get('/{path?}', function(){
    return view('welcome');
}) -> where('path','.*');
```

### welcome.blade.phpの編集

```css:public/css/style.css
/* public/css/style.css */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```
とりあえず、リセットするスタイルを読み込ませます。

```php:resources/views/welcome.blade.php
<!-- resources/views/welcome.blade.php -->
<!doctype html>
<html lang="ja">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- CSS -->
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <title>Laravel for React</title>
</head>

<body>
    <div id="root"></div>
    <!-- JavaScript -->
    <script src="{{mix('js/app.js')}}" ></script>
</body>
</html>
```

### エンドポイント設定

```php:routes/api.php
// routes/api.php
<?php
// ...省略
// 追加
Route::group(['middleware' => 'api'], function(){
    Route::get('get', 'TodoController@getTodos');
    Route::post('add', 'TodoController@addTodo');
    Route::post('del', 'TodoController@deleteTodo');
});
```
ここまででphp側終了です。

以降、React(resources/js/...)側を編集

```bash
$ npm run watch-poll
```
`npm run watch`では自動更新が効きません。

# Reactの依存関係インストール

- react-hook-form
- react-router-dom

```bash
$ npm install react-hook-form
$ npm install --save react-router-dom
```

※今回bootstrap.jsは使用しません。

# ベーステンプレート編集

```jsx:resources/js/app.js
// resources/js/app.js
window._ = require('lodash');
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Index from './components/Index';
import TodoAppIndex from './components/TodoApp/Index';
import Nav from './elements/Aside';

const App = () => (
  <Router>
    <div className="container">
        <Nav />
        <main>
            <Route exact path="/" component={Index}/>
            <Route exact path="/todoapp" component={TodoAppIndex}/>
        </main>
    </div>
  </Router>
);
export default App;

ReactDOM.render(<App />, document.getElementById('root'));
```

# 各種コンポーネント実装

```jsx:resources/js/components/Index.js
// resources/js/components/Index.js
import React from 'react';

const Index = () => (
  <div className="home">
    <h2>Home</h2>
  </div>
);

export default Index;
```

```jsx:resources/js/components/TodoApp/Index.js
// resources/js/components/TodoApp/Index.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const Render = ({ todos, deleteTodo }) => {
    return todos.map(todo => {
        return (
            <section key={todo.id}>
                <div>00{todo.id}: {todo.title}</div>
                <div><button onClick={() => deleteTodo(todo)}>完了</button></div>
            </section>
        );
    });
}
// functionコンポーネント(改良)
const TodoApp = () => {
    // Read
    const [todos, setTodos] = useState([]);
    console.log(todos);

    useEffect(() => {
        fetchTodos();
    }, []); // ★☆★☆★☆重要☆★☆★☆★ 第2引数に空配列を渡すこと。渡さないと無限ループに陥る。

    const fetchTodos = async () => {
        try {
            const response = await axios.get('/api/get');
            setTodos(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    // Create
    const { register, handleSubmit, errors } = useForm();
    const handleOnSubmit = (todo) => {
        console.log(todo.title);
        axios
        .post('/api/add', {
            title: todo.title
        })
        .then(() => {
            fetchTodos();
        })
        .catch(error => {
            console.log(error);
        });
    }

    // Delete
    const deleteTodo = (todo) => { 
        axios
        .post('/api/del', {
            id: todo.id
        })
        .then(() => {
            fetchTodos();
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <div className="todo-page">
            <h2>Todo</h2>
            { errors.title && <span className="error">{ errors.title.message }</span> }
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <input
                    type="text"
                    className={errors.title && 'error'}
                    name="title"
                    ref={register({
                        required: 'タイトルは必ず入力してください。'
                    })}
                />
                <button>追加</button>
            </form>

            <Render todos={todos} deleteTodo={deleteTodo} />
        </div>
    );
}

export default TodoApp;
```

```jsx:resources/js/elements/Aside.js
// resources/js/elements/Aside.js
import React from 'react';
import { Link } from 'react-router-dom';

const Aside = () => (
  <aside className="Nav">
        <ul className="navi">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/todoapp">TodoApp</Link></li>
    </ul>
  </aside>
);

export default Aside;
```

### 参考記事
[Laravel5.7でReactを利用した開発をしてみる](https://qiita.com/zaburo/items/fbcdd73d8d707357c25f)