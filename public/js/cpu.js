//$(function(){
    var cpu = cpu || {};

    (function(){

        function genConfig() {
            var rand = Math.random();
            return {
                name : "cpuChild" + rand,
                defaultWidth : 960,
                defaultHeight : 700,
                autoShow : true,
                url : 'views/cpu.html'
            }
        }


        cpu.open = function(){

            var config = genConfig();
            // var addThese = genContent;


            // //console.log('sure ill make you a new one', config);

            var cpuWindow = new fin.desktop.Window(config,function(){
                //console.log('sure ill make you a new one',cpuWindow );
               // var cpuNativeWindow = cpuWindow.getNativeWindow();
               // console.log('this is my native', cpuNativeWindow)
                //loadToWindow(addThese,cpuNativeWindow.document.body);

                //cpuWindow.show();
            },function  (err) {
                console.log('this was the err', err);
            });

            return cpuWindow;
        };
    })()
//})//end ready

