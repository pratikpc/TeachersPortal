$('select').on('change', function() {
    $('#result').empty();
    $.each(new Array(+this.value), function(i) {
        $('<div />', {
            text : 'this is div nr : '+(i+1)
        }).appendTo('#result');
    });
});