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