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