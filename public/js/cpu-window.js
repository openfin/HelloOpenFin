
(function(){

    var x, y, z,
        yAxis,
        stack,
        nest,
        area,
        svg;

    margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 900 - margin.left - margin.right,
    height = 280 - margin.top - margin.bottom;

    x = d3.time.scale()
        .range([0, width]);

    y = d3.scale.linear()
        .range([height, 0]);

    z = d3.scale.category10();

    yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    stack = d3.layout.stack()
        .offset("zero")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.date; })
        .y(function(d) { return d.value; });

    nest = d3.nest()
        .key(function(d) { return d.key; });

    area = d3.svg.area()
        .interpolate("cardinal")
        .x(function(d) { return x(d.date); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

    svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    function renderLegend (data, svg) {

        if (data.length === 0) return;

        svg.selectAll('.legend').remove();


        var legendKeys = 0,
            dateStamp = data[0].date.toString(),
            dataLength = data.length,
            legend,
            i;

        for (i = 0; i < dataLength; i++ ) {
            if (data[i].date.toString() === dateStamp) {
                legendKeys++
            }
            else {
                break;
            }
        }

        legend = svg.selectAll('.legend')
            .data(data.slice(0,legendKeys));

        legend.enter()
            .append('g')
            .attr('class', 'legend');

        legend.data(data);

        legend.append('rect')
            .attr("x", width - 195)
            .attr('y', function(d, i){ return i *  20;})
            .attr('width', 10)
            .attr('height', 10)
            .style("fill", function(d, i) { return z(i); });

        legend.append('text')
            .attr("x", width - 180)
            .attr('y', function(d, i){ return (i *  20) + 9;})
            .text(function(d){ return d.name + ": " + d.cpuUsage });


    }


    function refreshChart (data) {

        var xAxis ,
            layers,
            dataMax,
            minDomain;

        // here we are clearing the old axis and view data
        // this should really be handled on an update
        d3.selectAll('.axis').remove();
        svg.selectAll(".layer").remove();


        xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.seconds);

        data.forEach(function(d) {
            //we are already passing a date obj (thats what it wants)
            //d.date = format.parse(d.date);

            d.value = +d.value;
        });


        layers = stack(nest.entries(data));

        x.domain(d3.extent(data, function(d) { return d.date; }));
        //y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

        //lets have the domain of y extend at least to 10
        dataMax = d3.max(data, function(d) { return d.y0 + d.y; });
        minDomain = (dataMax + 8) < 10 ? 10 : dataMax + 8 ;
        y.domain([0, minDomain  ]);

        svg.selectAll(".layer")
          .data(layers)
          .enter().append("path")
          .attr("class", "layer")
          .attr("d", function(d) { return area(d.values); })
          .style("fill", function(d, i) { return z(i); });
            //

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height + 3) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);



        renderLegend(data, svg);


    }//end refresh chart




    document.addEventListener('DOMContentLoaded', function() {
        fin.desktop.main(function () {

            var ofDraggable = document.querySelectorAll('.of-draggable')[0],
                closeButton = document.querySelectorAll('#close-app')[0],
                procList = CappedArray(10),
                mainWindow = fin.desktop.Window.getCurrent();

            /* kick off a recursive timeout call fetching process data */
            reloadProcInfo(procList,refreshChart)

            //Close button event handler
            closeButton.addEventListener('click', function() {
                mainWindow.close();
            });

            utils.registerDragHandler(ofDraggable, {
                //once movement starts make the window transparent.
                onDragStart: function(x, y) {
                    mainWindow.updateOptions({
                        opacity: 0.5
                    });
                },
                //move the window with the mouse
                onDrag: function(X, Y) {
                    window.moveTo(X, Y);
                },
                //window can now stop being transparent.
                onDragEnd: function() {
                    mainWindow.updateOptions({
                        opacity: 1
                    });
                }
            });

        });
    });


})()


function reloadProcInfo(procList,refreshChart){


    fin.desktop.System.getProcessList(function(arrList){

        var date = new Date(),
            timeKey = date.getTime(),
            currentProcesses = {};

        currentProcesses[timeKey] = {};

        arrList.forEach(function(item){

            item.key = item.name;
            item.value = item.cpuUsage;
            item.date = new Date(timeKey);

            currentProcesses[timeKey][item.name] = item;

        });

        procList.addToFront(currentProcesses);

        //update the chart each cycle
        refreshChart(procListToD3Array(procList.getArray()));

        return setTimeout(function(){
            reloadProcInfo(procList,refreshChart);
        },2000);

    }, function (err){
        console.log('this was the err', err);
    });
}


function procListToD3Array(procList) {
    var returnArr = [],
    listLength = procList.length;

    while (listLength--){
        var procSet = procList[listLength];
        for (var proc in procSet){
            for (indiProc in procSet[proc] ) {
                returnArr.unshift( procSet[proc][indiProc]);
            }
        }
    }

    return returnArr;
}


function CappedArray (max) {
    var me = this;
    this.arr = [];
    this.addToFront = function(item){
        if(me.arr.length >= max){
            me.arr.pop();
        }
        me.arr.unshift(item)
    }
    this.addToBack = function(){
        if(me.arr.length >= max){
            me.arr.shift();
        }
        me.arr.push(item);
    }

    return {
        addToFront : this.addToFront,
        addToBack : addToBack,
        getArray : function(){
            return me.arr
        }
    }
}

