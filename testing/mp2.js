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
            .graticule {
              fill: none;
              stroke: #fff;
              stroke-width: .5px;
               }
           .graticule :nth-child(2n) {
             stroke-dasharray: 2,2;
              }
            .land {
               fill: #d7c7ad;
               stroke: #766951;
             }
            .geojson {
              fill: none;
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
   const svg = this.svg
                   .html('')
                   .attr("width", width)
                   .attr("height", height)
                   .append("g")

   var projection = d3.geoEquirectangular()
                      .scale(170)
                      .translate([width / 2, height / 2]);
 
   var geoPath = d3.geoPath()
         .projection(projection);
   
   var graticule = d3.geoGraticule();
   
   formattedData = []
    data.forEach(function(d) {
      formattedData.push({
	      dimensions : queryResponse.fields.dimension_like
      });
    });
   d3.queue()
     .defer(d3.json,"https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
     .await(ready);
     // points

   function ready(error, countries){
     svg.append("g")
        .selectAll(".land")
        .data(topojson.feature(countries, countries.objects.states).features)
        .enter()
        .append("path")
        .attr( "d", geoPath )
        .attr("class","country");
    // add circles to svg
     svg.selectAll("circle")
		    .data(formattedData).enter()
		    .append("circle")
		    .attr("cx", function (d) { return projection (d.coordinate)[0]; })
		    .attr("cy", function (d) { return projection (d.coordinate)[1]; })
		    .attr("r", "3px")
		    .attr("fill", "red");
   }
   doneRendering()
 }
};

looker.plugins.visualizations.add(visObject);
