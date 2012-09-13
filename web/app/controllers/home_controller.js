load('application');

action('welcome', function () {
    render({
        title: "home#welcome"
    });
});

action('index', function () {
    render({
        title: "home#index"
    });
});

action('dashboard', function () {
    render({
        title: "home#dashboard"
    });
});