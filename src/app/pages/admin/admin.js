/**
 * Created by lishoubo on 16/5/21.
 */

$(function () {
    var simplemde = new SimpleMDE({
        element: document.getElementById("article-content-area"),
        autoDownloadFontAwesome: true,
        autofocus: true,
        renderingConfig: {
            singleLineBreaks: true,
            codeSyntaxHighlighting: true
        },
        toolbarTips: false
    }), data = {};

    new Vue({
        el: '#form-article',
        data: data,
        methods: {
            save: function () {
                $.ajax({
                    url: '/api/admin/articles/',
                    method: 'post',
                    data: data,
                    dataType: 'json',
                    success: function (result) {
                        alert(result)
                    }
                })

            }
        }
    })

});