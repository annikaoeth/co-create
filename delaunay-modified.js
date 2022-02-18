// added by Annika Oeth
var points = [];
var total_points = 10;
var triangles;
var voronoiEdges = [];

function setup() {
  width = windowWidth;
  height = windowHeight;
  let canvas = createCanvas(width, height);
  canvas.parent('sketch-container');

  // calculate new voronoi points
  for (var i = 0; i < total_points; ++i) {
		points.push(new delaunay.Vertex(Math.floor(Math.random() * width), Math.floor(Math.random() * height)));
	}

	triangles = delaunay.triangulate(points);

	// make voronoi diagram
  calculateVoronoi();


  // makes draw only get called once
  noLoop();
}

function draw() {

  if (mouseIsPressed) {
  //  fill(0);
  } else {
  //  fill(255);
  }

	strokeWeight(10);


  // change the frameRate?

	points.forEach( function(p) {
    point(p.x,p.y);
  })



	// print delaunay triangulation
	// triangles.forEach( function(triangle) {
	// 	line(triangle.v0.x, triangle.v0.y, triangle.v1.x, triangle.v1.y);
	// 	line(triangle.v1.x, triangle.v1.y, triangle.v2.x, triangle.v2.y);
	// 	line(triangle.v2.x, triangle.v2.y, triangle.v0.x, triangle.v0.y);
  //
	// })

	// print voronoi diagram
	voronoiEdges.forEach( function(edge) {
    line(edge.v0.x, edge.v0.y, edge.v1.x, edge.v1.y);
	})


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
			if ((edge11.equals(edge21) && !edge12.equals(edge22)) || edge11.equals(edge22) || edge11.equals(edge23) ||
          edge12.equals(edge21) || (edge12.equals(edge22) && !edge11.equals(edge21))|| edge12.equals(edge23) ||
          edge13.equals(edge21) || edge13.equals(edge22) || (edge13.equals(edge23) && !edge12.equals(edge22))  ) {
        // add a line between circumcenters
        voronoiEdges.push(new delaunay.Edge(triangle1.circumcenter(), triangle2.circumcenter()));
        found1 = 1;
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
				return this.x === vertex.x && this.y == vertex.y;
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
