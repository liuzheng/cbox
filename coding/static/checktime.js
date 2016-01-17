/**
 * Created by liuzheng on 1/17/16.
 */
;
function CheckTime() {
    $("time.lcb-message-time").each(function () {
        var deltaSecond = moment().diff($(this).attr("title") * 1000) / 1000;
        if (deltaSecond >= 60) {
            var deltaMin = deltaSecond / 60;
            if (deltaMin >= 60) {
                var deltaHour = deltaMin / 60;
                if (Math.round(deltaHour) == 1) {
                    $(this).html(" 1 hr")
                } else {
                    $(this).html(" " + Math.round(deltaHour) + " hrs")
                }
            } else {
                if (Math.round(deltaMin) == 1) {
                    $(this).html(" 1 min")
                } else {
                    $(this).html(" " + Math.round(deltaMin) + " mins")
                }
            }
        } else {
            if (deltaSecond < 5) {
                $(this).html(" Now ")
            } else {
                $(this).html(" " + Math.round(deltaSecond) + " sec")
            }
        }
    })
}
function TimeFlash() {
    setTimeout("TimeFlash()", 180000)
}
$(document).ready(function () {
    CheckTime();
    TimeFlash()
});