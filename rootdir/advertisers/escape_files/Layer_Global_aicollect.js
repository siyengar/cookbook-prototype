//Global on/off switch for AiCollectXX.iperceptions.com

var globalswitch;

globalswitch = true;


//Prevent crawlers and Mobile browsers
globalSwitch = (function(a) { if (/android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|googlebot|msbot|yahoo|bingbot/i.test(a)) return false; else return true; })(navigator.userAgent || navigator.vendor || window.opera);

//globalswitch = false;


if (globalswitch == true)
{
    try
    {
        //If Google Chrome : don't serve
        if ((navigator.userAgent.toLowerCase().indexOf('chrome') === -1)) { Exec(); }
    } catch (err) { }
}


//added for 850
function checkAlive() {

    if (globalswitch == true) {
        try {
            //If Google Chrome : don't serve
            if ((navigator.userAgent.toLowerCase().indexOf('chrome') === -1)) { Exec(); }
        } catch (err) { }
    }
 }
