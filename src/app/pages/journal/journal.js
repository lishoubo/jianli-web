/**
 * Created by lishoubo on 16/5/14.
 */

$(function () {
    $('#journal-detail-datepicker').datepicker({
        language: 'zh-CN',
        todayHighlight: true,
        beforeShowDay: function (date) {
            //if (date.getDate() == 26) {
            //    return {
            //        tooltip: "我们将在这一天到现场",
            //        classes: "focus"
            //    };
            //}
        }
    });
});
