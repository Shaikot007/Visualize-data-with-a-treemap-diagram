const movie_url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

fetch(movie_url)
  .then(response => response.json())
  .then(movie_data => {
    let hierarchy = d3.hierarchy(movie_data, data => {
      return data["children"];
    }).sum(data => {
      return data["value"];
    }).sort((data1, data2 ) => {
      return data2["value"] - data1["value"];
    });

    let treeMap = d3.treemap()
                    .size([1200, 700])
                    .padding(0.5);

    treeMap(hierarchy);

    let movieTiles = hierarchy.leaves();

    let tooltip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0)
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("justify-content", "center")
                    .style("position", "absolute")
                    .style("text-align", "center")
                    .style("width", "auto")
                    .style("height", "auto")
                    .style("padding", "6px")
                    .style("font-size", "12px")
                    .style("background-color", "rgba(255, 255, 204, 0.9)")
                    .style("box-shadow", "1px 1px 10px rgba(128, 128, 128, 0.6)")
                    .style("border-radius", "2px")
                    .style("pointer-events", "none");

    let tile = d3.select(".svg-content")
                 .selectAll("g")
                 .data(movieTiles)
                 .enter()
                 .append("g")
                 .attr("transform", data => {
                   return "translate(" + data["x0"] + "," + data["y0"] + ")";
                 });

    tile.append("rect")
        .attr("class", "tile")
        .attr("fill", data => {
          let category = data["data"]["category"];
          if(category === "Action") {
            return "steelblue";
          }
          else if (category === "Adventure") {
            return "green";
          }
          else if (category === "Comedy") {
            return "coral";
          }
          else if (category === "Drama") {
            return "orange";
          }
          else if (category === "Animation") {
            return "pink";
          }
          else if (category === "Family") {
            return "grey";
          }
          else if (category === "Biography") {
            return "tan";
          }
        })
        .attr("data-name", data => {
          return data["data"]["name"];
        })
        .attr("data-category", data => {
          return data["data"]["category"];
        })
        .attr("data-value", data => {
          return data["data"]["value"];
        })
        .attr("height", data => {
          return data["y1"] - data["y0"];
        })
        .attr("width", data => {
          return data["x1"] - data["x0"];
        })
        .on("mouseover", (data, index) => {
          tooltip.transition()
                 .style("opacity", 1)
                 .style("left", data.pageX + "px")
                 .style("top", data.pageY + "px");
          
          document.querySelector("#tooltip").setAttribute("data-value", index["data"]["value"]);
          document.querySelector("#tooltip").innerHTML = 
            "Name: " + index["data"]["name"] + ", " + "<br />" + 
            "Category: " + index["data"]["category"] + ", " + "<br />" +
            "Value: " + index['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ".";
        })
        .on("mouseout", () => {
            tooltip.transition()
                  .style("opacity", 0);
        });

    tile.append("text")
        .attr("class", "tile-text")
        .attr("font-size", "10px")
        .selectAll("tspan")
        .data(data => {
          return data["data"]["name"].split(/(?=[A-Z][^A-Z])/g);
        })
        .enter()
        .append("tspan")
        .attr("x", 5)
        .attr("y", (data, index) => {
          return 15 + index * 10;
        })
        .text(data => {
          return data;
        });
  }
)