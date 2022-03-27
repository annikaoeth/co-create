// global variables

// store a list of points
var pointsList = new Set();
var total_points = 10;
var triangleList = new Set();
var finalEdges = new Set();

function setup() {
  width = windowWidth;
  height = windowHeight;
  let canvas = createCanvas(width, height);
  canvas.parent('sketch-container');

  pointsList = new Set();

  // calculate new voronoi points
  randomizeVoronoi();

  // makes draw only get called once
  noLoop();
}

function draw() {

  if (mouseIsPressed) {
  //  fill(0);
  } else {
  //  fill(255);
  }

  //ellipse(mouseX, mouseY, 80, 80);

  // change the frameRate


  strokeWeight(10);


  calculateVoronoi();

  // print lines
  finalEdges.forEach( function(edge) {
    line(edge.p1.xval, edge.p1.yval, edge.p2.xval, edge.p2.yval);
  })

}


function calculateVoronoi() {
  // use mouse location as a point???


  // draw each point
  pointsList.forEach( function(p) {
    point(p.xval,p.yval);
  })

  // first calculate Delunay triangulation by using the Bowyer-Watson algorithm
  // https://www.baeldung.com/cs/voronoi-diagram
  // https://en.wikipedia.org/wiki/Bowyer%E2%80%93Watson_algorithm

  //triangleList.clear();

  // add super triangle to triangleList
  const p1 = new Point(0,0,0);
  const p2 = new Point(0, 2*height,0);
  const p3 = new Point(2*width, 0,0);
  const c = new Point(0,0,0);
  const superT = new Triangle(p1,p2,p3,c);
  triangleList.add(superT);

  console.log("points list contains " + pointsList.size + " original points");

  // add all the points one at a time to the triangle list (triangulation)
  pointsList.forEach( function(p) {
    // a map from edges to triangles in badTriangles
    var edges = [];
    var badTriangles = new Set();

    console.log("triangle list contains " + triangleList.size + " triangles");

    // for each triangle in triangleList
    triangleList.forEach( function(triangle) {



      // find circumcenter by intersecting perpendicular bisectors
      // https://www.cuemath.com/geometry/circumcenter/

      // perpendicular bisector 1
      const mid1 = new Point((triangle.p1.xval + triangle.p2.xval)/2, (triangle.p1.yval + triangle.p2.yval)/2, 0);
      const slope1 = new Point(triangle.p3.xval - mid1.xval,triangle.p3.yval - mid1.yval, 0);
      const bisector1 = new Point(mid1.xval + slope1.yval, mid1.yval - slope1.xval, 0);

      // perpendicular bisector 2
      const mid2 = new Point((triangle.p3.xval + triangle.p2.xval)/2, (triangle.p3.yval + triangle.p2.yval)/2, 0);
      const slope2 = new Point(triangle.p1.xval - mid2.xval, triangle.p1.yval - mid2.yval, 0);
      const bisector2 = new Point(mid2.xval + slope2.yval, mid2.yval - slope2.xval, 0);

      console.log("midpoint = " + mid1.xval + ", " + mid1.yval);

      // figure out where they intersect - that is the circumcenter
      //var y1 = (-1/slope1)*(mid1.xval);
      var circ = new findLineIntersection(mid1, bisector1, mid2, bisector2);
      const circumcenter = new Point (circ.xval, circ.yval, 0);

      // figure out if point p is inside circle
      var radius = dist(triangle.p1.xval, triangle.p1.yval, circumcenter.xval, circumcenter.yval);

      var distToPoint = dist(p.xval, p.yval, circumcenter.xval, circumcenter.yval);

      triangle.center = circumcenter;


      // if point is inside circumcircle of triangle
      if (distToPoint <= radius) {
        console.log("point is inside circumcircle");

        // add triangle to badTriangles
        badTriangles.add(triangle);
        edges.push(new Edge(triangle.p1, triangle.p2));
        edges.push(new Edge(triangle.p2, triangle.p3));
        edges.push(new Edge(triangle.p3, triangle.p1));


/*
        const tp1 = new Point(triangle.p1.xval, triangle.p1.yval, 0);
        const tp2 = new Point(triangle.p2.xval, triangle.p2.yval, 0);
        const tp3 = new Point(triangle.p3.xval, triangle.p3.yval, 0);


        // each edge is mapped to this triangle in the edge map (each edge counted twice)
        const e1 = new Edge(tp1, tp2);
        const e2 = new Edge(tp2, tp3);
        const e3 = new Edge(tp3, tp1);
        const e4 = new Edge(tp2, tp1);
        const e5 = new Edge(tp3, tp2);
        const e6 = new Edge(tp1, tp3);

        if (edgeMap.has(e1)) {
          edgeMap.get(e1).push(triangle);
        }
        else {
          const emptyTriangleSet = [];
          emptyTriangleSet.push(triangle);
          edgeMap.set(e1, emptyTriangleSet);
        }

        if (edgeMap.has(e2)) {
          edgeMap.get(e2).push(triangle);
        }
        else {
          const emptyTriangleSet = [];
          emptyTriangleSet.push(triangle);
          edgeMap.set(e2, emptyTriangleSet);
        }

        if (edgeMap.has(e3)) {
          edgeMap.get(e3).push(triangle);
        }
        else {
          const emptyTriangleSet = [];
          emptyTriangleSet.push(triangle);
          edgeMap.set(e3, emptyTriangleSet);
        }

        if (edgeMap.has(e4)) {
          edgeMap.get(e4).push(triangle);
        }
        else {
          const emptyTriangleSet = [];
          emptyTriangleSet.push(triangle);
          edgeMap.set(e4, emptyTriangleSet);
        }

        if (edgeMap.has(e5)) {
          edgeMap.get(e5).push(triangle);
        }
        else {
          const emptyTriangleSet = [];
          emptyTriangleSet.push(triangle);
          edgeMap.set(e5, emptyTriangleSet);
        }

        if (edgeMap.has(e6)) {
          edgeMap.get(e6).push(triangle);
        }
        else {
          const emptyTriangleSet = [];
          emptyTriangleSet.push(triangle);
          edgeMap.set(e6, emptyTriangleSet);
        }


*/


      }
    })

    // console.log("edge map contains: ");
    // edgeMap.forEach( function (triangleSet,edge) {
    //   if (edge.p1 && edge.p2) {
    //     console.log("(" + (edge.p1).xval + ", " + (edge.p1).yval + ") to ("  + (edge.p2).xval + ", " + (edge.p2).yval + ")" );
    //   }
    //   else {
    //     console.log("why can't i read the points :(( ");
    //   }
    //
    //   console.log("   shared by triangles: ");
    //   for (var i = 0; i < triangleSet.size; i++) {
    //     const t = triangleSet[i];
    //     console.log("(" + t.p1.xval + ", " + t.p1.yval + "),("  + t.p2.xval + ", " + t.p2.yval + "),("  + t.p3.xval + ", " + t.p3.yval + ")");
    //   }
    //
    // })

    var polygon = new Set();

    console.log("bad triangle list contains " + badTriangles.size + " bad triangles");

    // check if two edges match
    edges = uniqueEdges(edges);

    edges.forEach( function(edge) {
      triangleList.add(new Triangle(edge.p1, edge.p2, p, c));
    });

/*
    badTriangles.forEach( function (triangle1) {

      // flag variables that are 0 when edge is not shared
      var e1 = 0;
      var e2 = 0;
      var e3 = 0;

      badTriangles.forEach( function (triangle2) {
        const vertices = [];
        var verticesShared = 0;

        // if triangle1 and triangle2 share two vertices then they share an edge
        if (checkIfPointsAreEqual(triangle1.p1, triangle2.p1)) {
          vertices.push(triangle1.p1);
          verticesShared++;
        }

        if (checkIfPointsAreEqual(triangle1.p1, triangle2.p2)) {
          vertices.push(triangle1.p1);
          verticesShared++;
        }

        if (checkIfPointsAreEqual(triangle1.p1, triangle2.p3)) {
          vertices.push(triangle1.p1);
          verticesShared++;
        }

        if (checkIfPointsAreEqual(triangle1.p2, triangle2.p1)) {
          vertices.push(triangle1.p2);
          verticesShared++;
        }
        if (checkIfPointsAreEqual(triangle1.p2, triangle2.p2)) {
          vertices.push(triangle1.p2);
          verticesShared++;
        }
        if (checkIfPointsAreEqual(triangle1.p2, triangle2.p3)) {
          vertices.push(triangle1.p2);
          verticesShared++;
        }

        if (checkIfPointsAreEqual(triangle1.p3, triangle2.p1)) {
          vertices.push(triangle1.p3);
          verticesShared++;
        }
        if (checkIfPointsAreEqual(triangle1.p3, triangle2.p2)) {
          vertices.push(triangle1.p3);
          verticesShared++;
        }
        if (checkIfPointsAreEqual(triangle1.p3, triangle2.p3)) {
          vertices.push(triangle1.p3);
          verticesShared++;
        }


        if (verticesShared == 2) {
          // they do share an edge


          // check which edge and update flags
          // check e1
          if ((checkIfPointsAreEqual(triangle1.p1, vertices[0]) && checkIfPointsAreEqual(triangle1.p2, vertices[1]))
          || (checkIfPointsAreEqual(triangle1.p1, vertices[1]) && checkIfPointsAreEqual(triangle1.p2, vertices[0]))) {
            e1 = 1;
          }
          // check e2
          if ((checkIfPointsAreEqual(triangle1.p2, vertices[0]) && checkIfPointsAreEqual(triangle1.p3, vertices[1]))
          || (checkIfPointsAreEqual(triangle1.p2, vertices[1]) && checkIfPointsAreEqual(triangle1.p3, vertices[0]))) {
            e2 = 1;
          }
          // check e3
          if ((checkIfPointsAreEqual(triangle1.p3, vertices[0]) && checkIfPointsAreEqual(triangle1.p1, vertices[1]))
          || (checkIfPointsAreEqual(triangle1.p3, vertices[1]) && checkIfPointsAreEqual(triangle1.p1, vertices[0]))) {
            e3 = 1;
          }
        }


      })

      // for each edge in triangle
      // if edge is not shared by any other bad triangles, add edge to polygon
      if (e1 == 0) {
        const edge1 = new Edge(triangle1.p1, triangle1.p2);
        polygon.add(edge1);
      }
      if (e2 == 0) {
        const edge2 = new Edge(triangle1.p2, triangle1.p3);
        polygon.add(edge2);
      }
      if (e3 == 0) {
        const edge3 = new Edge(triangle1.p3, triangle1.p1);
        polygon.add(edge3);
      }

    })
    */
  //  printTriangleList();


    badTriangles.forEach( function (triangle) {
      // remove bad triangles from triangleList
      triangleList.delete(triangle);
    })

    console.log("triangles list contains " + triangleList.size + " triangles after removing bad triangles");
    //printTriangleList();


    // console.log("polygon contains " + polygon.size + " edges");

    // for each edge in polygon
    // re-triangulate the polygonal hole
    // polygon.forEach( function(edge) {
    //   // form a triangle from edge to point
    //   const tri = new Triangle(edge.p1, edge.p2, p, c);
    //
    //   triangleList.add(tri);
    // })

    // console.log("triangles list contains " + triangleList.size + " triangles after re-triangulating");
  //  printTriangleList();


  })

  triangleList.forEach( function(triangle) {
    // if triangle contains a vertex from original super triangle, remove triangle

    if (triangle.p1 == p1 || triangle.p1 == p2 || triangle.p1 == p3 ||
        triangle.p2 == p1 || triangle.p2 == p2 || triangle.p2 == p3 ||
        triangle.p3 == p1 || triangle.p3 == p2 || triangle.p3 == p3) {
          triangleList.delete(triangle);
        }
  })

  // done!

  console.log("triangles list contains " + triangleList.size + " total triangles in delaunay triangulation");


  // print Delaunay triangulation for testing
  printTriangleList();

  // array of edges
  const edgeMap = [];

  // cant store this in a map = change it to something else
  // cant store in a set either because edge objects cant be compared so you have to somehow loop through (double for loop -> O(n^2))
  // AHHH painn


  triangleList.forEach( function(triangle) {
    // if triangle doesn't have a circumcenter
    if (triangle.center.xval == 0 && triangle.center.yval == 0) {

    }
    else {
      // set up edge map
      // each edge is mapped to this triangle in the edge map (each edge counted twice)
    /*  const e1 = new Edge(triangle.p1, triangle.p2);
      const e2 = new Edge(triangle.p2, triangle.p3);
      const e3 = new Edge(triangle.p3, triangle.p1);
      const e4 = new Edge(triangle.p2, triangle.p1);
      const e5 = new Edge(triangle.p3, triangle.p2);
      const e6 = new Edge(triangle.p1, triangle.p3);

      if (edgeMap.has(e1)) {
        edgeMap.get(e1).push(triangle);
      }
      else {
        const emptyTriangleSet = [];
        emptyTriangleSet.push(triangle);
        edgeMap.set(e1, emptyTriangleSet);
      }

      if (edgeMap.has(e2)) {
        edgeMap.get(e2).push(triangle);
      }
      else {
        const emptyTriangleSet = [];
        emptyTriangleSet.push(triangle);
        edgeMap.set(e2, emptyTriangleSet);
      }

      if (edgeMap.has(e3)) {
        edgeMap.get(e3).push(triangle);
      }
      else {
        const emptyTriangleSet = [];
        emptyTriangleSet.push(triangle);
        edgeMap.set(e3, emptyTriangleSet);
      }

      if (edgeMap.has(e4)) {
        edgeMap.get(e4).push(triangle);
      }
      else {
        const emptyTriangleSet = [];
        emptyTriangleSet.push(triangle);
        edgeMap.set(e4, emptyTriangleSet);
      }

      if (edgeMap.has(e5)) {
        edgeMap.get(e5).push(triangle);
      }
      else {
        const emptyTriangleSet = [];
        emptyTriangleSet.push(triangle);
        edgeMap.set(e5, emptyTriangleSet);
      }

      if (edgeMap.has(e6)) {
        edgeMap.get(e6).push(triangle);
      }
      else {
        const emptyTriangleSet = [];
        emptyTriangleSet.push(triangle);
        edgeMap.set(e6, emptyTriangleSet);
      }
      */

    }
  })



  // find lines between circumcenters and neighboring triangles circumcenters
  triangleList.forEach( function(triangle1) {


    triangleList.forEach( function (triangle2) {

    })


    // // if more than one triangle has this edge
    // if (triangleSet.size() == 2) {
    //   var circumcenter = triangleSet[0];
    //   var otherCircumcenter = triangleSet[1];
    //
    //
    //   const edgeBetween = new Edge(circumcenter, otherCircumcenter);
    //   finalEdges.add(edgeBetween);
    //
    //   // remove other edge from edgeMap
    //   const reverse = new Edge(edge.p2, edge.p1);
    //   edgeMap.delete(reverse);
    // }


  })



}

// intersection between line AB and CD
// https://www.geeksforgeeks.org/program-for-point-of-intersection-of-two-lines/
function findLineIntersection(A,B,C,D) {

    // Line AB represented as a1x + b1y = c1
    var a1 = B.yval - A.yval;
    var b1 = A.xval - B.xval;
    var c1 = a1*(A.xval) + b1*(A.yval);

    // Line CD represented as a2x + b2y = c2
    var a2 = D.yval - C.yval;
    var b2 = C.xval - D.xval;
    var c2 = a2*(C.xval)+ b2*(C.yval);

    var determinant = a1*b2 - a2*b1;

    if (determinant == 0)
    {
        // The lines are parallel
    }
    else
    {
        var x = (b2*c1 - b1*c2)/determinant;
        var y = (a1*c2 - a2*c1)/determinant;
    }

    this.xval = x;
    this.yval = y;

}

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



// total_points comes from user input ?
// calculate new voronoi points
function randomizeVoronoi() {

  pointsList.clear();

  // create a random
  for (let i = 0; i < total_points; i++) {
    var x = getRandomInt(0, width);
    var y = getRandomInt(0, height);
    var z = getRandomInt(0, height);

    const point1 = new Point(x,y,z);

    pointsList.add(point1);
  }
}
function printTriangleList() {
  triangleList.forEach( function(triangle) {
    line(triangle.p1.xval, triangle.p1.yval, triangle.p2.xval, triangle.p2.yval);
    line(triangle.p2.xval, triangle.p2.yval, triangle.p3.xval, triangle.p3.yval);
    line(triangle.p1.xval, triangle.p1.yval, triangle.p3.xval, triangle.p3.yval);

  })
}

class Point {
  constructor(x, y, z) {
      this.xval = x;
      this.yval = y;
      this.zval = z;
  }
}

class Edge {
  constructor(point1, point2) {
      this.p1 = point1;
      this.p2 = point2;
  }
  equals(edge) {
    return ((checkIfPointsAreEqual(this.p1, edge.p1) && checkIfPointsAreEqual(this.p2, edge.p2)) ||
    (checkIfPointsAreEqual(this.p1, edge.p2) && checkIfPointsAreEqual(this.p2, edge.p1)));
    
  }
}

class Triangle {
  constructor(point1, point2, point3, c) {
      this.p1 = point1;
      this.p2 = point2;
      this.p3 = point3;
      this.center = c;
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// if points are equal, return 1, 0 if not
function checkIfPointsAreEqual(point1, point2) {

  if (point1.xval == point2.xval && point1.yval == point2.yval && point1.zval == point2.zval) {
    return 1;
  }

  return 0;
}
