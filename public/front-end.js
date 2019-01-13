$(document).ready(function () {
    for (let i = 0; i < window.chairs.length; i++) {
        $('.chair-control').append('<article>' +
            '    <h3>Stuhl ' + i + '</h3>' +
            '    <input class="fra_' + i + '" type="number" placeholder="final rotation angle">' +
            '    <button class="set-target" data-index="' + i + '">Set target</button>' +
            '    <button class="stop" data-index="' + i + '">Stop</button>' +
            '</article>');
    }

    $('body').on('click', '.stop', function () {
        let chairIndex = $(this).data('index');
        stop(chairIndex);
    });

    let selectedChair = undefined;
    $('body').on('click', '.set-target', function () {
        if (selectedChair === $(this).data('index')) {
            selectedChair = undefined
        } else {
            selectedChair = $(this).data('index');
        }
        $('.set-target').removeClass('selected');
        $(this).toggleClass('selected');
    });

    $('body').on('click', function (e) {
        if (selectedChair !== undefined) {
            let fra;
            if ($('.fra_' + selectedChair).val() !== '') {
                fra = parseInt($('.fra_' + selectedChair).val() !== '');
            }
            let x = (Math.round(e.pageX / 100) * 100) / 100;
            let y = (Math.round(e.pageY / 100) * 100) / 100;
            if (x <= 6 && y <= 6) {
                let target = {x: x, y: y};
                window.go(selectedChair, target, fra);
            }
        }
    })
});
