//Based on the Pi Chart example from dbuezas
//Original https://gist.github.com/dbuezas/9306799
(function() {
    'use strict';
    var svg = d3.select("#chart")
        .append("svg")
        .append("g");

    svg.append("g")
        .attr("class", "slices");

    var width = 380,
        height = 350,
        radius = Math.min(width, height) / 2;

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        });

    var arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

    var outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var key = function(d) {
        return d.data.label;
    };

    var color = d3.scale.ordinal()
        .domain(["clear blue", "clear blue 2", "clear purple", "dark purple", "skin", "orange", "bright orange", "a", "b", "c", "d"])
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    function randomData() {
        var labels = color.domain();
        return labels.map(function(label) {
            return {
                label: label,
                value: Math.random()
            };
        });
    }

    var randomLoop = function() {
        change(randomData());
        setTimeout(randomLoop, 1000);
    };

    randomLoop();

    function change(data) {

        /* ------- PIE SLICES -------*/
        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

        slice.enter()
            .insert("path")
            .style("fill", function(d) {
                return color(d.data.label);
            })
            .attr("class", "slice");

        slice
            .transition().duration(1000)
            .attrTween("d", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return arc(interpolate(t));
                };
            });

        slice.exit()
            .remove();
    }
}());
