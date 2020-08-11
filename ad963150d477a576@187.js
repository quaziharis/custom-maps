import * as d3 from 'd3'
import { handleErrors } from '../common/utils'
declare var looker: Looker
declare var LookerCharts: LookerChartUtils
const vismap = {
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
     create: function(element, config){
        element.innerHTML = "<h1>Ready to render!</h1>";
        this.svg = d3.select(element).append('svg')
    },
    updateAsync: function(data, element, config, queryResponse, details, doneRendering){
        export default function define(runtime, observer) {
            const main = runtime.module();
          //   main.variable(observer()).define(["md"], function(md){return(
          // md`# Zoomable Raster & Vector
          
          // This notebook combines [d3-tile](https://github.com/d3/d3-tile) for displaying raster map tiles, [d3-zoom](https://github.com/d3/d3-zoom) for panning and zooming, [d3-geo](https://github.com/d3/d3-geo) for rendering vector geometry, and [TopoJSON](https://github.com/topojson) for efficient representation of vector geometry.`
          // )});
            main.variable(observer("map")).define("map", ["width","height","initialScale","initialCenter","url"], function(width,height,initialScale,initialCenter,url)
          {
            // print data to console for debugging:
            console.log("data",data);
            console.log("config",config);
            console.log("queryResponse",queryResponse);  
            const dimensions = queryResponse.fields.dimension_like
            const measure = queryResponse.fields.measure_like[0]

        
            const svg = d3.create("svg")
                .html('')
                .attr("viewBox", [0, 0, width, height]);
          
            const projection = d3.geoMercator()
                .scale(1 / (2 * Math.PI))
                .translate([0, 0]);
          
            const render = d3.geoPath(projection);
          
            const tile = d3.tile()
                .extent([[0, 0], [width, height]])
                .tileSize(512);
          
            const zoom = d3.zoom()
                .scaleExtent([1 << 10, 1 << 15])
                .extent([[0, 0], [width, height]])
                .on("zoom", () => zoomed(d3.event.transform));
          
            let image = svg.append("g")
                .attr("pointer-events", "none")
              .selectAll("image");
          
            const path = svg.append("path")
                .attr("pointer-events", "none")
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round");
          
            svg
                .call(zoom)
                .call(zoom.transform, d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(-initialScale)
                    .translate(...projection(initialCenter))
                    .scale(-1));
          
            function zoomed(transform) {
              const tiles = tile(transform);
          
              image = image.data(tiles, d => d).join("image")
                  .attr("xlink:href", d => url(...d))
                  .attr("x", ([x]) => (x + tiles.translate[0]) * tiles.scale)
                  .attr("y", ([, y]) => (y + tiles.translate[1]) * tiles.scale)
                  .attr("width", tiles.scale)
                  .attr("height", tiles.scale);
          
              projection
                  .scale(transform.k / (2 * Math.PI))
                  .translate([transform.x, transform.y]);
          
              path.attr("d", render(feature));
            }
          
            return svg.node();
          }
          );
            main.variable(observer("url")).define("url", function(){return(
          (x, y, z) => `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/${z}/${x}/${y}${devicePixelRatio > 1 ? "@2x" : ""}?access_token=pk.eyJ1IjoicXVhemloYXJpcyIsImEiOiJja2RsZGQxMnUwMXlhMndxbjRrY3g4ZnZmIn0.bIV6NVNSQ4mNixKJLNHOUg`
          )});
            main.variable(observer("height")).define("height", function(){return(
          600
          )});
            main.variable(observer("initialCenter")).define("initialCenter", function(){return(
          [-98 - 35 / 60, 39 + 50 / 60]
          )});
            main.variable(observer("initialScale")).define("initialScale", function(){return(
          1 << 12
          )});
            return main;
          }
        }
    };
    
    looker.plugins.visualizations.add(vismap); 
