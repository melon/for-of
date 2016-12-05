window.onerror = function (msg, src, lineno, colno, errObj) {
    alert(`${src}`);
    alert(`${msg}+${lineno}+${colno}`);
};

var iterable = [10, 20];
for (var item of iterable) {
    alert(item);
}
