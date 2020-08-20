
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
   
   formattedData = []
   data.forEach(function(d) {
         formattedData.push
           var dimension = queryResponse.fields.dimension_like
           var measure = queryResponse.fields.measure_like[0]
         
       });
   d3.queue()
     .defer(d3.json,"https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
     .await(ready);
   
   function ready(error, countries){
     svg.append("g")
        .selectAll("path")
        .data(topojson.feature(countries, countries.objects.countries).features)
        .enter()
        .append("path")
        .attr( "d", geoPath )
        .attr("class","country");
   }
   doneRendering()
 }
};

looker.plugins.visualizations.add(visObject);
##DEPENDENCY
"[
    "https://code.jquery.com/jquery-2.2.4.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/d3/4.13.0/d3.js",
    "https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js"
]"
