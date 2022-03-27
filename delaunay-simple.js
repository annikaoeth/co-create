// added by Annika Oeth
var points = [];
var triangles;
var voronoiEdges = [];
var voronoiShapes = new Map();

// buttons
let colors1;
let colors2;
let colors3;
let colors4;
let colors5;
let colors6;

// slider for number of points
let slider;
var total_points = 70;

function setup() {
  width = windowWidth;
  height = windowHeight;
  let canvas = createCanvas(width, height);
  canvas.parent('sketch-container');

  // add checkboxes for different color schemes
  colors1 = createCheckbox('colors 1', true);
  colors1.position(180, 30);

  colors2 = createCheckbox('colors 2', true);
  colors2.position(410, 30);

  // create a slider for number of points
  slider = createSlider(0, 120, 70);
  slider.position(610, 30);
  slider.style('width', '80px');



//  fix this shit later
  slider.changed(recalculateVoronoi);

  // calculate new voronoi points
  var widthRange = width + 300;
  var heightRange = height + 300;
  // shift some points to be negative
  var shift = 50;


  for (var i = 0; i < total_points; ++i) {
		points.push(new delaunay.Vertex(Math.floor(Math.random() * widthRange) - shift, Math.floor(Math.random() * heightRange) - shift));
	}

  points.push(new delaunay.Vertex(mouseX, mouseY));

  // make points past 4 corners every time
  // points.push(new delaunay.Vertex(0,0));
  // points.push(new delaunay.Vertex(0,height));
  // points.push(new delaunay.Vertex(width,0));
  // points.push(new delaunay.Vertex(width,height));

  points.push(new delaunay.Vertex(-shift,-shift));
  points.push(new delaunay.Vertex(-shift, height + shift));
  points.push(new delaunay.Vertex(width + shift, -shift));
  points.push(new delaunay.Vertex(width + shift,height + shift));

  var newTriangles = delaunay.triangulate(points);
  triangles = newTriangles;

	// make voronoi diagram
  calculateVoronoi();


  // makes draw only get called once
  //noLoop();
}

function draw() {

  if (mouseIsPressed) {

    // check which triangle mouse is inside and change color?


  } else {
  //  fill(255);
  }

	strokeWeight(4);


  // change the frameRate?

	points.forEach( function(p) {
  //  point(p.x,p.y);
  })



	// print delaunay triangulation
	triangles.forEach( function(triangle) {
		// line(triangle.v0.x, triangle.v0.y, triangle.v1.x, triangle.v1.y);
		// line(triangle.v1.x, triangle.v1.y, triangle.v2.x, triangle.v2.y);
		// line(triangle.v2.x, triangle.v2.y, triangle.v0.x, triangle.v0.y);

	})

	// print voronoi diagram
	voronoiEdges.forEach( function(edge) {
    //line(edge.v0.x, edge.v0.y, edge.v1.x, edge.v1.y);
    //fill(edge.v0.x*20, 60, 60, 40);
	})

  voronoiShapes.forEach( function(setOfEdges,pointIndex) {
    var p = points[pointIndex];
    point(p.x,p.y);

    console.log("drawing polygon around point (" + p.x + "," + p.y + ")");

    beginShape();

    // try different combinations
    //let c = color( p.y%255, 0, p.x%255);
    // let c = color( p.x%255, 0, p.y%255);
    // let c = color( p.x%255, p.y%255, 0);
    // let c = color( p.y%255, p.x%255, 0);
    // let c = color( 0, p.y%255, p.x%255);
    // let c = color( 0, p.x%255, p.y%255);
    //
    // let c = color( p.y%255, ((p.x + p.y)/2)%255 , p.x%255);

    let c;
    if (colors1.checked() && colors2.checked()) {
      c = color( p.x%255, ((p.x + p.y)/2)%255 , p.y%255);
    }
    else if (colors1.checked()) {
      c = color( p.y%255, 0, p.x%255);
    }
    else if (colors2.checked()) {
      c = color( 0, p.x%255, p.y%255);
    }
    else {
      c = color( p.x%255, p.x%255, p.y%255);
    }

    fill(c);
    //stroke( 204, 0, 250);
    noStroke();

    console.log("there are " + setOfEdges.length + " edges");

    // print edges
    for (var i = 0; i < setOfEdges.length; i++) {
      var edge = setOfEdges[i];
    //  console.log("edge : (" + edge.v0.x + "," + edge.v0.y + "), (" + edge.v1.x + "," + edge.v1.y + ")");
    }

    // sort setOfEdges to make sure that vertices are drawn in the correct order
    var sortedEdges = sortSetofEdges(setOfEdges);

    console.log("there are " + sortedEdges.length + " edges after sorting");


    for (var i = 0; i < sortedEdges.length; i++) {
      var edge = sortedEdges[i];
      vertex(edge.v0.x, edge.v0.y);
      vertex(edge.v1.x, edge.v1.y);

      console.log("edge : (" + edge.v0.x + "," + edge.v0.y + "), (" + edge.v1.x + "," + edge.v1.y + ")");

      //line(edge.v0.x, edge.v0.y, edge.v1.x, edge.v1.y);

    }

    endShape(CLOSE);

    point(p.x,p.y);

  })


}

// called when the slider changes the number of voronoi points
function recalculateVoronoi() {

    // reset data structures
    var newPoints = [];

    total_points = slider.value();

    // calculate new voronoi points
    var widthRange = width + 300;
    var heightRange = height + 300;
    // shift some points to be negative
    var shift = 50;


    for (var i = 0; i < total_points; ++i) {
  		newPoints.push(new delaunay.Vertex(Math.floor(Math.random() * widthRange) - shift, Math.floor(Math.random() * heightRange) - shift));
  	}

    newPoints.push(new delaunay.Vertex(mouseX, mouseY));

    // make points past 4 corners every time
    // points.push(new delaunay.Vertex(0,0));
    // points.push(new delaunay.Vertex(0,height));
    // points.push(new delaunay.Vertex(width,0));
    // points.push(new delaunay.Vertex(width,height));

    newPoints.push(new delaunay.Vertex(-shift,-shift));
    newPoints.push(new delaunay.Vertex(-shift, height + shift));
    newPoints.push(new delaunay.Vertex(width + shift, -shift));
    newPoints.push(new delaunay.Vertex(width + shift,height + shift));


  	triangles = delaunay.triangulate(newPoints);

    points = newPoints;

  	// make voronoi diagram
    calculateVoronoi();

}

function mouseMoved() {
  triangles = [];
  voronoiEdges = [];
  voronoiShapes = new Map();

  // remove last point and calculateVoronoi again
  points[total_points] = new delaunay.Vertex(mouseX, mouseY);

  triangles = delaunay.triangulate(points);

	// make voronoi diagram
  calculateVoronoi();

}
// store a map from voronoi point index to a list of vertices that enclose the polygon surrounding a voronoi point
function findPointIndex(p) {
  // search points and find index
  var found = 0;

  for (var i = 0; i < total_points + 5; i++) {
    if (points[i].equals(p)) {
      found = 1;
      return i;
    }
  }

  // if (points[total_points].equals(p)) {
  //   found = 1;
  //   return total_points;
  // }
  //
  // // 4 corners
  // if (points[total_points].equals(p)) {
  //   found = 1;
  //   return total_points;
  // }



  if (found == 0) {
    console.log("error: cant find this point in points");
  }

  return -1;

}

// copied from BELOW and modified
// Remove duplicate edges
var uniqueEdges = function(edges) {
  var uniqueEdges = [];
  for(var i=0;i<edges.length;++i) {
    var duplicates = false;

    // // See if edge is unique
    // for(var j=0;j<edges.length;++j) {
    //   if(i != j && edges[i].equals(edges[j])) {
    //     duplicates = true;
    //
    //     // add it since we want one of each edge (no duplicates)
    //     //uniqueEdges.push(edges[i]);
    //     break;
    //   }
    // }
    var alreadyAdded = false;
    // check if this edge exists in uniqueEdges
    for (var j = 0; j < uniqueEdges.length; ++j) {
      if (uniqueEdges[j].equals(edges[i])) {
        alreadyAdded = true;
      }
    }
    if ( !alreadyAdded) {
      uniqueEdges.push(edges[i]);
    }

  }

  return uniqueEdges;
};

// takes a set of edges and sorts them to make sure that vertices are drawn in the correct order
function sortSetofEdges(edges) {


  var setOfEdges = uniqueEdges(edges);

//  console.log("there are " + setOfEdges.length + " edges after removing duplicates");

  for (var i = 0; i < setOfEdges.length; i++) {
    var edge1 = setOfEdges[i];

    // if we are at the end of the array
    if (i + 1 == setOfEdges.length) {
      // check that that edge connects back to the first one
      if (edge1.v1.equals(setOfEdges[0].v0)) {
        // yay it worked we are done
        console.log("successfully sorted edges!");
        return setOfEdges;
      }
      else {
        console.log("error: last edge does not meet up with first edge!");
        // add another edge between them
      //  setOfEdges.push(new delaunay.Edge(edge1.v1, setOfEdges[0].v0));
        return setOfEdges;
      }
    }

    // find the next edge that connects to this one without changing the
    // orientation of this edge (so assume its sorted up to and including i)
    for (var j = i + 1; j < setOfEdges.length; j++) {
      var edge2 = setOfEdges[j];
      // if the second vertex of edge1 is equal to a vertex of edge2, then they should be next to each other
      if (edge1.v1.equals(edge2.v1) || edge1.v1.equals(edge2.v0)) {
        // if edge1's second vertex is equal to edge2's second vertex
        // check if we need to flip the orientation of edge2
        if (edge1.v1.equals(edge2.v1)) {
          // flip edge2
          var v1 = edge2.v0;
          edge2.v0 = edge2.v1;
          edge2.v1 = v1;
        }

        if (edge1.v1.equals(edge2.v0)) {
          // do nothing
        }

        // if they are already next to each other
        if (j == i + 1) {
          // just make sure edge2 is updated (in case it was flipped)
          setOfEdges[j] = edge2;
        }
        else {
          // then we need to shift things

          // move everything from i + 1 to j - 1 to spots i + 2 to j
          var tempEdge = edge2;
          var tempEdge2 = edge2;
          for (var k = i + 1; k < j + 1; k++) {
            tempEdge = setOfEdges[k];
            setOfEdges[k] = tempEdge2;
            tempEdge2 = tempEdge;
          }

        }

        // break out of for loop because we can go to next i now
        break;
      }


    }
  }

  return setOfEdges;
}

function calculateVoronoi() {



	// if two triangles share a side, add a line between the two circumcenters to the graph
	triangles.forEach( function(triangle1) {

		// for each edge in triangle1, search triangles to find the match
		var edge11 = new delaunay.Edge(triangle1.v0, triangle1.v1);
    var found1 = 0; // flag for if the edge is found
		var edge12 = new delaunay.Edge(triangle1.v1, triangle1.v2);
    var found2 = 0;
		var edge13 = new delaunay.Edge(triangle1.v2, triangle1.v0);
    var found3 = 0;

		triangles.forEach( function(triangle2) {
			var edge21 = new delaunay.Edge(triangle2.v0, triangle2.v1);
			var edge22 = new delaunay.Edge(triangle2.v1, triangle2.v2);
			var edge23 = new delaunay.Edge(triangle2.v2, triangle2.v0);

			// check edges and make sure its not the same triangle
      // if all 3 edges of triangle1 are shared, then its the same triangle so dont count it
			if ((edge11.equals(edge21) && !edge12.equals(edge22)) || edge11.equals(edge22) || edge11.equals(edge23) ) {
        // add a line between circumcenters
        var newEdge = new delaunay.Edge(triangle1.circumcenter(), triangle2.circumcenter());
        voronoiEdges.push(newEdge);

        // add edge to map from voronoi points to edges in polygon surrounding it
        var point1index = findPointIndex(triangle1.v0);
         if (voronoiShapes.has(point1index) ) {
           voronoiShapes.get(point1index).push(newEdge);
         }
         else {
           var emptyEdges = [];
           emptyEdges.push(newEdge);
           voronoiShapes.set(point1index,emptyEdges);
         }

         var point2index = findPointIndex(triangle1.v1);
          if (voronoiShapes.has(point2index) ) {
            voronoiShapes.get(point2index).push(newEdge);
          }
          else {
            var emptyEdges = [];
            emptyEdges.push(newEdge);
            voronoiShapes.set(point2index,emptyEdges);
          }
      }
      if (edge12.equals(edge21) || (edge12.equals(edge22) && !edge11.equals(edge21))|| edge12.equals(edge23) ) {
        // add a line between circumcenters
        var newEdge = new delaunay.Edge(triangle1.circumcenter(), triangle2.circumcenter());
        voronoiEdges.push(newEdge);

        // add edge to map from voronoi points to edges in polygon surrounding it
        var point1index = findPointIndex(triangle1.v1);
         if (voronoiShapes.has(point1index) ) {
           voronoiShapes.get(point1index).push(newEdge);
         }
         else {
           var emptyEdges = [];
           emptyEdges.push(newEdge);
           voronoiShapes.set(point1index,emptyEdges);
         }

         var point2index = findPointIndex(triangle1.v2);
          if (voronoiShapes.has(point2index) ) {
            voronoiShapes.get(point2index).push(newEdge);
          }
          else {
            var emptyEdges = [];
            emptyEdges.push(newEdge);
            voronoiShapes.set(point2index,emptyEdges);
          }
      }
      if(edge13.equals(edge21) || edge13.equals(edge22) || (edge13.equals(edge23) && !edge12.equals(edge22))  ) {
        // add a line between circumcenters
        var newEdge = new delaunay.Edge(triangle1.circumcenter(), triangle2.circumcenter());
        voronoiEdges.push(newEdge);

        // add edge to map from voronoi points to edges in polygon surrounding it
        var point1index = findPointIndex(triangle1.v2);
         if (voronoiShapes.has(point1index) ) {
           voronoiShapes.get(point1index).push(newEdge);
         }
         else {
           var emptyEdges = [];
           emptyEdges.push(newEdge);
           voronoiShapes.set(point1index,emptyEdges);
         }

         var point2index = findPointIndex(triangle1.v0);
          if (voronoiShapes.has(point2index) ) {
            voronoiShapes.get(point2index).push(newEdge);
          }
          else {
            var emptyEdges = [];
            emptyEdges.push(newEdge);
            voronoiShapes.set(point2index,emptyEdges);
          }

      }

		})


	})
}



/// EVERYTHING BELOW IS NOT MY WORK (I MODIFIED PARTS SLIGHTLY) BUT IT IS FREE TO USE WITH THE LICENSE

// Delaunay Triangulation based on Bowyer–Watson algorithm
// http://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm
(function(exports) {

	// Vertex
	var Vertex = function(x, y) {
		return {
			x: x,
			y: y,
			equals: function(vertex) {
				return Math.floor(this.x) === Math.floor(vertex.x) && Math.floor(this.y) == Math.floor(vertex.y);
			}
		};
	};

	// Edge
	var Edge = function(v0, v1) {
		return {
			v0: v0,
			v1: v1,
			equals: function(edge) {
				return (this.v0.equals(edge.v0) && this.v1.equals(edge.v1)) ||
					(this.v0.equals(edge.v1) && this.v1.equals(edge.v0));
			},
			inverse: function() {
				return new Edge(this.v1, this.v0);
			}
		};
	};

	// Triangle
	var Triangle = function(v0, v1, v2) {
		var triangle = {
			v0: v0,
			v1: v1,
			v2: v2,
			calcCircumcircle: function() {
				// Reference: http://www.faqs.org/faqs/graphics/algorithms-faq/ Subject 1.04
				var A = this.v1.x - this.v0.x;
				var B = this.v1.y - this.v0.y;
				var C = this.v2.x - this.v0.x;
				var D = this.v2.y - this.v0.y;

				var E = A * (this.v0.x + this.v1.x) + B * (this.v0.y + this.v1.y);
				var F = C * (this.v0.x + this.v2.x) + D * (this.v0.y + this.v2.y);

				var G = 2.0 * (A * (this.v2.y - this.v1.y) - B * (this.v2.x - this.v1.x));

				var dx, dy;

				// Collinear points, get extremes and use midpoint as center
				if(Math.round(Math.abs(G)) == 0) {
					var minx = Math.min(this.v0.x, this.v1.x, this.v2.x);
					var miny = Math.min(this.v0.y, this.v1.y, this.v2.y);
					var maxx = Math.max(this.v0.x, this.v1.x, this.v2.x);
					var maxy = Math.max(this.v0.y, this.v1.y, this.v2.y);

					this.center = new Vertex((minx + maxx) / 2, (miny + maxy) / 2);

					dx = this.center.x - minx;
					dy = this.center.y - miny;
				} else {
					var cx = (D * E - B * F) / G;
					var cy = (A * F - C * E) / G;

					this.center = new Vertex(cx, cy);

					dx = this.center.x - this.v0.x;
					dy = this.center.y - this.v0.y;
				}
				this.radius = Math.sqrt(dx * dx + dy * dy);
			},
			inCircumcircle: function(v) {
				var dx = this.center.x - v.x;
				var dy = this.center.y - v.y;
				return Math.sqrt(dx * dx + dy * dy) <= this.radius;
			},
			circumcenter: function() {
				return this.center;
			}
		};

		triangle.calcCircumcircle();
		return triangle;
	};

	// Triangle that bounds given vertices
	var superTriangle = function(vertices) {
		var minx = miny = Infinity,
			maxx = maxy = -Infinity;
		vertices.forEach(function(vertex) {
			minx = Math.min(minx, vertex.x);
			miny = Math.min(minx, vertex.y);
			maxx = Math.max(maxx, vertex.x);
			maxy = Math.max(maxx, vertex.y);
		});

		var dx = (maxx - minx) * 10,
			dy = (maxy - miny) * 10;

		var v0 = new Vertex(minx - dx, miny - dy * 3),
			v1 = new Vertex(minx - dx, maxy + dy),
			v2 = new Vertex(maxx + dx * 3, maxy + dy);

		return new Triangle(v0, v1, v2);
	};

	// Update array of triangles by adding a new vertex
	var addVertex = function(vertex, triangles) {
		var edges = [];

		// Remove triangles with circumcircles containing the vertex
		triangles = triangles.filter(function(triangle) {
			if(triangle.inCircumcircle(vertex)) {
				edges.push(new Edge(triangle.v0, triangle.v1));
				edges.push(new Edge(triangle.v1, triangle.v2));
				edges.push(new Edge(triangle.v2, triangle.v0));
				return false;
			}
			return true;
		});

		// Get unique edges
		edges = uniqueEdges(edges);

		// Create new triangles from the unique edges and new vertex
		edges.forEach(function(edge) {
			triangles.push(new Triangle(edge.v0, edge.v1, vertex));
		});

		return triangles;
	};

	// Remove duplicate edges
	var uniqueEdges = function(edges) {
		var uniqueEdges = [];
		for(var i=0;i<edges.length;++i) {
			var isUnique = true;

			// See if edge is unique
			for(var j=0;j<edges.length;++j) {
				if(i != j && edges[i].equals(edges[j])) {
					isUnique = false;
					break;
				}
			}

			// Edge is unique, add to unique edges array
			isUnique && uniqueEdges.push(edges[i]);
		}

		return uniqueEdges;
	};

	// Export Vertex, Edge and Triangle
	exports.Vertex = Vertex;
	exports.Edge = Edge;
	exports.Triangle = Triangle;


	// Perform Delaunay Triangulation for array of vertices and return array of triangles
	exports.triangulate = function(vertices) {
		// Create bounding 'super' triangle
		var st = superTriangle(vertices);

		// Initialize triangles while adding bounding triangle
		var triangles = [st];

		// Triangulate each vertex
		vertices.forEach(function(vertex) {
			triangles = addVertex(vertex, triangles);
		});

		// Remove triangles that share edges with super triangle
		triangles = triangles.filter(function(triangle) {
			return !(triangle.v0 == st.v0 || triangle.v0 == st.v1 || triangle.v0 == st.v2 ||
				triangle.v1 == st.v0 || triangle.v1 == st.v1 || triangle.v1 == st.v2 ||
				triangle.v2 == st.v0 || triangle.v2 == st.v1 || triangle.v2 == st.v2);
		});

		return triangles;
	};

})(typeof exports === 'undefined' ? this['delaunay'] = {} : exports);
