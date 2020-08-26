/**
 * Welcome to the Looker Visualization Builder! Please refer to the following resources 
 * to help you write your visualization:
 *  - API Documentation - https://github.com/looker/custom_visualizations_v2/blob/master/docs/api_reference.md
 *  - Example Visualizations - https://github.com/looker/custom_visualizations_v2/tree/master/src/examples
 **/

 const visObject ={
 /**
  * Configuration options for your visualization. In Looker, these show up in the vis editor
  * panel but here, you can just manually set your default values in the code.
  **/
  options: {
    first_option: {
    	type: "string",
      label: "My First Option",
      default: "Default Value"
    },
    second_option: {
    	type: "number",
      label: "My Second Option",
      default: 42
    }
  },
  create: function(element, config) {
    element.innerHTML = `
          <style>
            .mapchart{
              fill: #005DAA;
             
            }
            .groups text {
              font-size: 2em;
            }
            .mapchart, .map-tip {
                font-family: "Proxima Nova", Montserrat, sans-serif;
            }
            .map-tip {
              position: absolute;
              top: 10px;
              left: 20px;
              
            }
            .land {
               fill: blue;
               stroke: #766951;
             }
            .geojson {
              fill: red;
              stroke: red;
              stroke-width: 5;
              }
          </style>
        `
    
        this.tooltip = d3.select(element).append('div').attr('class', 'map-tip')
        this.svg = d3.select(element).append('svg')
    },
   
    /**
     * UpdateAsync is the function that gets called (potentially) multiple times. It receives
     * the data and should update the visualization with the new data.
     **/
 updateAsync: function(data, element, config, queryResponse, details, doneRendering){
   var width = 900, 
       height = 600;
   const zoom = d3.zoom()
                  .scaleExtent([1, 40])
                  .translateExtent([[0,0], [width, height]])
                  .extent([[0, 0], [width, height]])
                  .on("zoom", zoomed);
   const svg = this.svg
                   .html('')
                   .attr("width", width)
                   .attr("height", height)
                   .call(zoom);
   const g = svg.append("g");
   var projection = d3.geoEquirectangular()
                      .scale(170)
                      .translate([width / 2, height / 2]);
 
   var geoPath = d3.geoPath()
         .projection(projection);
   
   var graticule = d3.geoGraticule();
   
   formattedData = []
    data.forEach(function(d) {
      formattedData.push({
      	coordinate: d["user.coordinate"]["value"],
        name: d["user.name"]["value"]
      });
    });
   var line=d3.line()
              .x(function (d) { return projection (d.coordinate)[0]; })
		          .y(function (d) { return projection (d.coordinate)[1]; })

   d3.queue()
     .defer(d3.json,"https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
     .await(ready);
   
   function ready(error, countries)
   {
     
       g.selectAll(".land")
        .data(topojson.feature(countries, countries.objects.states).features)
        .enter()
        .append("path")
        .attr( "d", geoPath )
        .attr("stroke","yellow")
        .attr("fill","blue")
        .attr("class","country");
     g.selectAll("geojson")
        .data(formattedData).enter()
        .append("path")
        .attr("stroke","black")
        .attr("fill","white")
        .attr('fill-opacity', 0.1)
        .attr("d",line(formattedData));
     g.selectAll("circle")
		    .data(formattedData).enter()
		    .append("circle")
		    .attr("cx", function (d) { return projection (d.coordinate)[0]; })
		    .attr("cy", function (d) { return projection (d.coordinate)[1]; })
		    .attr("r", "3px")
		    .attr("fill", "red");
     g.selectAll("text").data(formattedData)
      .enter()
      .append("text") 
		  .attr("x", function (d) { return projection (d.coordinate)[0]; })
		  .attr("y", function (d) { return projection (d.coordinate)[1]; })
      .attr("dy", -7) 
      .style("fill", "black") 
      .attr("text-anchor", "middle")
      .attr("fontsize",".2px")
      .text(function(d) {return  (d.name);});

    }
   function zoomed(){
     g.attr("transform", d3.event.transform);
   }  
    doneRendering()
}
};

looker.plugins.visualizations.add(visObject);
